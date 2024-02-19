import { useCallback, useEffect, useState } from 'react';
import { Alert, Button } from '@mui/material';
import { CheckIn } from '../components/CheckIn.js';
import { useNode } from '@windingtree/sdk-react/providers';
import { usePoller } from '@windingtree/sdk-react/hooks';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { DealRecord, PaginationOptions } from '@windingtree/sdk-types';
import { RequestQuery } from 'mvp-shared-files';
import { defaultPageSkip } from '../utils/defaults.js';
import { Page } from '../utils/types.js';
import { Deals } from '../components/Deals.js';
import { PageContainer } from '../components/PageContainer.js';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('DealsPage');

interface PaginatedDealRecords extends Required<PaginationOptions> {
  total: number;
  records: DealRecord<RequestQuery, OfferOptions>[];
}

export const DealsPage = () => {
  const { node, nodeConnected } = useNode();
  const [init, setInit] = useState<boolean>(false);
  const [checkInOpen, setCheckInOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [deals, setDeals] = useState<DealRecord<RequestQuery, OfferOptions>[]>(
    [],
  );
  const [page, setPage] = useState<Page>({
    total: 0,
    start: 0,
    skip: defaultPageSkip,
  });
  const [newPage, setNewPage] = useState<Page>({
    total: 0,
    start: 0,
    skip: defaultPageSkip,
  });

  const getDeals = useCallback(
    async (page: PaginationOptions = {}) => {
      try {
        setError(undefined);

        if (!node) {
          return;
        }

        const { total, start, skip, records } = (await node.deals.getAll.query(
          page,
        )) as unknown as PaginatedDealRecords;
        logger.trace('Deals:', records);

        setDeals(() => records);
        setPage(() => ({
          total,
          start,
          skip,
        }));
        setNewPage(() => ({
          total,
          start,
          skip,
        }));
      } catch (err) {
        logger.error('getDeals', err);
        setError((err as Error).message ?? 'Unknown get deals error');
      }
    },
    [node],
  );

  useEffect(() => {
    if (
      newPage.total !== page.total ||
      newPage.start !== page.start ||
      newPage.skip !== page.skip
    ) {
      getDeals(newPage);
    }
  }, [getDeals, page, newPage]);

  useEffect(() => {
    if (nodeConnected && !init) {
      getDeals(page).then(() => setInit(true));
    }
  }, [page, nodeConnected, getDeals, init]);

  usePoller(() => getDeals(page), 5000, nodeConnected, 'RefreshDeals');

  return (
    <PageContainer>
      <Button
        variant="contained"
        size="medium"
        onClick={() => setCheckInOpen(true)}
      >
        Check In
      </Button>

      <CheckIn show={checkInOpen} onDone={() => setCheckInOpen(false)} />

      <Deals
        deals={deals}
        page={page}
        onPageChange={setNewPage}
        sx={{ marginTop: 3 }}
      />

      {error && (
        <Alert sx={{ marginTop: 1 }} severity="error">
          {error}
        </Alert>
      )}
    </PageContainer>
  );
};
