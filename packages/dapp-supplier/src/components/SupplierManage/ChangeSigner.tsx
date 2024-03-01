import { useCallback, useState } from 'react';
import { entitiesRegistryABI } from '@windingtree/contracts';
import { contractsConfig } from 'mvp-shared-files';
import { Address, Hash } from 'viem';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { useEntity } from '../../hooks/useEntity.js';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { NoSupplierAlert } from '../NoSupplierAlert.js';
import { AddressBalance } from '../AddressBalance.js';
import { centerEllipsis, copyToClipboard } from '@windingtree/sdk-react/utils';
import { targetChain } from '../../config.js';

export const ChangeSigner = ({ supplierId }: { supplierId: Hash }) => {
  const {
    data: { signer },
    error: infoError,
    isLoading,
  } = useEntity(supplierId);
  const [newSigner, setNewSigner] = useState<string>('');
  const [done, setDone] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | undefined>();

  const {
    data,
    isLoading: sendLoading,
    write,
    reset,
    error: txError,
  } = useContractWrite({
    address: contractsConfig[targetChain].entities.address,
    abi: entitiesRegistryABI,
    functionName: 'changeSigner',
  });

  const { isLoading: txLoading } = useWaitForTransaction({
    hash: data?.hash,
    enabled: Boolean(data?.hash),
    onError(error) {
      console.log('Tx error:', error);
    },
    onSuccess(data) {
      setDone(true);
      setNewSigner('');
      console.log('Tx mined:', data);
    },
  });

  const handleChangeSigner = useCallback(async () => {
    try {
      if (newSigner === '') {
        throw new Error("Please add a new signer's address to the field");
      }

      setLocalError(undefined);

      write({
        args: [supplierId, newSigner as Address],
      });
    } catch (error) {
      console.log(error);
      setLocalError((error as Error).message ?? 'Unknown error');
    }
  }, [newSigner, write, supplierId]);

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
        {signer && (
          <Typography>
            <strong>Current signer</strong>:
            <Tooltip title="Copy address to clipboard" arrow>
              <Button
                component="span"
                size="medium"
                onClick={() => copyToClipboard(signer)}
              >
                {centerEllipsis(signer)}
              </Button>
            </Tooltip>{' '}
            (<AddressBalance address={signer} />)
          </Typography>
        )}
        <TextField
          label="New supplier's Node signer"
          type="text"
          name="newSigner"
          required
          value={newSigner}
          onChange={(e) => {
            setNewSigner(e.target.value as Address);
            reset();
            setDone(false);
          }}
        />
        <Button
          variant="contained"
          disabled={isLoading || sendLoading || txLoading || done}
          onClick={handleChangeSigner}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Send change signer transaction</Typography>
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
