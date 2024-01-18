import { ConfigActions, useConfig } from '@windingtree/sdk-react/providers';
import { Stack, TextField, Typography } from '@mui/material';
import { type CustomConfig } from '../../main.js';

export const IpfsConfig = () => {
  const { ipfsProjectId, ipfsServerKey, setConfig } = useConfig<CustomConfig>();

  return (
    <>
      <form>
        <Stack spacing={4}>
          <Typography variant="h5" component="h1">
            Ipfs Configuration
          </Typography>
          <Typography variant="subtitle1" color="GrayText">
            Using this form you are able to configure the IPFS provider's API
            credentials. This is required to enable files and images storage
            feature.
          </Typography>
          <TextField
            label="Particle Network Project Id"
            type="text"
            name="ipfsProjectId"
            placeholder="Copy your Project Id here"
            value={ipfsProjectId ?? ''}
            onChange={(e) =>
              setConfig({
                type: ConfigActions.SET_CONFIG,
                payload: {
                  ipfsProjectId: e.target.value,
                },
              })
            }
          />
          <TextField
            label="Particle Network Server Key"
            type="text"
            name="ipfsServerKey"
            placeholder="Copy your Server Key here"
            value={ipfsServerKey ?? ''}
            onChange={(e) =>
              setConfig({
                type: ConfigActions.SET_CONFIG,
                payload: {
                  ipfsServerKey: e.target.value,
                },
              })
            }
          />
        </Stack>
      </form>
    </>
  );
};
