import { useState, useCallback } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Alert,
  Stack,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { ExpandMore as ExpandMoreIconIcon } from '@mui/icons-material';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Hash, zeroHash } from 'viem';
import { useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../main.js';
import { contractsConfig } from 'mvp-shared-files';
import { entitiesRegistryABI } from '@windingtree/contracts';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { usePermit } from '../hooks/usePermit.js';
import { useProtocolConfig } from '../hooks/useProtocolConfig.js';
import { DepositBalance } from './DepositBalance.js';
import {
  copyToClipboard,
  formatBalance,
  centerEllipsis,
} from '@windingtree/sdk-react/utils';
import { LifBalance } from './LifBalance.js';

const AddDeposit = ({ supplierId }: { supplierId: Hash }) => {
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
        {error && <Alert severity="error">{error}</Alert>}
        {permitError && <Alert severity="error">{permitError}</Alert>}
        {txError && <Alert severity="error">{txError.message}</Alert>}
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
      </Stack>
    </>
  );
};

export const SupplierManage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const panel = searchParams.get('panel');
  const { supplierId } = useConfig<CustomConfig>();

  if (!supplierId) {
    return (
      <>
        <Alert severity="warning">
          <Link to="setup/register">Register</Link> or{' '}
          <Link to="setup/view">add</Link> your entity Id first.
        </Alert>
      </>
    );
  }

  return (
    <>
      <Accordion
        expanded={panel === 'deposit'}
        onChange={() => navigate('setup/manage?panel=deposit')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIconIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>Manage LIF deposit of the entity</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddDeposit supplierId={supplierId} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={panel === 'signer'}
        onChange={() => navigate('setup/manage?panel=signer')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIconIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography>Manage the supplier's Node signer</Typography>
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
      <Accordion
        expanded={panel === 'state'}
        onChange={() => navigate('setup/manage?panel=state')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIconIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography>Manage the supplier's entity state</Typography>
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
    </>
  );
};
