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
import { useWalletClient } from 'wagmi';
import { useConfig, useNode } from '@windingtree/sdk-react/providers';
import { createAdminSignature } from '@windingtree/sdk-node-api/client';
import { type AppRouter } from '@windingtree/mvp-node';

/**
 * Register an Admin user
 */
export const AdminRegister = () => {
  const { node } = useNode<AppRouter>();
  const { isAuth, login: account, setAuth, resetAuth } = useConfig();
  const { data: walletClient } = useWalletClient();
  const [login, setLogin] = useState<string>('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const handleRegister = useCallback(async () => {
    try {
      setError(undefined);
      setIsLoading(true);

      if (!walletClient) {
        throw new Error('Wallet not connected yet');
      }

      const signature = await createAdminSignature(walletClient);

      if (!node) {
        return;
      }

      await node.admin.register.mutate({
        login,
        password: signature,
      });

      setDone(true);
      setIsLoading(false);
      setAuth(login);
    } catch (err) {
      setDone(false);
      setIsLoading(false);
      resetAuth();
      setError((err as Error).message ?? 'Unknown user registration error');
    }
  }, [walletClient, node, login, setAuth, resetAuth]);

  if (!walletClient) {
    return (
      <>
        <Alert severity="warning">Please connect your wallet to continue</Alert>
        <Box sx={{ marginTop: 2 }}>
          <w3m-connect-button />
        </Box>
      </>
    );
  }

  return (
    <>
      <form>
        <Stack spacing={4}>
          <Typography variant="subtitle1" color="GrayText">
            Administrative users are able to manage regular users and make other
            administrative tasks
          </Typography>
          <Alert severity="info">
            During the login procedure you will be prompted to sign login
            voucher with your wallet
          </Alert>
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
          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={isLoading}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>Register Admin</Typography>
              {isLoading && <CircularProgress color="inherit" size={16} />}
            </Stack>
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {done && (
            <Alert severity="success">
              Admin "{login}" has been successfully registered
            </Alert>
          )}
        </Stack>
      </form>
    </>
  );
};
