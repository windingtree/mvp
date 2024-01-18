import { FC, ReactNode } from 'react';
import { Login } from './Login.js';
import { ConfigActions, useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../../main.js';
import { Container } from '@mui/material';

interface RequireAuthProps {
  admin?: boolean;
  children: ReactNode;
}

export const RequireAuth: FC<RequireAuthProps> = ({
  admin = false,
  children,
}) => {
  const { isAuth, role } = useConfig<CustomConfig>();

  if (!(isAuth && role === (admin ? 'admin' : 'manager'))) {
    return (
      <>
        <Container sx={{ paddingTop: 2 }}>
          <Login admin={Boolean(admin)} reset />
        </Container>
      </>
    );
  }

  return <>{children}</>;
};
