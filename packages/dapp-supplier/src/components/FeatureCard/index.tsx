import { FC, ReactNode } from 'react';
import {
  Paper,
  Stack,
  SxProps,
  Typography,
  Badge,
  Box,
  BadgeOwnProps,
} from '@mui/material';

interface FeatureCardProps {
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  badge?: string | ReactNode;
  badgeColor?: BadgeOwnProps['color'];
  overlap?: BadgeOwnProps['overlap'];
  sx?: SxProps;
}

export const FeatureCard: FC<FeatureCardProps> = ({
  title,
  icon,
  onClick = () => {},
  badge,
  badgeColor = 'info',
  overlap = 'circular',
  sx,
}) => {
  return (
    <Paper
      sx={{
        padding: 1,
        cursor: 'pointer',
        backgroundColor: 'transparent',
        ':hover': {
          backgroundColor: 'rgba(0,0,0,0.03)',
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        ...sx,
      }}
      onClick={onClick}
    >
      <Badge
        color={badgeColor}
        badgeContent={badge}
        overlap={overlap}
        invisible={!badge || badge === ''}
      >
        <Box sx={{ padding: 2 }}>
          <Stack direction="column" alignItems="center" spacing={2}>
            {icon}
            <Typography variant="h6" textAlign="center">
              {title}
            </Typography>
          </Stack>
        </Box>
      </Badge>
    </Paper>
  );
};
