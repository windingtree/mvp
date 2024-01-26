import 'dotenv/config';
import { EventHandler } from '@libp2p/interface/events';
import {
  createPublicClient,
  createWalletClient,
  http,
  zeroAddress,
} from 'viem';
import { randomSalt } from '@windingtree/contracts';
import {
  contractsConfig,
  nodeTopic,
  offerExpiration,
  RequestQuery,
  serverAddress,
} from 'mvp-shared-files';
import { DealStatus, OfferData, PaymentOption } from '@windingtree/sdk-types';
import {
  DealHandlerOptions,
  OfferOptions,
  RequestHandlerOptions,
} from '../types.js';
import { noncePeriod } from '@windingtree/sdk-constants';
import { JobHandler, Queue } from '@windingtree/sdk-queue';
import {
  NodeApiServer,
  NodeApiServerOptions,
  router,
} from '@windingtree/sdk-node-api/server';
import {
  adminRouter,
  dealsRouter,
  serviceRouter,
  userRouter,
} from '@windingtree/sdk-node-api/router';
import { AirplaneInput, airplanesRouter } from '../api/airplanesRoute.js';
import { ProtocolContracts } from '@windingtree/sdk-contracts-manager';
import { levelStorage } from '@windingtree/sdk-storage';
import { parseSeconds } from '@windingtree/sdk-utils';
import {
  createNode,
  Node,
  NodeOptions,
  NodeRequestManager,
  RequestEvent,
} from '@windingtree/sdk-node';
import { createLogger } from '@windingtree/sdk-logger';
import { config } from '../common/config.js';
import { DateTime } from 'luxon';

const appRouter = router({
  service: serviceRouter,
  admin: adminRouter,
  user: userRouter,
  deals: dealsRouter,
  airlines: airplanesRouter,
});

export type AppRouter = typeof appRouter;

const logger = createLogger('MvpNodeController');

/** Handles UFOs */
process.once('unhandledRejection', (error) => {
  logger.trace('🛸 Unhandled rejection', error);
  process.exit(1);
});

const createJobHandler =
  <JobData = unknown, HandlerOptions = unknown>(
    handler: JobHandler<JobData, HandlerOptions>,
  ) =>
  (options: HandlerOptions = {} as HandlerOptions) =>
  (data: JobData) =>
    handler(data, options);

/**
 * This handler looking up for a deal
 */
const dealHandler = createJobHandler<
  OfferData<RequestQuery, OfferOptions>,
  DealHandlerOptions
>(async (offer, options) => {
  if (!offer || !options) {
    throw new Error('Invalid job execution configuration');
  }

  const { contracts, dealsDb } = options;

  if (!contracts) {
    throw new Error('Contracts manager must be provided to job handler config');
  }

  logger.trace(`Checking for a deal. Offer #${offer.id}`);

  // Check for a deal
  const [created, offerPayload, retailerId, buyer, price, asset, status] =
    await contracts.getDeal(offer);

  // Deal must be exists and not cancelled
  if (buyer !== zeroAddress && status === Number(DealStatus.Created)) {
    // check for double booking in the availability system
    // If double booking detected - rejects (and refunds) the deal

    // If not detected - claims the deal
    await contracts.claimDeal(
      offer,
      undefined,
      (txHash: string, txSubj?: string) => {
        logger.trace(
          `Offer #${offer.payload.id} ${txSubj ?? 'claim'} tx hash: ${txHash}`,
        );
      },
    );

    await dealsDb.set({
      chainId: Number(offerPayload.chainId),
      created,
      offer,
      retailerId,
      buyer,
      price,
      asset,
      status: DealStatus.Claimed,
    });

    return false; // Returning false means that the job must be stopped
  }

  return true; // Job continuing
});

/**
 * This handler creates offer then publishes it and creates a job for deal handling
 */
const createRequestsHandler =
  (
    node: Node<RequestQuery, OfferOptions>,
    options: RequestHandlerOptions,
  ): EventHandler<CustomEvent<RequestEvent<RequestQuery>>> =>
  ({ detail }) => {
    const handler = async () => {
      logger.trace(`📨 Request on topic #${detail.topic}:`, detail.data);
      const { airplanesDb, offersDb } = options;

      for (const record of await airplanesDb.entries<AirplaneInput>()) {
        const airplane = {
          id: record[0],
          ...record[1],
        };

        const timingCoefficients = processTimingCoefficients(
          airplane.minTime,
          airplane.maxTime,
        );

        for (const timingCoefficient of timingCoefficients) {
          const paymentOptions: PaymentOption[] = airplane.price.map((i) => {
            return {
              id: randomSalt(),
              price: BigInt(+i.value * timingCoefficient),
              asset: i.token as `0x${string}`,
            };
          });

          const nowTimestamp = BigInt(DateTime.now().toSeconds());

          const offer = await node.makeOffer({
            /** Offer expiration time */
            expire: offerExpiration,
            /** Copy of request */
            request: detail.data,
            options: {
              date: detail.data.query.date,
              airplane: mapAirplane(airplane),
            },
            payment: paymentOptions,
            /** Cancellation options */
            cancel: [
              // {
              //   time: BigInt(nowSec() + 500),
              //   penalty: BigInt(100),
              // },
            ],
            /** Check-in time */
            checkIn: nowTimestamp,
            checkOut: nowTimestamp,
          });

          await offersDb.set(offer.id, offer);
        }
      }
    };

    handler().catch(logger.error);
  };

