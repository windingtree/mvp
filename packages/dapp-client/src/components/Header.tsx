import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Stack,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuTitles, getTitleByPath } from '../routes.js';
import { Logo } from './Logo.js';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters={true}>
          <Logo size={34} sx={{ marginRight: 1 }} />
          {!isMobile && (
            <Typography variant="h6" color="white">
              {getTitleByPath(location.pathname)}
            </Typography>
          )}
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
