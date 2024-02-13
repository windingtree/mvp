import {
  Modal,
  Paper,
  SxProps,
  IconButton,
  Typography,
  Box,
  Card,
  CardMedia,
  Grid,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { DealRecord, DealStatus } from '@windingtree/sdk-types';
import { RequestQuery } from 'mvp-shared-files';
import MuiMarkdown, { getOverrides } from 'mui-markdown';
import { DateTime } from 'luxon';
import { Price } from './Price.js';
import { getDealStatusColor } from '../utils/deals.js';

interface DealViewProps {
  deal?: DealRecord<RequestQuery, OfferOptions>;
  onClose: () => void;
  sx?: SxProps;
}

export const DealView = ({ deal, onClose, sx }: DealViewProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!deal) {
    return null;
  }

  return (
    <Modal
      open={Boolean(deal) ?? false}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          padding: 2,
          paddingTop: '32px',
          width: '85%',
          position: 'relative',
          margin: 'auto',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            zIndex: 1,
            bgcolor: 'white',
          }}
          size="small"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={2} sx={sx}>
          <Grid item xs={12} sm={5} md={4} lg={3}>
            {isSmallScreen && (
              <Typography variant="h5" component="h2" gutterBottom>
                {deal.offer.options.airplane.name}
              </Typography>
            )}
            <Card sx={{ maxWidth: '100%', mb: 2 }}>
              <CardMedia
                component="img"
                image={deal.offer.options.airplane.media[0].thumbnail}
                alt={deal.offer.options.airplane.name}
                sx={{ width: '100%', height: 'auto' }}
              />
            </Card>
            <Grid container spacing={1}>
              {deal.offer.options.airplane.media
                .slice(0, 4)
                .map((media, index) => (
                  <Grid item xs={3} sm={2} md={1.5} lg={1} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        image={media.thumbnail}
                        sx={{ width: '100%', height: 'auto' }}
                      />
                    </Card>
                  </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Duration: {deal.offer.options.hours}h
              </Typography>
              <Typography variant="body2">
                Capacity: {deal.offer.options.airplane.capacity}
              </Typography>
              <Typography sx={{ marginTop: 2, paddingTop: 1, borderTop: 1 }}>
                Date: {DateTime.fromSeconds(Number(deal.created)).toISODate()}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>Price:</Typography>
                <Price deal={deal} />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>Status:</Typography>
                <Typography
                  sx={{
                    color: getDealStatusColor(deal.status),
                  }}
                >
                  {DealStatus[deal.status]}
                </Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} sm={7} md={8} lg={9}>
            {!isSmallScreen && (
              <Typography variant="h5" component="h2" gutterBottom>
                {deal.offer.options.airplane.name}
              </Typography>
            )}
            <Box>
              <MuiMarkdown
                overrides={{
                  ...getOverrides({}),
                  span: {
                    component: Typography,
                    props: {
                      variant: 'body2',
                      color: 'text.secondary',
                    },
                  },
                }}
              >
                {deal.offer.options.airplane.description}
              </MuiMarkdown>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};
