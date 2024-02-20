import { useCallback, useEffect, useState } from 'react';
import {
  IconButton,
  Grid,
  Typography,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import { MoreHoriz as MoreIcon } from '@mui/icons-material';
import { LoadingButton } from 'mvp-shared-files/react';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { useDealsManager } from '@windingtree/sdk-react/providers';
import { RequestQuery } from 'mvp-shared-files';
import { DealRecord, DealStatus } from '@windingtree/sdk-types';
import { useWalletClient } from 'wagmi';
import {
  centerEllipsis,
  copyToClipboard,
  parseWalletError,
} from '@windingtree/sdk-react/utils';
import { Hash } from 'viem';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from 'mvp-shared-files/react';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('BookingsPage');

type DealsRegistryRecord = Required<DealRecord<RequestQuery, OfferOptions>>;

// const statusMap: Record<DealStatus, string> = {
//   [DealStatus.Created]: 'Pending',
//   [DealStatus.Claimed]: 'Confirmed',
//   [DealStatus.Rejected]: 'Rejected',
//   [DealStatus.Refunded]: 'Refunded',
//   [DealStatus.Cancelled]: 'Cancelled',
//   [DealStatus.CheckedIn]: 'Checked In',
//   [DealStatus.CheckedOut]: 'Checked Out',
//   [DealStatus.Disputed]: 'Disputed',
// };

export const BookingsPage = () => {
  const navigate = useNavigate();
  const { dealsManager } = useDealsManager<RequestQuery, OfferOptions>();
  const { data: walletClient } = useWalletClient();
  const [deals, setDeals] = useState<DealsRegistryRecord[]>([]);
  const [dealStates, setDealStates] = useState<Record<string, DealStatus>>({});
  const [tx, setTx] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loadingId, setLoadingId] = useState<Hash | undefined>();

  useEffect(() => {
    if (deals && deals.length > 0) {
      const newDealStates: Record<string, DealStatus> = {};
      deals.forEach((d) => {
        newDealStates[d.offer.id] = d.status;
      });
      setDealStates(() => newDealStates);
    }
  }, [deals]);

  const updateDeals = useCallback(async () => {
    try {
      const newDeals = (await dealsManager?.getAll()) ?? [];
      setDeals(() => newDeals);
      logger.trace('deals', newDeals);
    } catch (err) {
      logger.error('setDeals', err);
    }
  }, [dealsManager]);

  useEffect(() => {
    dealsManager?.addEventListener('changed', updateDeals);
    updateDeals();

    return () => {
      dealsManager?.removeEventListener('changed', updateDeals);
    };
  }, [dealsManager, updateDeals]);

  const handleCancel = useCallback(
    async (deal: DealsRegistryRecord) => {
      try {
        setTx(undefined);
        setError(undefined);
        setLoadingId(deal.offer.id);

        if (!dealsManager) {
          throw new Error('Deals manager not ready');
        }

        if (!walletClient) {
          throw new Error('Wallet is not connected yet');
        }

        await dealsManager.cancel(deal.offer, walletClient, setTx);
        setLoadingId(undefined);
      } catch (err) {
        console.log(err);
        setError(parseWalletError(err));
        setLoadingId(undefined);
      }
    },
    [dealsManager, walletClient],
  );

  return (
    <PageContainer>
      {deals.length === 0 && (
        <>
          <Typography>
            Bookings list is empty. It is time to book a tour of you dream.
          </Typography>
          <Button
            sx={{ marginTop: 1 }}
            variant="outlined"
            size="small"
            onClick={() => navigate('/')}
          >
            Back to the home page
          </Button>
        </>
      )}
      {deals.length > 0 && (
        <Grid container spacing={2} sx={{ borderBottom: 1 }}>
          <Grid item xs={3}>
            <Typography variant="caption">Booking</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption">Date</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption">Status</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="caption">Actions</Typography>
          </Grid>
        </Grid>
      )}
      {deals.map((deal, i) => (
        <Grid container key={i} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={3}>
            <Typography
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => navigate(`/details?offerId=${deal.offer.id}`)}
            >
              {deal.offer.options.airplane.name}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>{deal.offer.options.date}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: deal.status === DealStatus.Cancelled ? 'red' : 'inherit',
              }}
            >
              {DealStatus[dealStates[deal.offer.id]] ?? 'Unknown'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              {[DealStatus.Created, DealStatus.Claimed].includes(
                deal.status,
              ) && (
                <LoadingButton
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={loadingId === deal.offer.id || Boolean(tx)}
                  loading={loadingId === deal.offer.id}
                  onClick={() => handleCancel(deal)}
                >
                  Cancel
                </LoadingButton>
              )}
              <IconButton>
                <MoreIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      ))}

      <Button
        variant="contained"
        size="medium"
        onClick={updateDeals}
        sx={{ marginTop: 2 }}
      >
        Refresh
      </Button>

      {error && (
        <Alert severity="error" sx={{ marginTop: 4, marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {tx && (
        <Alert severity="info" sx={{ marginTop: 4, marginBottom: 2 }}>
          <Typography
            variant="body1"
            color="inherit"
            title="Copy to clipboard"
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => copyToClipboard(tx)}
          >
            Tx hash: {centerEllipsis(tx)}
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => setTx(undefined)}
            sx={{ marginBottom: 2 }}
          >
            Close
          </Button>
        </Alert>
      )}
    </PageContainer>
  );
};
