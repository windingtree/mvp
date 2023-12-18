import { useCallback, useState } from 'react';
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
import { Login } from './Login.js';

/**
 * Register a new user
 */
export const UserRegister = () => {
  const { isAuth } = useConfig();
  const { node } = useNode();
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

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

      setDone(true);
      setIsLoading(false);
    } catch (err) {
      setDone(false);
      setIsLoading(false);
      setError((err as Error).message ?? 'Unknown user registration error');
    }
  }, [node, login, password]);

  if (!isAuth) {
    return (
      <>
        <Alert severity="warning">
          Only the connected Node admins are allowed to register new users
        </Alert>
        <Box sx={{ marginTop: 2 }}>
          <Login admin={true} />
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
              setDone(false);
              setLogin(() => e.target.value);
            }}
          />
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
            onClick={handleRegister}
            disabled={isLoading}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>Register</Typography>
              {isLoading && <CircularProgress color="inherit" size={16} />}
            </Stack>
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {done && (
            <Alert severity="success">
              User "{login}" has been successfully registered
            </Alert>
          )}
        </Stack>
      </form>
    </>
  );
};
