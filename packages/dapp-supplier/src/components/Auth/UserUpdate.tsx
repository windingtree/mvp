import { useCallback, useState } from 'react';
import { useConfig, useNode } from '@windingtree/sdk-react/providers';
import type { AppRouter } from '@windingtree/mvp-node/types';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Login } from './Login.js';

/**
 * Updates users password
 */
export const UserUpdate = () => {
  const { isAuth, login } = useConfig();
  const { node } = useNode<AppRouter>();
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const handleUpdate = useCallback(async () => {
    try {
      setError(undefined);

      if (!node) {
        return;
      }

      setIsLoading(true);

      await node.user.update.mutate({
        password,
      });

      setDone(true);
      setIsLoading(false);
    } catch (err) {
      setDone(false);
      setIsLoading(false);
      setError((err as Error).message ?? 'Unknown password change error');
    }
  }, [node, password]);

  if (!isAuth) {
    return (
      <>
        <Alert severity="warning">
          Only registered users are allowed to update their passwords
        </Alert>
        <Box sx={{ marginTop: 2 }}>
          <Login admin={false} />
        </Box>
      </>
    );
  }

  return (
    <>
      <form>
        <Stack spacing={4}>
          <Typography variant="subtitle1" color="GrayText">
            To update the logged-in user password please use the following form
          </Typography>
          <TextField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setDone(false);
              setPassword(() => e.target.value);
            }}
          />
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>Change password</Typography>
              {isLoading && <CircularProgress color="inherit" size={16} />}
            </Stack>
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {done && (
            <Alert severity="success">
              User's password has been successfully changed
            </Alert>
          )}
        </Stack>
      </form>
    </>
  );
};
