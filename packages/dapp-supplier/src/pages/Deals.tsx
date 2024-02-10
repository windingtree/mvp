import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { QrReader } from '../components/QrReader/index.js';
import { useNode } from '@windingtree/sdk-react/providers';
import {
  DealRecord,
  GenericOfferOptions,
  GenericQuery,
} from '@windingtree/sdk-types';
import { Hash } from 'viem';
import { LoadingButton } from 'mvp-shared-files/react';
import { centerEllipsis } from '@windingtree/sdk-react/utils';
import { stringify } from 'superjson';
import { useNavigate } from 'react-router-dom';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('DealsPage');

export const DealsPage = () => {
  const navigate = useNavigate();
  const { node } = useNode();
  const [voucher, setVoucher] = useState<string | undefined>();
  const [deal, setDeal] = useState<
    DealRecord<GenericQuery, GenericOfferOptions> | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [done, setDone] = useState<boolean>(false);

  const onQrScan = useCallback((code: string) => {
    logger.trace('QR', code);
    setVoucher(code);
  }, []);

  const [offerId, sign] = useMemo<Hash[]>(
    () => (voucher ? voucher.split(';') : []) as Hash[],
    [voucher],
  );

  const getDeal = useCallback(async () => {
    try {
      setError(undefined);

      if (!offerId) {
        return;
      }

      if (!node) {
        throw new Error('Not connected to the node');
      }

      setLoading(true);
      const record = await node.deals.get.query({ id: offerId });
      logger.trace('Deal with id:', offerId, record);
      setDeal(() => record);
      setLoading(false);
    } catch (err) {
      logger.error('getDeal', err);
      setError((err as Error).message || 'Unknown getDeal error');
      setLoading(false);
    }
  }, [node, offerId]);

  useEffect(() => {
    getDeal();
  }, [getDeal, node, offerId]);

  const handleCheckIn = useCallback(async () => {
    if (!deal || !sign) {
      return;
    }

    try {
      setError(undefined);
      setDone(false);

      if (!node) {
        throw new Error('Not connected to the node');
      }

      if (!deal) {
        throw new Error('Invalid deal record');
      }

      setLoading(true);
      await node.deals.checkIn.mutate({
        id: deal.offer.id,
        sign,
      });
      setLoading(false);
      setDone(true);
    } catch (err) {
      logger.error('handleCheckin', err);
      setError((err as Error).message || 'Unknown check in error');
      setLoading(false);
    }
  }, [deal, node, sign]);

  return (
    <Container sx={{ paddingTop: 2 }}>
      {!voucher && (
        <QrReader
          onSuccess={onQrScan}
          onError={(err) => logger.error('QrS', err)}
        />
      )}
      {!deal && offerId && loading && (
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>
            Loading deal with Id: {centerEllipsis(offerId)}
          </Typography>
          <CircularProgress />
        </Stack>
      )}
      {deal && <textarea>{stringify(deal)}</textarea>}
      {deal && !done && (
        <LoadingButton
          variant="contained"
          size="large"
          disabled={!deal || loading}
          loading={loading}
          onClick={() => handleCheckIn()}
        >
          CheckIn deal
        </LoadingButton>
      )}
      {done && (
        <Alert severity="success">
          <Typography>Deal has been successfully checked in</Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              navigate('/deals', { state: { key: Date.now() }, replace: true })
            }
          >
            Back
          </Button>
        </Alert>
      )}

      {error && (
        <Alert sx={{ marginTop: 1 }} severity="error">
          <Typography>{error}</Typography>
          {offerId && !deal && (
            <Button variant="contained" size="small" onClick={getDeal}>
              Try load the deal again
            </Button>
          )}
        </Alert>
      )}
    </Container>
  );
};
