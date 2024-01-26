import { createContext, useContext } from 'react';
import {
  ClientRequestRecord,
  ClientRequestsManager,
} from '@windingtree/sdk-client';
import { DealRecord } from '@windingtree/sdk-types';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { RequestQuery } from 'mvp-shared-files';

export interface SearchContextData {
  requestsManager?: ClientRequestsManager<RequestQuery, OfferOptions>;
  publish: (
    query: RequestQuery,
  ) => Promise<ClientRequestRecord<RequestQuery, OfferOptions> | undefined>;
  requests: ClientRequestRecord<RequestQuery, OfferOptions>[];
  deals: DealRecord<RequestQuery, OfferOptions>[];
  error?: string;
}

export const SearchContext = createContext({} as SearchContextData);

export const useSearchProvider = () => {
  const context = useContext<SearchContextData>(SearchContext);

  if (context === undefined) {
    throw new Error('useSearchProvider must be used within a "SearchContext"');
  }

  return context;
};
