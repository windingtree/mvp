import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Stack,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { CheckCircle, PowerOff, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuTitles, getTitleByPath } from '../routes.js';
import { useNode } from '@windingtree/sdk-react/providers';
import { type AppRouter } from '@windingtree/mvp-node';

const MainMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (path: string) => {
    setAnchorEl(null);
    if (typeof path === 'string') {
      navigate(path);
    }
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {menuTitles.map(([path, title], index) => (
          <MenuItem key={index} onClick={() => handleClose(path)}>
            {title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

/**
 * Application header
 */
export const Header = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6">
            {getTitleByPath(location.pathname)}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" alignItems="center" spacing={1}>
            <w3m-button size="sm" balance="hide" />
            <MainMenu />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
