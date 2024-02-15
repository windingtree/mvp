import { ReactNode, forwardRef, useState } from 'react';
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
  onClose?: () => void;
  sx?: SxProps;
  isModal?: boolean;
  closeComponent?: ReactNode;
}

const DealViewInner = forwardRef<HTMLDivElement, DealViewProps>(
  ({ deal, sx, closeComponent }: DealViewProps, ref) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedImage, setSelectedImage] = useState<string | undefined>(
      deal?.offer.options.airplane.media[0].thumbnail,
    );
    const [showImg, setShowImg] = useState<string | undefined>();

    if (!deal) {
      return null;
    }

    return (
      <Paper
        ref={ref}
        tabIndex={0}
        sx={{
          padding: 2,
          paddingTop: '32px',
          width: '85%',
          position: 'relative',
          margin: 'auto',
          ...sx,
        }}
      >
        {closeComponent && <>{closeComponent}</>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5} md={4} lg={3}>
            {isSmallScreen && (
              <Typography variant="h5" component="h2" gutterBottom>
                {deal.offer.options.airplane.name}
              </Typography>
            )}
            <Card
              sx={{ maxWidth: '100%', mb: 2 }}
              onClick={() => setShowImg(selectedImage)}
            >
              <CardMedia
                component="img"
                image={selectedImage}
                alt={deal.offer.options.airplane.name}
                sx={{ width: '100%', height: 'auto' }}
              />
            </Card>
            <Grid container spacing={1}>
              {deal.offer.options.airplane.media
                .slice(0, 4)
                .map((media, index) => (
                  <Grid item xs={3} sm={2} md={1.5} lg={1} key={index}>
                    <Card
                      onMouseOver={() => setSelectedImage(media.thumbnail)}
                      onClick={() => setSelectedImage(media.thumbnail)}
                    >
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

        <Modal
          open={Boolean(showImg)}
          onClose={() => setShowImg(undefined)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Card sx={{ width: '95vw', maxHeight: '86vh', overflowY: 'auto' }}>
            <IconButton
              onClick={() => setShowImg(undefined)}
              sx={{
                position: 'absolute',
                top: 6,
                right: 6,
                zIndex: 1,
                bgcolor: 'white',
              }}
            >
              <CloseIcon />
            </IconButton>
            <CardMedia component="img" image={showImg} />
          </Card>
        </Modal>
      </Paper>
    );
  },
);

export const DealView = ({
  isModal = true,
  deal,
  onClose = () => {},
  sx,
}: DealViewProps) => {
  if (isModal) {
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
        <DealViewInner
          deal={deal}
          sx={sx}
          closeComponent={
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
          }
        />
      </Modal>
    );
  }

  return <DealViewInner deal={deal} sx={sx} />;
};
