import { useConfig } from '@windingtree/sdk-react/providers';
import { Button } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

export const Logout = () => {
  const { resetAuth } = useConfig();

  return (
    <>
      <Button
        variant="text"
        size="small"
        startIcon={<LogoutIcon />}
        onClick={resetAuth}
      >
        Log-Out
      </Button>
    </>
  );
};
