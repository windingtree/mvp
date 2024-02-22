import { useState, FC } from 'react';
import { CircularProgress, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz as MoreIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ActionMenuProps {
  items: Record<string, string | Function>;
  loading?: boolean;
}

export const ActionMenu: FC<ActionMenuProps> = ({ items, loading = false }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (path: string | Function) => {
    setAnchorEl(null);
    if (typeof path === 'string') {
      navigate(path);
    } else {
      path();
    }
  };

  if (loading) {
    return (
      <div>
        <CircularProgress size={18} />
      </div>
    );
  }

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreIcon />
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
        {Object.entries(items).map(([title, path], index) => (
          <MenuItem key={index} onClick={() => handleClose(path)}>
            {title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
