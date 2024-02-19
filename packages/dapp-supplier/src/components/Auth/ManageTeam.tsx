import { useCallback, useEffect, useState } from 'react';
import { useConfig, useNode } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../../main.js';
import { AppRouter } from '@windingtree/sdk-node-api/router';
import { Login } from './Login.js';
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { inferProcedureOutput } from '@trpc/server';
import { usePoller } from '@windingtree/sdk-react/hooks';

type UsersList = inferProcedureOutput<AppRouter['user']['list']>;

export const ManageTeam = () => {
  const { isAuth, role } = useConfig<CustomConfig>();
  const { node, nodeConnected } = useNode<AppRouter>();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [team, setTeam] = useState<UsersList>([]);
  const [selectedUser, setSelectedUser] = useState<string | undefined>();

  const getTeam = useCallback(async () => {
    try {
      setError(undefined);

      if (!node) {
        return;
      }

      setIsLoading(true);
      const records = await node.user.list.query();
      setTeam(() => records);
      setIsLoading(false);
    } catch (err) {
      setTeam(() => []);
      setIsLoading(false);
      setError((err as Error).message ?? 'Unknown user registration error');
    }
  }, [node]);

  const handleDelete = useCallback(
    async (login: string) => {
      try {
        setError(undefined);

        if (!node) {
          return;
        }

        setSelectedUser(login);
        setIsLoading(true);
        await node.user.deleteByLogin.mutate(login);
        await getTeam();
        setIsLoading(false);
        setSelectedUser(undefined);
      } catch (err) {
        setIsLoading(false);
        setSelectedUser(undefined);
        setError((err as Error).message ?? 'Unknown user deletion error');
      }
    },
    [getTeam, node],
  );

  useEffect(() => {
    if (nodeConnected) {
      getTeam();
    }
  }, [getTeam, nodeConnected]);

  usePoller(() => getTeam(), 5000, nodeConnected, 'RefreshTeam');

  if (!isAuth || (isAuth && role !== 'admin')) {
    return (
      <>
        <Alert severity="warning">
          Only the Node admins are allowed to mange team
        </Alert>
        <Box sx={{ marginTop: 2 }}>
          <Login admin={true} reset hideSelector />
        </Box>
      </>
    );
  }

  return (
    <>
      {!nodeConnected && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <CircularProgress size={25} />
          <Typography variant="body1">Team loading...</Typography>
        </Stack>
      )}
      {team && team.length > 0 && (
        <>
          <Grid container spacing={1} sx={{ margin: 0, borderBottom: 1 }}>
            <Grid item xs={true}>
              <Typography variant="caption">Login</Typography>
            </Grid>
            <Grid item xs={true}>
              <Typography variant="caption">Role</Typography>
            </Grid>
            <Grid item xs={true} textAlign="right">
              <Typography variant="caption">Action</Typography>
            </Grid>
          </Grid>
          {team.map((t, i) => (
            <Grid container key={i} spacing={1} sx={{ margin: 0 }}>
              <Grid item xs={true}>
                <Typography variant="body1">{t.login}</Typography>
              </Grid>
              <Grid item xs={true}>
                <Typography variant="body1">
                  {t.isAdmin ? 'admin' : 'manager'}
                </Typography>
              </Grid>
              <Grid item xs={true} textAlign="right">
                <IconButton
                  size="small"
                  disabled={isLoading}
                  onClick={() => handleDelete(t.login)}
                >
                  {selectedUser === t.login && isLoading ? (
                    <CircularProgress size={18} thickness={4} />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </>
  );
};
