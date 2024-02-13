import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { CheckIn } from '../components/CheckIn.js';
import { useNode } from '@windingtree/sdk-react/providers';
import { OfferOptions } from '@windingtree/mvp-node/types';
import {
  DealRecord,
  DealStatus,
  PaginationOptions,
} from '@windingtree/sdk-types';
import { RequestQuery } from 'mvp-shared-files';
import { centerEllipsis, copyToClipboard } from '@windingtree/sdk-react/utils';
import { DateTime } from 'luxon';
import { Pagination } from '../components/Pagination.js';
import { defaultPageSkip } from '../utils/defaults.js';
import { Page } from '../utils/types.js';
import { Price } from '../components/Price.js';
import { getDealStatusColor } from '../utils/deals.js';
import { DealView } from '../components/DealView.js';
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
  const [dealStates, setDealStates] = useState<Record<string, DealStatus>>({});
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
  const [selectedDeal, setSelectedDeal] = useState<
    DealRecord<RequestQuery, OfferOptions> | undefined
  >();

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
    if (deals && deals.length > 0) {
      const newDealStates: Record<string, DealStatus> = {};
      deals.forEach((d) => {
        newDealStates[d.offer.id] = d.status;
      });
      setDealStates(newDealStates);
    }
  }, [deals]);

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

  return (
    <Container sx={{ paddingTop: 2 }}>
      <Button
        variant="contained"
        size="medium"
        onClick={() => setCheckInOpen(true)}
      >
        Check In
      </Button>

      <CheckIn show={checkInOpen} onDone={() => setCheckInOpen(false)} />
      <DealView
        deal={selectedDeal}
        onClose={() => setSelectedDeal(undefined)}
      />

      {deals && deals.length > 0 && (
        <>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12}>
              <Grid container sx={{ borderBottom: '1px solid grey' }}>
                {[
                  { label: 'Offer Id', size: 2 },
                  { label: 'Created', size: 2 },
                  { label: 'Buyer', size: 3 },
                  { label: 'Price', size: 2 },
                  { label: 'Status', size: 2 },
                  { label: 'Action', size: 1 },
                ].map((header, i) => (
                  <Grid item xs={header.size} key={i}>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      style={{ textAlign: 'left' }}
                    >
                      {header.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {deals.map((d, index) => (
              <Grid item xs={12} key={index}>
                <Grid container>
                  <Grid item xs={2}>
                    <Typography
                      onClick={() => setSelectedDeal(() => d)}
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {centerEllipsis(d.offer.payload.id, 3)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>
                      {DateTime.fromSeconds(Number(d.created)).toISODate()}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack direction="row" alignItems="center" spacing={0}>
                      <Typography
                        title={d.buyer}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => copyToClipboard(d.buyer)}
                      >
                        {centerEllipsis(d.buyer, 3)}
                      </Typography>
                      <CopyIcon
                        sx={{ width: 15, height: 15, cursor: 'pointer' }}
                        onClick={() => copyToClipboard(d.buyer)}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={2}>
                    <Price deal={d} />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography
                      sx={{
                        color: getDealStatusColor(dealStates[d.offer.id]),
                      }}
                    >
                      {DealStatus[dealStates[d.offer.id]]}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography></Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Pagination
            page={page}
            onChange={(newPage) =>
              setNewPage((curPage) => ({ ...curPage, ...newPage }))
            }
            sx={{
              marginTop: 1,
              paddingTop: 1,
              borderTop: '1px solid grey',
            }}
          />
        </>
      )}

      {error && (
        <Alert sx={{ marginTop: 1 }} severity="error">
          {error}
        </Alert>
      )}
    </Container>
  );
};
