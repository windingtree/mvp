import { useCallback, useEffect, useState, useRef } from 'react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { RequestQuery } from 'mvp-shared-files';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { DealRecord } from '@windingtree/sdk-types';
import { useAccount, useNetwork, useWalletClient } from 'wagmi';
import { Chain, switchNetwork } from '@wagmi/core';
import { centerEllipsis } from '@windingtree/sdk-react/utils';
import { ClientDealsManager } from '@windingtree/sdk-client';
import { Hash } from 'viem';
import { LoadingButton } from 'mvp-shared-files/react';
import { QRCodeCanvas } from 'qrcode.react';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('CheckInProps');

interface CheckInProps {
  dealsManager?: ClientDealsManager<RequestQuery, OfferOptions>;
  deal?: DealRecord<RequestQuery, OfferOptions>;
}

export const CheckIn = ({ dealsManager, deal }: CheckInProps) => {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const { chain, chains } = useNetwork();
  const account = useAccount();
  const { data: walletClient } = useWalletClient();
  const [targetChain, setTargetChain] = useState<Chain | undefined>();
  const [chainError, setChainError] = useState<string | undefined>();
  const [signError, setSignError] = useState<string | undefined>();
  const [sign, setSign] = useState<Hash | undefined>();
  const [signLoading, setSignLoading] = useState<boolean>(false);

  const downloadQRCode = useCallback(() => {
    if (deal && qrRef.current !== null) {
      const canvas = qrRef.current.querySelector('canvas');

      if (canvas) {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${deal?.offer.id}-checkin-qr.png`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 1000);
      } else {
        logger.error('downloadQRCode', 'QR code canvas is null');
      }
    }
  }, [deal]);

  const createSignInOutVoucher = useCallback(() => {
    setSignError(undefined);
    setSign(undefined);

    if (dealsManager && deal && walletClient) {
      setSignLoading(true);
      dealsManager
        .checkInOutSignature(deal.offer.id, walletClient)
        .then((s) => {
          setSignLoading(false);
          setSign(() => `${deal.offer.id};${s}`); // Voucher format: "<offerId>;<signature>"
        })
        .catch((err) => {
          logger.error('checkInOutSignature', err);
          setSignError(err.message);
          setSignLoading(false);
        });
    } else {
      const err =
        'Unable to create voucher. Possible causes: deals manager is not defined, deal not found or wallet is not connected';
      logger.error('checkInOutSignature', err);
      setSignError(err);
    }
  }, [deal, dealsManager, walletClient]);

  useEffect(() => {
    if (deal) {
      const tChain = chains.find((c) => c.id === deal.chainId);

      if (!tChain) {
        setTargetChain(undefined);
        const err = `It seems that Deal offer chain Id: ${deal.chainId} is not supported`;
        logger.error('setTargetChain', err);
        setChainError(err);
        return;
      }

      setTargetChain(() => tChain);
    }
  }, [chains, deal]);

  if (!dealsManager) {
    logger.trace('CheckIn', 'dealsManager not defined in props');
    return null;
  }

  if (!deal) {
    logger.trace('CheckIn', 'deal not defined in props');
    return null;
  }

  return (
    <>
      {chainError && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {chainError}
        </Alert>
      )}
      {signError && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {signError}
        </Alert>
      )}
      {(!chain || !account) && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          Please connect your wallet
        </Alert>
      )}
      {account.address !== deal.buyer && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <Typography>
            Account selected in the wallet is different from this booking owner.
            Please switch to{' '}
            <span title={deal.buyer}>{centerEllipsis(deal.buyer)}</span>
          </Typography>
        </Alert>
      )}
      {chain && targetChain && deal.chainId !== chain.id && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Please switch to</Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => switchNetwork({ chainId: targetChain.id })}
            >
              {targetChain.name}
            </Button>
          </Stack>
        </Alert>
      )}
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Stack direction="column" spacing={2}>
          {sign && (
            <Box ref={qrRef}>
              <QRCodeCanvas value={sign} size={300} />
            </Box>
          )}
          {sign && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                size="small"
                variant="outlined"
                onClick={downloadQRCode}
                sx={{ marginBottom: 2 }}
              >
                Download voucher
              </Button>
              <LoadingButton
                size="small"
                variant="contained"
                onClick={createSignInOutVoucher}
                disabled={signLoading}
                loading={signLoading}
              >
                Re-sign voucher
              </LoadingButton>
            </Stack>
          )}
          {!sign && (
            <LoadingButton
              size="large"
              variant="contained"
              onClick={createSignInOutVoucher}
              disabled={signLoading}
              loading={signLoading}
            >
              Show check in voucher
            </LoadingButton>
          )}
        </Stack>
      </Paper>
    </>
  );
};
