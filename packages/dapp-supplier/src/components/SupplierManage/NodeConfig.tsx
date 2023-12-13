import { ConfigActions, useConfig } from '@windingtree/sdk-react/providers';
import { Stack, TextField, Typography } from '@mui/material';

export const NodeConfig = () => {
  const { nodeHost, setConfig } = useConfig();

  return (
    <Stack spacing={4}>
      <Typography variant="h5" component="h1">
        Supplier's Node Configuration
      </Typography>
      <Typography variant="subtitle1" color="GrayText">
        Using this form you are able to configure the node address. This is
        required to enable access to the node from this Dapp
      </Typography>
      <TextField
        label="Node API server URL"
        type="text"
        name="nodeUrl"
        placeholder="Copy your Node URL here"
        value={nodeHost ?? ''}
        onChange={(e) =>
          setConfig({
            type: ConfigActions.SET_CONFIG,
            payload: {
              nodeHost: e.target.value,
            },
          })
        }
      />
    </Stack>
  );
};
