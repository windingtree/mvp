import { useCallback, useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Alert,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material';
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
import { ActionMenu } from '../components/ActionMenu.js';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      {!isMobile && deals.length > 0 && (
        <Grid
          container
          spacing={2}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            marginTop: 1,
            borderBottom: '1px solid grey',
          }}
        >
          <Grid item sm={true}>
            <Typography variant="caption">Booking</Typography>
          </Grid>
          <Grid item sm={true}>
            <Typography variant="caption">Date</Typography>
          </Grid>
          <Grid item sm={true}>
            <Typography variant="caption">Status</Typography>
          </Grid>
          <Grid item sm={true}>
            <Typography variant="caption">Actions</Typography>
          </Grid>
        </Grid>
      )}
      {deals.map((deal, i) => (
        <Grid
          container
          spacing={2}
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 0,
            borderBottom: isMobile ? 1 : 0,
            marginBottom: isMobile ? 2 : 0,
            backgroundColor: 'rgba(255,255,255,0.6)',
            ':hover': {
              backgroundColor: 'rgba(255,255,255,1)',
            },
          }}
        >
          <Grid item xs={12} sm={true}>
            {isMobile && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Booking:</Typography>
                <Typography
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => navigate(`/details?offerId=${deal.offer.id}`)}
                >
                  {deal.offer.options.airplane.name}
                </Typography>
              </Stack>
            )}
            {!isMobile && (
              <Typography
                sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => navigate(`/details?offerId=${deal.offer.id}`)}
              >
                {deal.offer.options.airplane.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={true}>
            {isMobile && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Date</Typography>
                <Typography>{deal.offer.options.date}</Typography>
              </Stack>
            )}
            {!isMobile && <Typography>{deal.offer.options.date}</Typography>}
          </Grid>
          <Grid item xs={12} sm={true}>
            {isMobile && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Status</Typography>
                <Typography
                  sx={{
                    color:
                      deal.status === DealStatus.Cancelled ? 'red' : 'inherit',
                  }}
                >
                  {DealStatus[dealStates[deal.offer.id]] ?? 'Unknown'}
                </Typography>
              </Stack>
            )}
            {!isMobile && (
              <Typography
                sx={{
                  color:
                    deal.status === DealStatus.Cancelled ? 'red' : 'inherit',
                }}
              >
                {DealStatus[dealStates[deal.offer.id]] ?? 'Unknown'}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={true}>
            {isMobile && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6">Action</Typography>
                <ActionMenu
                  loading={deal.offer.id === loadingId}
                  items={{
                    ...([DealStatus.Created, DealStatus.Claimed].includes(
                      deal.status,
                    )
                      ? {
                          Cancel: () => handleCancel(deal),
                        }
                      : {}),
                    View: `/details?offerId=${deal.offer.id}`,
                  }}
                />
              </Stack>
            )}
            {!isMobile && (
              <ActionMenu
                loading={deal.offer.id === loadingId}
                items={{
                  ...([DealStatus.Created, DealStatus.Claimed].includes(
                    deal.status,
                  )
                    ? {
                        Cancel: () => handleCancel(deal),
                      }
                    : {}),
                  View: `/details?offerId=${deal.offer.id}`,
                }}
              />
            )}
          </Grid>
        </Grid>
      ))}

      {deals && deals.length > 0 && (
        <Grid container>
          <Grid item>
            <Button
              variant="contained"
              size="medium"
              onClick={updateDeals}
              sx={{ marginTop: 2 }}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      )}

      {error && (
        <Paper
          elevation={0}
          sx={{
            padding: 2,
            marginTop: 4,
            marginBottom: 2,
            backgroundColor: 'rgba(255,255,255,0.6)',
          }}
        >
          <Alert severity="error">{error}</Alert>
        </Paper>
      )}

      {tx && (
        <Paper
          elevation={0}
          sx={{
            padding: 2,
            marginTop: 4,
            marginBottom: 2,
            backgroundColor: 'rgba(255,255,255,0.6)',
          }}
        >
          <Alert severity="info">
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
        </Paper>
      )}
    </PageContainer>
  );
};
