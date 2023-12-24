import { useState, useCallback } from 'react';
import {
  Alert,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Switch,
} from '@mui/material';
import { useConfig, useNode } from '@windingtree/sdk-react/providers';
import { createAdminSignature } from '@windingtree/sdk-node-api/client';
import { type AppRouter } from '@windingtree/mvp-node';
import { useWalletClient } from 'wagmi';

interface LoginProps {
  admin?: boolean;
}

export const Login = ({ admin }: LoginProps) => {
  const { node } = useNode<AppRouter>();
  const { isAuth, login: account, setAuth, resetAuth } = useConfig();
  const { data: walletClient } = useWalletClient();
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [done, setDone] = useState<boolean>(false);
  const [asAdmin, setAsAdmin] = useState<boolean>(
    admin !== undefined ? admin : false,
  );

  const handleAdminLogin = useCallback(async () => {
    try {
      setError(undefined);

      if (!walletClient) {
        throw new Error('Wallet not connected yet');
      }

      const signature = await createAdminSignature(walletClient);

      if (!node) {
        throw new Error('Not connected to the Node');
      }

      setIsLoading(true);

      await node.admin.login.mutate({
        login,
        password: signature,
      });

      setIsLoading(false);
      setDone(true);
      setAuth(login);
    } catch (err) {
      setIsLoading(false);
      setDone(false);
      resetAuth();
      setError((err as Error).message ?? 'Unknown admin login error');
    }
  }, [walletClient, node, login, setAuth, resetAuth]);

  const handleUserLogin = useCallback(async () => {
    try {
      setError(undefined);

      if (!node) {
        throw new Error('Not connected to the Node');
      }

      setIsLoading(true);

      await node.user.login.mutate({
        login,
        password,
      });

      setIsLoading(false);
      setDone(true);
      setAuth(login);
    } catch (err) {
      setIsLoading(false);
      setDone(false);
      resetAuth();
      setError((err as Error).message ?? 'Unknown login error');
    }
  }, [node, login, password, setAuth, resetAuth]);

  if (isAuth && account) {
    return (
      <>
        <Typography>Hello {account}</Typography>
      </>
    );
  }

  return (
    <>
      <Stack spacing={4}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>Log In as admin</Typography>
          <Switch
            checked={asAdmin}
            onChange={(e) => {
              setAsAdmin(e.target.checked);
            }}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Stack>
        {asAdmin && (
          <Alert severity="info">
            During the login procedure you will be prompted to sign login
            voucher with your wallet
          </Alert>
        )}
        <TextField
          label="Login name"
          type="text"
          name="login"
          value={login}
          onChange={(e) => {
            setDone(false);
            setLogin(() => e.target.value);
          }}
        />
        {!asAdmin && (
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
        )}
        <Button
          variant="contained"
          onClick={asAdmin ? handleAdminLogin : handleUserLogin}
          disabled={isLoading}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Log-In</Typography>
            {isLoading && <CircularProgress color="inherit" size={16} />}
          </Stack>
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {done && (
          <Alert severity="success">
            Admin "{login}" has been successfully logged in
          </Alert>
        )}
      </Stack>
    </>
  );
};
