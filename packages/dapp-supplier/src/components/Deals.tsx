import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Stack,
  SxProps,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { centerEllipsis, copyToClipboard } from '@windingtree/sdk-react/utils';
import { DealRecord, DealStatus } from '@windingtree/sdk-types';
import { DateTime } from 'luxon';
import { RequestQuery } from 'mvp-shared-files';
import { getDealStatusColor } from '../utils/deals.js';
import { Page } from '../utils/types.js';
import { Price } from './Price.js';
import { DealView } from './DealView.js';
import { Pagination } from './Pagination.js';
import { useNode } from '@windingtree/sdk-react/providers';
import { LoadingButton } from 'mvp-shared-files/react';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('Deals');

interface DealsProps {
  deals?: DealRecord<RequestQuery, OfferOptions>[];
  page: Page;
  onPageChange: (newPage: Page) => void;
  sx?: SxProps;
}

interface TableCellWithTitleProps {
  title: string;
  children: ReactNode;
}

const TableCellWithTitle = ({ title, children }: TableCellWithTitleProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid item xs={12} sm={2}>
      {isMobile && (
        <Typography variant="caption" component="div">
          {title}:
        </Typography>
      )}
      {children}
    </Grid>
  );
};

export const Deals = ({ deals, page, onPageChange, sx }: DealsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { node } = useNode();
  const [dealStates, setDealStates] = useState<Record<string, DealStatus>>({});
  const [selectedDeal, setSelectedDeal] = useState<
    DealRecord<RequestQuery, OfferOptions> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<string>('');

  const handleCheckIn = useCallback(
    async (deal: DealRecord<RequestQuery, OfferOptions>) => {
      try {
        if (!deal) {
          throw new Error('Invalid deal record');
        }

        if (!node) {
          throw new Error('Not connected to the node');
        }

        setError(undefined);

        setLoading(deal.offer.id);
        await node.deals.checkIn.mutate({
          id: deal.offer.id,
        });
        setLoading('');
      } catch (err) {
        logger.error('handleCheckIn', err);
        setError((err as Error).message || 'Unknown check in error');
        setLoading('');
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
      setDealStates(() => newDealStates);
    }
  }, [deals]);

  if (!deals || deals.length === 0) {
    return (
      <Box sx={sx}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography>Deals loading...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      {!isMobile && (
        <Grid
          container
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid grey',
            marginBottom: 2,
          }}
        >
          {['Offer Id', 'Created', 'Buyer', 'Price', 'Status', 'Action'].map(
            (label, i) => (
              <Grid item xs={12} sm={2} key={i}>
                <Typography
                  variant="subtitle2"
                  component="div"
                  style={{ textAlign: 'left' }}
                >
                  {label}
                </Typography>
              </Grid>
            ),
          )}
        </Grid>
      )}

      {deals.map((deal, index) => (
        <Grid
          container
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 2,
            backgroundColor: 'transparent',
            ':hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
          }}
          key={index}
        >
          {isMobile && <Grid item xs={12} sx={{ borderBottom: 1 }} />}
          <TableCellWithTitle title="Offer Id">
            <Typography
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => setSelectedDeal(() => deal)}
            >
              {centerEllipsis(deal.offer.payload.id)}
            </Typography>
          </TableCellWithTitle>
          <TableCellWithTitle title="Created">
            <Typography>
              {DateTime.fromSeconds(Number(deal.created)).toISODate()}
            </Typography>
          </TableCellWithTitle>
          <TableCellWithTitle title="Buyer">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                sx={{ cursor: 'pointer' }}
                onClick={() => copyToClipboard(deal.buyer)}
              >
                {centerEllipsis(deal.buyer)}
              </Typography>
              <CopyIcon
                sx={{ width: 15, height: 15, cursor: 'pointer' }}
                onClick={() => copyToClipboard(deal.buyer)}
              />
            </Stack>
          </TableCellWithTitle>
          <TableCellWithTitle title="Price">
            <Price deal={deal} />
          </TableCellWithTitle>
          <TableCellWithTitle title="Status">
            <Typography
              sx={{
                color: getDealStatusColor(dealStates[deal.offer.id]),
              }}
            >
              {DealStatus[dealStates[deal.offer.id]]}
            </Typography>
          </TableCellWithTitle>
          <TableCellWithTitle title="Action">
            {dealStates[deal.offer.id] === DealStatus.Claimed && (
              <LoadingButton
                loading={loading === deal.offer.id}
                onClick={() => handleCheckIn(deal)}
                variant="contained"
                size="small"
              >
                Check In
              </LoadingButton>
            )}
          </TableCellWithTitle>
        </Grid>
      ))}

      <Pagination
        page={page}
        onChange={(newPage) => onPageChange({ ...page, ...newPage })}
        sx={{
          marginTop: 2,
          paddingTop: 1,
          borderTop: '1px solid grey',
        }}
      />

      {error && (
        <Alert sx={{ marginTop: 2 }} severity="error">
          {error}
        </Alert>
      )}

      {selectedDeal && (
        <DealView
          isModal={true}
          deal={selectedDeal}
          onClose={() => setSelectedDeal(undefined)}
        />
      )}
    </Box>
  );
};
