import { useCallback, useEffect, useState } from 'react';
import { RequestQuery, contractsConfig } from 'mvp-shared-files';
import { ParsedPrice } from '../utils/offer.js';
import { Address, Hash, zeroHash } from 'viem';
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  useWalletClient,
} from 'wagmi';
import { erc20_18PermitABI } from '@windingtree/contracts';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { OfferData } from '@windingtree/sdk-types';
import { Alert, Stack, Button, Typography, Box } from '@mui/material';
import { useDealsManager } from '@windingtree/sdk-react/providers';
import {
  centerEllipsis,
  copyToClipboard,
  parseWalletError,
} from '@windingtree/sdk-react/utils';
import { LoadingButton } from 'mvp-shared-files/react';
import { useNavigate } from 'react-router-dom';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('Book');

interface BookProps {
  address: Address;
  offer: OfferData<RequestQuery, OfferOptions>;
  price: ParsedPrice;
  onCancel?: () => void;
}

export const Book = ({
  address,
  offer,
  price,
  onCancel = () => {},
}: BookProps) => {
  const { dealsManager } = useDealsManager<RequestQuery, OfferOptions>();
  const { data: walletClient } = useWalletClient();
  const navigate = useNavigate();
  const [valueApproved, setValueApproved] = useState<boolean>(false);
  const [tx, setTx] = useState<string | undefined>();
  const [approveError, setApproveError] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const { data: allowance } = useContractRead({
    address: price.token,
    abi: erc20_18PermitABI,
    functionName: 'allowance',
    enabled: !valueApproved,
    args: [address, contractsConfig.market.address],
    watch: true,
  });

  const {
    data: approveData,
    write: approve,
    error: txApproveError,
    isLoading: isApproveLoading,
  } = useContractWrite({
    address: price.token,
    abi: erc20_18PermitABI,
    functionName: 'approve',
    args: [contractsConfig.market.address, price.value],
  });

  const { isLoading: isApproveTxLoading } = useWaitForTransaction({
    hash: approveData?.hash,
    enabled: Boolean(approveData?.hash),
    onError(error) {
      console.log('Approve Tx error:', error);
      setApproveError(error.message);
    },
  });

  useEffect(() => {
    if (allowance && allowance >= price.value) {
      setValueApproved(true);
    } else {
      setValueApproved(false);
    }
  }, [allowance, price.value]);

  const dealHandler = useCallback(
    async (paymentId: Hash) => {
      try {
        setTx(undefined);
        setError(undefined);
        setDone(false);
        setLoading(true);

        if (!dealsManager) {
          throw new Error('Client not ready');
        }

        if (!walletClient) {
          throw new Error('Ethereum client not ready');
        }

        if (!offer) {
          throw new Error('Invalid deal configuration');
        }

        if (!valueApproved) {
          throw new Error('Token allowance not enough for payment');
        }

        await dealsManager.create(
          offer,
          paymentId,
          zeroHash,
          walletClient,
          setTx,
        );
        setLoading(false);
        setDone(true);
      } catch (err) {
        logger.error('dealHandler', err);
        setError(parseWalletError(err));
        setLoading(false);
      }
    },
    [dealsManager, offer, valueApproved, walletClient],
  );

  useEffect(() => {
    if (approveError) {
      logger.error('approveError', approveError);
    }
    if (txApproveError) {
      logger.error('txApproveError', txApproveError);
    }
  }, [approveError, txApproveError]);

  return (
    <Box sx={{ marginTop: 4 }}>
      {txApproveError && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {txApproveError.message}
        </Alert>
      )}
      {approveError && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {approveError}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
      <Stack direction="column" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <LoadingButton
            variant="contained"
            disabled={done || valueApproved}
            loading={isApproveLoading || isApproveTxLoading}
            onClick={() => approve()}
          >
            Approve payment
          </LoadingButton>
          <LoadingButton
            variant="contained"
            disabled={done || loading || !valueApproved}
            loading={loading}
            onClick={() => dealHandler(price.id)}
          >
            Pay for the offer
          </LoadingButton>
          {!done && (
            <Button variant="outlined" disabled={loading} onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Stack>
        {tx && (
          <Typography
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => copyToClipboard(tx)}
          >
            Payment Tx: {centerEllipsis(tx)}
          </Typography>
        )}
        {done && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            <Typography variant="body1">
              The payment for the offer was successful. Now you can move to the
              "Bookings" page to review you booking status.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                sx={{ marginTop: 1 }}
                variant="contained"
                size="small"
                onClick={() => navigate('/bookings')}
              >
                Open Bookings
              </Button>
              <Button
                sx={{ marginTop: 1 }}
                variant="outlined"
                size="small"
                onClick={() => navigate('/')}
              >
                Back to the home page
              </Button>
            </Stack>
          </Alert>
        )}
      </Stack>
    </Box>
  );
};
