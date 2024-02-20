import { FC, ReactNode } from 'react';
import { Login } from './Login.js';
import { useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../../main.js';
import { PageContainer } from '../PageContainer.js';

interface RequireAuthProps {
  admin?: boolean;
  hideSelector?: boolean;
  children: ReactNode;
}

export const RequireAuth: FC<RequireAuthProps> = ({
  admin = false,
  hideSelector = false,
  children,
}) => {
  const { isAuth, role } = useConfig<CustomConfig>();

  if (!(isAuth && role === (admin ? 'admin' : 'manager'))) {
    return (
      <PageContainer>
        <Login admin={Boolean(admin)} hideSelector={hideSelector} />
      </PageContainer>
    );
  }

  return <>{children}</>;
};
