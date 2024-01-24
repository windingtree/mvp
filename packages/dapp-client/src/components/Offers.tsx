import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { OfferData } from '@windingtree/sdk-types';
import { RequestQuery } from 'mvp-shared-files';
// import { createLogger } from '@windingtree/sdk-logger';

// const logger = createLogger('Offers');

interface OffersProps {
  offers?: OfferData<RequestQuery, OfferOptions>[];
}

export const Offers = ({ offers }: OffersProps) => {
  if (!offers || (offers && offers.length === 0)) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      {offers.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            sx={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 300,
              height: '100%',
            }}
            onClick={() => {}}
          >
            <CardMedia
              sx={{ height: 140 }}
              image={item.options.airplane.media[0].thumbnail}
              title={item.options.airplane.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.options.airplane.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.options.airplane.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={4}>
        <CircularProgress size={20} />
      </Grid>
    </Grid>
  );
};
