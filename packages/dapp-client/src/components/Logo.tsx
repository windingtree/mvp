import { FC } from 'react';
import { Box, SxProps } from '@mui/material';

interface LogoProps {
  show?: boolean;
  size?: number;
  sx?: SxProps;
}

export const Logo: FC<LogoProps> = ({ show = true, size = 40, sx }) => {
  if (!show) {
    return null;
  }

  return (
    <Box
      color="red"
      sx={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        border: '1px solid white',
        ...sx,
      }}
    >
      <img
        src="/assets/images/winding-tree-icon.svg"
        alt="logo"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </Box>
  );
};
