import { useState, useEffect, useCallback } from 'react';
import { EventHandler } from '@libp2p/interface/events';
import {
  Client,
  ClientRequestRecord,
  ClientRequestsManager,
} from '@windingtree/sdk-client';
import { buildRequest } from '@windingtree/sdk-messages';
import { OfferData, RequestData } from '@windingtree/sdk-types';
import {
  useClient,
  useRequestsManager,
  useDealsManager,
} from '@windingtree/sdk-react/providers';
import { DealRecord } from '@windingtree/sdk-types';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { RequestQuery } from 'mvp-shared-files';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('useRequests');

export interface UseRequestsProps {
  expire: string;
  topic: string;
}

export interface UseRequestsHook {
  client: Client<RequestQuery, OfferOptions>;
  requestsManager?: ClientRequestsManager<RequestQuery, OfferOptions>;
  clientConnected: boolean;
  publish: (
    query: RequestQuery,
  ) => Promise<ClientRequestRecord<RequestQuery, OfferOptions> | undefined>;
  requests: ClientRequestRecord<RequestQuery, OfferOptions>[];
  deals: DealRecord<RequestQuery, OfferOptions>[];
  error?: string;
}

export const useRequests = ({
  expire,
  topic,
}: UseRequestsProps): UseRequestsHook => {
  const { client, clientConnected } = useClient<RequestQuery, OfferOptions>();
  const { requestsManager } = useRequestsManager<RequestQuery, OfferOptions>();
  const { dealsManager } = useDealsManager<RequestQuery, OfferOptions>();
  const [requests, setRequests] = useState<
    ClientRequestRecord<RequestQuery, OfferOptions>[]
  >([]);
  const [deals, setDeals] = useState<DealRecord<RequestQuery, OfferOptions>[]>(
    [],
  );
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const updateRequests = () => {
      setTimeout(() => {
        setRequests(() => requestsManager?.getAll() || []);
      }, 150);
    };

    const updateDeals = () => {
      dealsManager
        ?.getAll()
        .then((newDeals) => {
          setDeals(() => newDeals);
        })
        .catch(logger.error);
    };

    const onClientStart = () => {
      logger.trace('🚀 Client started at:', new Date().toISOString());
      updateRequests();
      updateDeals();
    };

    const onClientStop = () => {
      logger.trace('👋 Client stopped at:', new Date().toISOString());
    };

    const onClientConnected = () => {
      logger.trace(
        '🔗 Client connected to server at:',
        new Date().toISOString(),
      );

      requestsManager?.refreshSubscriptions();
    };

    const onClientDisconnected = () => {
      logger.trace(
        '🔌 Client disconnected from server at:',
        new Date().toISOString(),
      );
    };

    const onRequestPublish: EventHandler<
      CustomEvent<RequestData<RequestQuery>>
    > = ({ detail }) => {
      requestsManager?.add(detail);
      updateRequests();
    };

    const onOffer: EventHandler<
      CustomEvent<OfferData<RequestQuery, OfferOptions>>
    > = ({ detail }) => {
      requestsManager?.addOffer(detail);
      updateRequests();
    };

    const onRequestSubscribe: EventHandler<
      CustomEvent<ClientRequestRecord>
    > = ({ detail }) => {
      client.subscribe(detail.data.id);
    };

    const onRequestUnsubscribe: EventHandler<
      CustomEvent<ClientRequestRecord>
    > = ({ detail }) => {
      client.unsubscribe(detail.data.id);
    };

    client.addEventListener('start', onClientStart);
    client.addEventListener('stop', onClientStop);
    client.addEventListener('connected', onClientConnected);
    client.addEventListener('disconnected', onClientDisconnected);
    client.addEventListener('publish', onRequestPublish);
    client.addEventListener('offer', onOffer);

    requestsManager?.addEventListener('request', updateRequests);
    requestsManager?.addEventListener('expire', updateRequests);
    requestsManager?.addEventListener('cancel', updateRequests);
    requestsManager?.addEventListener('delete', updateRequests);
    requestsManager?.addEventListener('clear', updateRequests);
    requestsManager?.addEventListener('offer', updateRequests);
    requestsManager?.addEventListener('subscribe', onRequestSubscribe);
    requestsManager?.addEventListener('unsubscribe', onRequestUnsubscribe);

    dealsManager?.addEventListener('changed', updateDeals);

    client.start().catch(logger.error);

    return () => {
      client.removeEventListener('start', onClientStart);
      client.removeEventListener('stop', onClientStop);
      client.removeEventListener('connected', onClientConnected);
      client.removeEventListener('disconnected', onClientDisconnected);
      client.removeEventListener('publish', onRequestPublish);
      client.removeEventListener('offer', onOffer);

      requestsManager?.removeEventListener('request', updateRequests);
      requestsManager?.removeEventListener('expire', updateRequests);
      requestsManager?.removeEventListener('cancel', updateRequests);
      requestsManager?.removeEventListener('delete', updateRequests);
      requestsManager?.removeEventListener('clear', updateRequests);
      requestsManager?.removeEventListener('offer', updateRequests);
      requestsManager?.removeEventListener('subscribe', onRequestSubscribe);
      requestsManager?.removeEventListener('unsubscribe', onRequestUnsubscribe);

      dealsManager?.removeEventListener('changed', updateDeals);

      client.stop().catch(logger.error);
      dealsManager?.stop();
    };
  }, [client, requestsManager, dealsManager]);

  const publish = useCallback(
    async ({ date }: RequestQuery) => {
      try {
        setError(undefined);

        if (!client || !requestsManager) {
          throw new Error('The client is not initialized yet');
        }

        const request = await buildRequest<RequestQuery>({
          topic,
          expire,
          nonce: BigInt(1),
          query: {
            date,
          },
        });

        client.publish(request);

        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });

        return await requestsManager.get(request.id);
      } catch (error) {
        setError((error as Error).message);
        logger.error(error);
      }
    },
    [client, expire, requestsManager, topic],
  );

  return {
    client,
    clientConnected,
    requestsManager,
    publish,
    requests,
    deals,
    error,
  };
};