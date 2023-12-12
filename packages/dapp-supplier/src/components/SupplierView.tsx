import { ConfigActions, useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../main.js';
import {
  Stack,
  Alert,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Hash, zeroHash } from 'viem';
import { entitiesRegistryABI, kinds } from '@windingtree/contracts';
import { centerEllipsis } from '@windingtree/sdk-react/utils';
import { useContractRead } from 'wagmi';
import { contractsConfig } from 'mvp-shared-files';
import { AddressBalance } from './AddressBalance.js';
import { DepositBalance } from './DepositBalance.js';

const kindsIndex = Object.entries(kinds).reduce<Record<Hash, string>>(
  (a, v) => ({
    ...a,
    [v[1]]: v[0],
  }),
  {},
);

export const SupplierView = () => {
  const { supplierId, setConfig } = useConfig<CustomConfig>();
  const { data: entityInfo, isLoading } = useContractRead({
    address: contractsConfig.entities.address,
    abi: entitiesRegistryABI,
    functionName: 'getEntity',
    enabled: Boolean(supplierId),
    args: [supplierId || (zeroHash as Hash)],
    watch: true,
  });

  return (
    <>
      <Stack spacing={4}>
        {!supplierId && (
          <Alert severity="warning">
            The supplier Id no configured yet. This Id can be generated on the{' '}
            <b>registration</b> step or added below.
          </Alert>
        )}
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
        {supplierId && entityInfo && (
          <>
            <Stack spacing={1}>
              <Typography>
                <strong>Record kind</strong>: {kindsIndex[entityInfo['kind']]}
              </Typography>
              <Typography>
                <strong>Entity owner</strong>:{' '}
                {centerEllipsis(entityInfo['owner'])}{' '}
                <AddressBalance address={entityInfo['owner']} />
              </Typography>
              <Typography>
                <strong>Node Signer</strong>:{' '}
                {centerEllipsis(entityInfo['signer'])}{' '}
                <AddressBalance address={entityInfo['signer']} />
              </Typography>
              <Typography>
                <strong>Status</strong>:{' '}
                {Boolean(entityInfo['enabled']) ? 'enabled' : 'disabled'}
              </Typography>
              <Typography>
                <strong>Deposit status</strong>:{' '}
                <DepositBalance supplierId={supplierId} />
              </Typography>
            </Stack>
          </>
        )}
      </Stack>
    </>
  );
};
