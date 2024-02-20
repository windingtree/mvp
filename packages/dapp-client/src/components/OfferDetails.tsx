import {
  Grid,
  Typography,
  Card,
  CardMedia,
  Box,
  useMediaQuery,
  useTheme,
  SxProps,
  IconButton,
  Modal,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { DealRecord, OfferData } from '@windingtree/sdk-types';
import MuiMarkdown, { getOverrides } from 'mui-markdown';
import { RequestQuery } from 'mvp-shared-files';
import { BreadCrumbs } from './BreadCrumbs.js';
import { createLogger } from '@windingtree/sdk-logger';
import { useEffect, useState } from 'react';

const logger = createLogger('OfferDetails');

interface OfferDetailsProps {
  offer?: OfferData<RequestQuery, OfferOptions>;
  sx?: SxProps;
}

type Media = DealRecord<
  RequestQuery,
  OfferOptions
>['offer']['options']['airplane']['media'][number];

export const OfferDetails = ({ offer, sx }: OfferDetailsProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedImage, setSelectedImage] = useState<Media | undefined>(
    offer?.options.airplane.media[0],
  );
  const [showImg, setShowImg] = useState<string | undefined>();

  useEffect(() => {
    if (offer) {
      setSelectedImage(offer.options.airplane.media[0]);
    }
  }, [offer]);

  if (!offer) {
    logger.trace('OfferDetails', 'offer not defined in props');
    return null;
  }

  return (
    <>
      <BreadCrumbs
        links={[
          { label: 'Home', path: '/' },
          { label: 'Bookings', path: '/bookings' },
        ]}
      />
      <Grid container spacing={2} sx={sx}>
        <Grid item xs={12} sm={5} md={4} lg={3}>
          {isSmallScreen && (
            <Typography variant="h5" component="h2" gutterBottom>
              {offer.options.airplane.name}
            </Typography>
          )}
          <Card
            sx={{ maxWidth: '100%', mb: 2, cursor: 'pointer' }}
            onClick={() => setShowImg(selectedImage?.uri)}
          >
            <CardMedia
              component="img"
              image={selectedImage?.thumbnail}
              alt={offer.options.airplane.name}
              sx={{ width: '100%', height: 'auto' }}
            />
          </Card>
          <Grid container spacing={1}>
            {offer.options.airplane.media.slice(0, 4).map((media, index) => (
              <Grid item xs={3} sm={2} md={1.5} lg={1} key={index}>
                <Card
                  onMouseOver={() => setSelectedImage(media)}
                  onClick={() => setSelectedImage(media)}
                >
                  <CardMedia
                    component="img"
                    image={media.thumbnail}
                    sx={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Duration: {offer.options.hours}h
            </Typography>
            <Typography variant="body2">
              Capacity: {offer.options.airplane.capacity}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={7} md={8} lg={9}>
          {!isSmallScreen && (
            <Typography variant="h5" component="h2" gutterBottom>
              {offer.options.airplane.name}
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
              {offer.options.airplane.description}
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
    </>
  );
};
