import { ConfigActions, useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../../main.js';
import {
  Stack,
  Alert,
  TextField,
  CircularProgress,
  Typography,
  Button,
  Tooltip,
  Box,
} from '@mui/material';
import { Hash } from 'viem';
import {
  centerEllipsis,
  formatBalance,
  copyToClipboard,
} from '@windingtree/sdk-react/utils';
import { AddressBalance } from '../AddressBalance.js';
import { useEntity } from '../../hooks/useEntity.js';
import { useBalance } from 'wagmi';
import { Link, useNavigate } from 'react-router-dom';

export const SupplierView = () => {
  const navigate = useNavigate();
  const { supplierId, setConfig } = useConfig<CustomConfig>();
  const {
    data: { kind, owner, signer, status, deposit },
    error,
    isLoading,
  } = useEntity(supplierId);
  const { data: signerBalance } = useBalance({
    address: signer,
    formatUnits: 'ether',
    enabled: Boolean(signer),
    watch: true,
    staleTime: 2_000,
  });

  if (!supplierId) {
    return (
      <>
        <Alert severity="warning">
          The supplier Id no configured yet. This Id can be generated on the{' '}
          <b>registration</b> step or added below.
        </Alert>
      </>
    );
  }

  return (
    <>
      <Stack spacing={4}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Supplier's entity Id"
          type="text"
          name="supplierId"
          required
          value={supplierId || ''}
          onChange={(e) => {
            setConfig({
              type: ConfigActions.SET_CONFIG,
              payload: {
                supplierId: e.target.value as Hash,
              },
            });
          }}
        />
        {isLoading && <CircularProgress size={25} />}
        <Stack spacing={1}>
          {kind && (
            <Typography>
              <strong>Record kind</strong>: {kind}
            </Typography>
          )}
          {owner && (
            <Typography>
              <strong>Entity owner</strong>:{' '}
              <Tooltip title="Copy address to clipboard" arrow>
                <Button
                  component="span"
                  size="medium"
                  onClick={() => copyToClipboard(owner)}
                >
                  {centerEllipsis(owner)}
                </Button>
              </Tooltip>{' '}
              (<AddressBalance address={owner} />)
            </Typography>
          )}
          {signer && (
            <Typography>
              <strong>Node Signer</strong>:{' '}
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
          {signerBalance?.value === 0n && (
            <Box>
              <Alert severity="warning" sx={{ marginBottom: 2 }}>
                Do not forget to top up the signer account with some ETH to make
                it possible to send transactions from server side
              </Alert>
            </Box>
          )}
          {deposit !== undefined && (
            <Typography>
              <strong>Deposit status</strong>:{' '}
              <span style={{ color: deposit === 0n ? 'red' : '' }}>
                {formatBalance(deposit ?? 0n, 2)} LIF
              </span>
            </Typography>
          )}
          {status !== undefined && (
            <Typography>
              <strong>Status</strong>:{' '}
              <span style={{ color: Boolean(status) ? 'green' : 'red' }}>
                {Boolean(status) ? 'enabled' : 'disabled'}
              </span>
            </Typography>
          )}
          {!status && (
            <Box>
              <Alert severity="info" sx={{ marginBottom: 2 }}>
                To enable the entity you have to deposit LIF tokens and enable
                organization in the protocol by sending transaction. Check In on
                the{' '}
                <Link to="/supplier/setup/manage?panel=deposit">
                  entity manage
                </Link>{' '}
                page.
              </Alert>
            </Box>
          )}
        </Stack>
      </Stack>
    </>
  );
};
