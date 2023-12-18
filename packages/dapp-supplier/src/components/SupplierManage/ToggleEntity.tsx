import { useCallback, useState } from 'react';
import { entitiesRegistryABI } from '@windingtree/contracts';
import { contractsConfig } from 'mvp-shared-files';
import { Hash } from 'viem';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { useEntity } from '../../hooks/useEntity.js';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { NoSupplierAlert } from '../NoSupplierAlert.js';
import { centerEllipsis, copyToClipboard } from '@windingtree/sdk-react/utils';

export const ToggleEntity = ({ supplierId }: { supplierId: Hash }) => {
  const {
    data: { status },
    error: infoError,
    isLoading,
  } = useEntity(supplierId);
  const [done, setDone] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | undefined>();

  const {
    data,
    isLoading: sendLoading,
    write,
    reset,
    error: txError,
  } = useContractWrite({
    address: contractsConfig.entities.address,
    abi: entitiesRegistryABI,
    functionName: 'toggleEntity',
  });

  const { isLoading: txLoading } = useWaitForTransaction({
    hash: data?.hash,
    enabled: Boolean(data?.hash),
    onError(error) {
      console.log('Tx error:', error);
    },
    onSuccess(data) {
      setDone(true);
      console.log('Tx mined:', data);
    },
  });

  const handleToggleEntity = useCallback(async () => {
    try {
      reset();
      setDone(false);
      write({
        args: [supplierId],
      });
    } catch (error) {
      console.log(error);
      setLocalError((error as Error).message ?? 'Unknown error');
    }
  }, [reset, write, supplierId]);

  if (!supplierId) {
    return (
      <>
        <NoSupplierAlert />
      </>
    );
  }

  return (
    <>
      <Stack spacing={4}>
        {status !== undefined && (
          <Typography>
            <strong>Current status</strong>: {status ? 'enabled' : 'disabled'}
          </Typography>
        )}
        {status !== undefined && (
          <Typography>
            <strong>Toggle status to</strong>:{' '}
            {!status ? 'enabled' : 'disabled'}
          </Typography>
        )}
        <Button
          variant="contained"
          disabled={isLoading || sendLoading || txLoading}
          onClick={handleToggleEntity}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Send status toggle transaction</Typography>
            {(sendLoading || txLoading) && (
              <CircularProgress color="inherit" size={16} />
            )}
          </Stack>
        </Button>
        {data?.hash && (
          <Stack direction="row" spacing={2}>
            <Box>
              <Typography>Tx: {centerEllipsis(data.hash)}</Typography>
            </Box>
            <Button
              variant="text"
              color="secondary"
              size="small"
              onClick={() => copyToClipboard(data.hash)}
            >
              Copy Tx hash to clipboard
            </Button>
          </Stack>
        )}
        {infoError && <Alert severity="error">{infoError}</Alert>}
        {localError && <Alert severity="error">{localError}</Alert>}
        {txError && <Alert severity="error">{txError.message}</Alert>}
        {done && (
          <Alert severity="success">
            Supplier's Node signer has been successfully updated
          </Alert>
        )}
      </Stack>
    </>
  );
};
