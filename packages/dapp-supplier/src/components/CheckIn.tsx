import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Modal,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
  IconButton,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { centerEllipsis } from '@windingtree/sdk-react/utils';
import { LoadingButton } from 'mvp-shared-files/react';
import { Hash } from 'viem';
import { QrReader } from './QrReader/index.js';
import { useNode } from '@windingtree/sdk-react/providers';
import { DealRecord } from '@windingtree/sdk-types';
import { DealView } from './DealView.js';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { RequestQuery } from 'mvp-shared-files';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('CheckIn');

interface CheckInProps {
  show?: boolean;
  onDone?: () => void;
}

export const CheckIn = ({ show = false, onDone = () => {} }: CheckInProps) => {
  const { node } = useNode();
  const [voucher, setVoucher] = useState<string | undefined>();
  const [deal, setDeal] = useState<
    DealRecord<RequestQuery, OfferOptions> | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [done, setDone] = useState<boolean>(false);

  const close = useCallback(() => {
    setVoucher(undefined);
    setDeal(undefined);
    setLoading(false);
    setError(undefined);
    setDone(false);
    onDone();
  }, [onDone]);

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
      const record = (await node.deals.get.query({
        id: offerId,
      })) as unknown as DealRecord<RequestQuery, OfferOptions>;
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
    <>
      <Modal
        open={show ?? false}
        onClose={close}
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            padding: 2,
            paddingTop: '32px',
            width: '85%',
            position: 'relative',
            margin: 'auto',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              zIndex: 1,
              bgcolor: 'white',
            }}
            size="small"
            onClick={close}
          >
            <CloseIcon />
          </IconButton>

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

          {deal && <DealView deal={deal} isModal={false} />}

          {deal && !done && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <LoadingButton
                variant="contained"
                size="large"
                disabled={!deal || loading}
                loading={loading}
                onClick={() => handleCheckIn()}
                sx={{ marginTop: 2 }}
              >
                CheckIn deal
              </LoadingButton>
            </Box>
          )}

          {done && (
            <Alert severity="success" sx={{ marginTop: 2 }}>
              <Typography>Deal has been successfully checked in</Typography>
              <Button variant="contained" size="small" onClick={close}>
                Close
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
        </Paper>
      </Modal>
    </>
  );
};
