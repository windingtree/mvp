import { Button, Stack } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface BcProps {
  links: {
    label: string;
    path: string;
  }[];
}

export const BreadCrumbs: FC<BcProps> = ({ links }) => {
  const navigate = useNavigate();
  return (
    <Stack direction="row" alignItems="center" sx={{ marginBottom: 2 }}>
      {links.map((link, i) => (
        <Button
          key={i}
          variant="text"
          size="small"
          onClick={() => navigate(link.path)}
        >
          / {link.label}
        </Button>
      ))}
    </Stack>
  );
};
