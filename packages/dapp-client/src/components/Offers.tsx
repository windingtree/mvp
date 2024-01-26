import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Box,
} from '@mui/material';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { OfferData } from '@windingtree/sdk-types';
import { RequestQuery } from 'mvp-shared-files';
// import { createLogger } from '@windingtree/sdk-logger';

// const logger = createLogger('Offers');

interface OffersProps {
  offers?: OfferData<RequestQuery, OfferOptions>[];
  subscribed: boolean;
  onStop: () => void;
}

export const Offers = ({
  offers,
  subscribed,
  onStop = () => {},
}: OffersProps) => {
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
              <Stack direction="row" spacing={2}>
                <Box sx={{ paddingRight: 1, borderRight: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.options.airplane.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    {item.options.date}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Hours: {item.options.hours}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={4}>
        {subscribed && (
          <Card
            sx={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: 300,
              height: '100%',
            }}
            onClick={onStop}
            variant="outlined"
          >
            <CardContent>
              <CircularProgress title="Stop" size={80} thickness={1} />
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};
