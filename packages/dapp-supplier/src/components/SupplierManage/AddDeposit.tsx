import { useState, useCallback } from 'react';
import {
  Typography,
  Alert,
  Stack,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { Hash, zeroHash } from 'viem';
import { contractsConfig } from 'mvp-shared-files';
import { entitiesRegistryABI } from '@windingtree/contracts';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { usePermit } from '../../hooks/usePermit.js';
import { useProtocolConfig } from '../../hooks/useProtocolConfig.js';
import { DepositBalance } from '../DepositBalance.js';
import {
  copyToClipboard,
  formatBalance,
  centerEllipsis,
} from '@windingtree/sdk-react/utils';
import { LifBalance } from '../LifBalance.js';

export const AddDeposit = ({ supplierId }: { supplierId: Hash }) => {
  const [depositValue, setDepositValue] = useState<string>('0');
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const { minDeposit } = useProtocolConfig();
  const { address: owner } = useAccount();

  const { data: currentDeposit } = useContractRead({
    address: contractsConfig.entities.address,
    abi: entitiesRegistryABI,
    functionName: 'balanceOfEntity',
    enabled: Boolean(supplierId),
    args: [supplierId || zeroHash],
    watch: true,
  });

  const {
    sign,
    deadline,
    error: permitError,
  } = usePermit({
    owner,
    verifyingContract: contractsConfig.token.address,
    spender: contractsConfig.entities.address,
    decimals: 18,
    version: '1',
    value: BigInt(depositValue),
    deadline: BigInt(Math.floor(Date.now() / 1000) + 100_000),
  });

  const {
    data,
    isLoading,
    write,
    reset,
    error: txError,
  } = useContractWrite({
    address: contractsConfig.entities.address,
    abi: entitiesRegistryABI,
    functionName: 'addDeposit',
  });

  const { isLoading: isTxLoading } = useWaitForTransaction({
    hash: data?.hash,
    enabled: Boolean(data?.hash),
    onError(error) {
      console.log('Tx error:', error);
    },
    onSuccess(data) {
      setDone(true);
      setDepositValue('0');
      console.log('Tx mined:', data);
    },
  });

  const handleAddDeposit = useCallback(async () => {
    try {
      if (currentDeposit === undefined || minDeposit === undefined) {
        throw new Error(
          'Current deposit value or minimum deposit value are not available yet',
        );
      }

      if (currentDeposit + BigInt(depositValue) < minDeposit) {
        throw new Error(
          `LIF deposit value is not enough. You must deposit at least ${formatBalance(
            BigInt(minDeposit - currentDeposit),
            2,
          )} LIF`,
        );
      }

      setError(undefined);

      const signature = await sign();
      console.log('%%%%', signature);
      write({
        args: [supplierId, BigInt(depositValue), deadline, signature],
      });
    } catch (error) {
      console.log(error);
      setError((error as Error).message ?? 'Unknown error');
    }
  }, [
    currentDeposit,
    minDeposit,
    depositValue,
    sign,
    write,
    supplierId,
    deadline,
  ]);

  return (
    <>
      <Stack spacing={2}>
        <Typography>
          <strong>Owner's LIF balance</strong>: <LifBalance address={owner} />
        </Typography>
        <Typography>
          <strong>Current deposit value</strong>:{' '}
          <DepositBalance supplierId={supplierId} />
        </Typography>
        <Stack direction="row" alignItems="center">
          <Typography>
            <strong>Minimum deposit value</strong>:{' '}
            {formatBalance(BigInt(minDeposit || '0'), 2)} LIF
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => {
              setDepositValue(minDeposit?.toString() || '0');
              reset();
              setDone(false);
            }}
          >
            Use this value
          </Button>
        </Stack>
        <TextField
          label="LIF deposit value in WEI"
          type="text"
          name="lifValue"
          required
          value={depositValue}
          onChange={(e) => {
            setDepositValue(e.target.value);
            setDone(false);
            reset();
          }}
        />
        <Button
          variant="contained"
          disabled={isLoading || isTxLoading || done}
          onClick={handleAddDeposit}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Send transaction</Typography>
            {(isLoading || isTxLoading) && (
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
        {error && <Alert severity="error">{error}</Alert>}
        {permitError && <Alert severity="error">{permitError}</Alert>}
        {txError && <Alert severity="error">{txError.message}</Alert>}
        {done && (
          <Alert severity="success">
            LIF tokens deposit for the entity has been added successfully
          </Alert>
        )}
      </Stack>
    </>
  );
};
