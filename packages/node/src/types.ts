import type { GenericOfferOptions } from '@windingtree/sdk-types';
import type { AirplaneInput } from './api/airplanesRoute.js';
export type { AppRouter } from './controllers/nodeController.js';
export type { AirplaneInput };

export interface OfferOptions extends GenericOfferOptions {
  date: string;
  airplane: Omit<AirplaneInput, 'minTime' | 'maxTime' | 'price'>;
}
