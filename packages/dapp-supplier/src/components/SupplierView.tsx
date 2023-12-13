import { ConfigActions, useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../main.js';
import {
  Stack,
  Alert,
  TextField,
  CircularProgress,
  Typography,
  Button,
  Tooltip,
} from '@mui/material';
import { Hash } from 'viem';
import {
  centerEllipsis,
  formatBalance,
  copyToClipboard,
} from '@windingtree/sdk-react/utils';
import { AddressBalance } from './AddressBalance.js';
import { useEntity } from '../hooks/useEntity.js';

export const SupplierView = () => {
  const { supplierId, setConfig } = useConfig<CustomConfig>();
  const {
    data: { kind, owner, signer, status, deposit },
    error,
    isLoading,
  } = useEntity(supplierId);

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
          {status !== undefined && (
            <Typography>
              <strong>Status</strong>:{' '}
              {Boolean(status) ? 'enabled' : 'disabled'}
            </Typography>
          )}
          {deposit !== undefined && (
            <Typography>
              <strong>Deposit status</strong>: {formatBalance(deposit ?? 0n, 2)}{' '}
              LIF
            </Typography>
          )}
        </Stack>
      </Stack>
    </>
  );
};
