import { useConfig } from '@windingtree/sdk-react/providers';
import { Paper, Stack, Typography } from '@mui/material';
import { Login } from './Login.js';
import { Logout } from './Logout.js';
import { UserUpdate } from './UserUpdate.js';

export const Welcome = () => {
  const { isAuth, login } = useConfig();

  if (!isAuth || !login) {
    return (
      <>
        <Paper sx={{ padding: 2 }}>
          <Stack spacing={2}>
            <Login />
          </Stack>
        </Paper>
      </>
    );
  }

  return (
    <>
      <Paper sx={{ padding: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>
            Welcome <strong>{login}</strong>
          </Typography>
          <Logout />
        </Stack>
        <UserUpdate />
      </Paper>
    </>
  );
};
