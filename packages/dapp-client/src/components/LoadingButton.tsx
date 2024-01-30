import { PropsWithChildren, ComponentProps } from 'react';
import { Box, Button, CircularProgress, Stack } from '@mui/material';

interface LoadingButtonProps
  extends ComponentProps<typeof Button>,
    PropsWithChildren {
  loading?: boolean;
  spinnerSize?: number;
}

export const LoadingButton = ({
  children,
  loading = false,
  spinnerSize = 24,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button {...props}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>{children}</Box>
        {loading && <CircularProgress size={spinnerSize} color="inherit" />}
      </Stack>
    </Button>
  );
};
