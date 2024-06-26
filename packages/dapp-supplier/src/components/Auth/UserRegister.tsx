import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { useConfig, useNode } from '@windingtree/sdk-react/providers';
import type { AppRouter } from '@windingtree/mvp-node/types';
import { Login } from './Login.js';
import { CustomConfig } from '../../main.js';

/**
 * Register a new user
 */
export const UserRegister = () => {
  const { isAuth, role } = useConfig<CustomConfig>();
  const { node } = useNode<AppRouter>();
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [done, setDone] = useState<string | undefined>();

  const handleRegister = useCallback(async () => {
    try {
      setError(undefined);

      if (!node) {
        return;
      }

      setIsLoading(true);
      await node.user.register.mutate({
        login,
        password,
      });
      setDone(`User "${login}" has been successfully registered`);
      setIsLoading(false);
    } catch (err) {
      setDone(undefined);
      setIsLoading(false);
      setError((err as Error).message ?? 'Unknown user registration error');
    }
  }, [node, login, password]);

  useEffect(() => {
    if (done) {
      setLogin('');
      setPassword('');
    }
  }, [done]);

  if (!isAuth || (isAuth && role !== 'admin')) {
    return (
      <>
        <Alert severity="warning">
          Only the Node admins are allowed to register new users
        </Alert>
        <Box sx={{ marginTop: 2 }}>
          <Login admin={true} hideSelector />
        </Box>
      </>
    );
  }

  return (
    <>
      <form>
        <Stack spacing={4}>
          <Typography variant="subtitle1" color="GrayText">
            These users are allowed to manage business related services of the
            Node
          </Typography>
          <TextField
            label="Login"
            type="text"
            name="login"
            value={login}
            onChange={(e) => {
              setDone(undefined);
              setLogin(() => e.target.value);
            }}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setDone(undefined);
              setPassword(() => e.target.value);
            }}
          />
          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={isLoading}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>Register</Typography>
              {isLoading && <CircularProgress color="inherit" size={16} />}
            </Stack>
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {done && <Alert severity="success">{done}</Alert>}
        </Stack>
      </form>
    </>
  );
};