const processTimingCoefficients = (
  minTime: number,
  maxTime: number,
): number[] => {
  const timingCoefficients = [minTime];
  let time = minTime;

  while (time < maxTime) {
    time = time + config.offerGap;
    if (time > maxTime) {
      timingCoefficients.push(maxTime);
    } else {
      timingCoefficients.push(+time.toFixed(1));
    }
  }

  return timingCoefficients;
};

const mapAirplane = (
  airplane: AirplaneInput,
): Omit<AirplaneInput, 'minTime' | 'maxTime' | 'price'> => {
  return {
    id: airplane.id,
    name: airplane.name,
    description: airplane.description,
    capacity: airplane.capacity,
    media: airplane.media,
  };
};

/**
 * Starts the suppliers node
 *
 * @returns {Promise<void>}
 */
export const main = async (): Promise<void> => {
  //todo check smart contract status
  //todo listen to ToggleEnabled event smart contract every new block and shutdown service if config == false

  const options: NodeOptions = {
    topics: [nodeTopic],
    chain: config.chain,
    contracts: contractsConfig,
    serverAddress,
    supplierId: config.supplierId,
    signerSeedPhrase: config.signerMnemonic,
    signerPk: config.signerPk,
  };
  const node = createNode<RequestQuery, OfferOptions>(options);

  node.addEventListener('start', () => {
    logger.trace('🚀 Node started at', new Date().toISOString());
  });

  node.addEventListener('connected', () => {
    logger.trace('🔗 Node connected to server at:', new Date().toISOString());
  });

  node.addEventListener('stop', () => {
    logger.trace('👋 Node stopped at:', new Date().toISOString());
  });

  const contractsManager = new ProtocolContracts({
    contracts: contractsConfig,
    publicClient: createPublicClient({
      chain: config.chain,
      transport: http(),
    }),
    walletClient: createWalletClient({
      chain: config.chain,
      transport: http(),
      account: node.signer.address,
    }),
  });

  const queueStorage = await levelStorage.createInitializer({
    path: './queue.db',
    scope: 'queue',
  })();
  const usersStorage = await levelStorage.createInitializer({
    path: './users.db',
    scope: 'users',
  })();
  const dealsStorage = await levelStorage.createInitializer({
    path: './deals.db',
    scope: 'deals',
  })();
  const airplanesStorage = await levelStorage.createInitializer({
    path: './airplanes.db',
    scope: 'airplanes',
  })();
  const offerDb = await levelStorage.createInitializer({
    path: './offer.db',
    scope: 'offer',
  })();
  // console.log('@@@', await usersStorage.entries());

  const apiServerConfig: NodeApiServerOptions = {
    storage: {
      users: usersStorage,
      deals: dealsStorage,
      airplanes: airplanesStorage,
    },
    prefix: 'test',
    port: 3456,
    secret: 'secret',
    ownerAccount: config.entityOwnerAddress,
    protocolContracts: contractsManager,
    cors: config.cors,
  };

  const apiServer = new NodeApiServer(apiServerConfig);

  // TODO: Show better URL
  logger.trace(`Node API URL: http://localhost:${apiServerConfig.port}`);

  apiServer.start(appRouter);

  const queue = new Queue({
    storage: queueStorage,
    idsKeyName: 'jobsIds',
    concurrencyLimit: 3,
  });

  const requestManager = new NodeRequestManager<RequestQuery>({
    noncePeriod: Number(parseSeconds(noncePeriod)),
  });

  requestManager.addEventListener(
    'request',
    createRequestsHandler(node, {
      airplanesDb: airplanesStorage,
      offersDb: offerDb,
    }),
  );

  node.addEventListener('heartbeat', () => {
    requestManager.prune();
  });

  node.addEventListener('message', (e) => {
    const { topic, data } = e.detail;
    // here you are able to pre-validate arrived messages
    requestManager.add(topic, data);
  });

  queue.registerHandler(
    'deal',
    dealHandler({
      contracts: contractsManager,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      dealsDb: apiServer.deals!,
    }),
  );

  /**
   * Graceful Shutdown handler
   */
  const shutdown = () => {
    const stopHandler = async () => {
      await apiServer.stop();
      await node.stop();
    };
    stopHandler()
      .catch((error) => {
        logger.trace(error);
        process.exit(1);
      })
      .finally(() => process.exit(0));
  };

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);

  await node.start();
};
