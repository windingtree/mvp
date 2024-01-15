import 'dotenv/config';
import { EventHandler } from '@libp2p/interface/events';
import { DateTime } from 'luxon';
import {
  zeroAddress,
  createPublicClient,
  createWalletClient,
  http,
} from 'viem';
import { randomSalt } from '@windingtree/contracts';
import {
  RequestQuery,
  OfferOptions,
  contractsConfig,
  stableCoins,
  serverAddress,
} from 'mvp-shared-files';
import { OfferData, DealStatus } from '@windingtree/sdk-types';
import { noncePeriod } from '@windingtree/sdk-constants';
import { Queue, JobHandler } from '@windingtree/sdk-queue';
import {
  NodeApiServer,
  NodeApiServerOptions,
  router,
} from '@windingtree/sdk-node-api/server';
import {
  serviceRouter,
  adminRouter,
  userRouter,
  dealsRouter,
} from '@windingtree/sdk-node-api/router';
import { airplanesRouter } from '../api/airplanesRoute.js';
import { ProtocolContracts } from '@windingtree/sdk-contracts-manager';
import { levelStorage } from '@windingtree/sdk-storage';
import { nowSec, parseSeconds } from '@windingtree/sdk-utils';
import { DealsDb } from '@windingtree/sdk-db';
import {
  Node,
  NodeOptions,
  NodeRequestManager,
  RequestEvent,
  createNode,
} from '@windingtree/sdk-node';
import { createLogger } from '@windingtree/sdk-logger';
import { config } from '../common/config.js';

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
 * This is interface of object that you want to pass to the job handler as options
 */
interface DealHandlerOptions {
  contracts: ProtocolContracts;
  dealsDb: DealsDb;
}

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
    queue: Queue,
  ): EventHandler<CustomEvent<RequestEvent<RequestQuery>>> =>
  ({ detail }) => {
    const handler = async () => {
      logger.trace(`📨 Request on topic #${detail.topic}:`, detail.data);

      const offer = await node.makeOffer({
        /** Offer expiration time */
        expire: '15m',
        /** Copy of request */
        request: detail.data,
        /** Random options data. Just for testing */
        options: {
          date: DateTime.now().toISODate(),
          buongiorno: Math.random() < 0.5,
          buonasera: Math.random() < 0.5,
        },
        /**
         * Dummy payment option.
         * In production these options managed by supplier
         */
        payment: [
          {
            id: randomSalt(),
            price: BigInt('1000000000000000'), // 0.001
            asset: stableCoins.stable18permit,
          },
          {
            id: randomSalt(),
            price: BigInt('1200000000000000'), // 0.0012
            asset: stableCoins.stable18,
          },
        ],
        /** Cancellation options */
        cancel: [
          {
            time: BigInt(nowSec() + 500),
            penalty: BigInt(100),
          },
        ],
        /** Check-in time */
        checkIn: BigInt(nowSec() + 1000),
        checkOut: BigInt(nowSec() + 2000),
      });

      queue.addEventListener('status', ({ detail: job }) => {
        logger.trace(`Job #${job.id} status changed`, job);
      });

      /**
       * On every published offer we expecting a deal.
       * So, we add a job for detection of deals
       */
      queue.add({
        handlerName: 'deal',
        data: offer,
        isRecurrent: true,
        recurrenceInterval: 5000,
        expire: Number(offer.expire),
      });

      // слушаем смартконтракт каждый новый блок
      // если нет новых событий продолжаем слушать
      // если есть, то перебираем и запускаем флоу по удачным офферам и отмененным, отмененные идут в одну ветку логики, удачные в другую
    };

    handler().catch(logger.error);
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
    topics: ['hello'],
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
    createRequestsHandler(node, queue),
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
