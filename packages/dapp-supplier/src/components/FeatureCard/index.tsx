import { FC, ReactNode } from 'react';
import { Paper, Stack, SxProps, Typography, Badge, Box } from '@mui/material';

interface FeatureCardProps {
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  badge?: string | ReactNode;
  sx?: SxProps;
}

export const FeatureCard: FC<FeatureCardProps> = ({
  title,
  icon,
  onClick = () => {},
  badge,
  sx,
}) => {
  return (
    <Paper
      sx={{
        padding: 2,
        cursor: 'pointer',
        backgroundColor: 'transparent',
        ':hover': {
          backgroundColor: 'rgba(0,0,0,0.03)',
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...sx,
      }}
      onClick={onClick}
    >
      <Badge
        color="secondary"
        badgeContent={badge}
        overlap="circular"
        invisible={!badge || badge === ''}
      >
        <Box sx={{ padding: 2 }}>
          <Stack direction="column" alignItems="center" spacing={2}>
            {icon}
            <Typography variant="h5">{title}</Typography>
          </Stack>
        </Box>
      </Badge>
    </Paper>
  );
};
