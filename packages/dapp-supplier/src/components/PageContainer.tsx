import { PropsWithChildren, FC } from 'react';
import { SxProps, Container } from '@mui/material';

interface PageContainerProps extends PropsWithChildren {
  sx?: SxProps;
}

export const PageContainer: FC<PageContainerProps> = ({ children, sx }) => {
  return (
    <Container
      sx={{
        paddingTop: 2,
        paddingBottom: 16,
        ...sx,
      }}
    >
      {children}
    </Container>
  );
};
