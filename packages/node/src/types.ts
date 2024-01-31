import type { GenericOfferOptions, GenericQuery } from '@windingtree/sdk-types';
import type { AirplaneInput } from './api/airplanesRoute.js';
import { ProtocolContracts } from '@windingtree/sdk-contracts-manager';
import { DealsDb } from '@windingtree/sdk-db';
import { LevelDBStorage } from '@windingtree/sdk-storage/level';
import { NodeApiServer } from '@windingtree/sdk-node-api/server';
export type { AppRouter } from './controllers/nodeController.js';
export type { AirplaneInput };

export interface OfferOptions extends GenericOfferOptions {
  date: string;
  hours: number;
  airplane: Omit<AirplaneInput, 'minTime' | 'maxTime' | 'price'>;
}

/**
 * This is interface of object that you want to pass to the job handler as options
 */
export interface DealHandlerOptions {
  contracts: ProtocolContracts;
  dealsDb: DealsDb;
}

export interface RequestHandlerOptions {
  airplanesDb: LevelDBStorage;
  offersDb: LevelDBStorage;
}

export interface EventSubscribeOptions {
  contractsManager: ProtocolContracts<GenericQuery, GenericOfferOptions>;
  apiServer: NodeApiServer;
  offerDb: LevelDBStorage;
}
