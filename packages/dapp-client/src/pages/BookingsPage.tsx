import { useCallback, useEffect, useState } from 'react';
import {
  IconButton,
  Container,
  Grid,
  Typography,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import { MoreHoriz as MoreIcon } from '@mui/icons-material';
import { LoadingButton } from '../components/LoadingButton.js';
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
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('BookingsPage');

type DealsRegistryRecord = Required<DealRecord<RequestQuery, OfferOptions>>;

const statusMap: Record<DealStatus, string> = {
  [DealStatus.Created]: 'Pending',
  [DealStatus.Claimed]: 'Confirmed',
  [DealStatus.Rejected]: 'Rejected',
  [DealStatus.Refunded]: 'Refunded',
  [DealStatus.Cancelled]: 'Cancelled',
  [DealStatus.CheckedIn]: 'Checked In',
  [DealStatus.CheckedOut]: 'Checked Out',
  [DealStatus.Disputed]: 'Disputed',
};

export const BookingsPage = () => {
  const navigate = useNavigate();
  const { dealsManager } = useDealsManager<RequestQuery, OfferOptions>();
  const { data: walletClient } = useWalletClient();
  const [deals, setDeals] = useState<DealsRegistryRecord[]>([]);
  const [tx, setTx] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loadingId, setLoadingId] = useState<Hash | undefined>();

  useEffect(() => {
    const updateDeals = async () => {
      try {
        const newDeals = (await dealsManager?.getAll()) ?? [];
        setDeals(() => newDeals);
        logger.trace('deals', newDeals);
      } catch (err) {
        logger.error('setDeals', err);
      }
    };

    dealsManager?.addEventListener('changed', updateDeals);
    updateDeals();

    return () => {
      dealsManager?.removeEventListener('changed', updateDeals);
    };
  }, [dealsManager]);

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
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
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
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="h6">Booking</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">Date</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">Status</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">Actions</Typography>
          </Grid>
        </Grid>
      )}
      {deals.map((deal, i) => (
        <Grid container key={i} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={3}>
            <Typography
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => {}}
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
              {statusMap[deal.status] ?? 'Unknown'}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Stack direction="row" spacing={2}>
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
    </Container>
  );
};
