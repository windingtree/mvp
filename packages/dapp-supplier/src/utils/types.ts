import { PaginationOptions } from '@windingtree/sdk-types';

export interface Page extends Required<PaginationOptions> {
  total: number;
}
