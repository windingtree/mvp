import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Box,
  Alert,
} from '@mui/material';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { OfferData, PaymentOption } from '@windingtree/sdk-types';
import { isExpired } from '@windingtree/sdk-utils/time';
import { RequestQuery } from 'mvp-shared-files';
import { DateTime } from 'luxon';
import { parsePayment } from '../utils/offer.js';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('OffersList');

const Prices = ({ payments }: { payments: PaymentOption[] }) => {
  const [prices, setPrices] = useState<string[]>([]);

  useEffect(() => {
    const getPrices = async () => {
      try {
        const res = await parsePayment(payments, 'string');
        setPrices(res);
      } catch (err) {
        logger.error('getPrices', err);
        setPrices([]);
      }
    };
    getPrices();
  }, [payments]);

  return (
    <>
      <Typography variant="h6" color="text.secondary">
        Prices:
      </Typography>
      <ul style={{ padding: '0 0 0 16px', margin: 0 }}>
        {prices.map((p, i) => (
          <li key={i}>
            <Typography variant="body2">{p}</Typography>
          </li>
        ))}
      </ul>
    </>
  );
};

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
  const navigate = useNavigate();

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
            onClick={() => {
              navigate(
                `/offer?requestId=${item.request.id}&offerId=${item.id}`,
              );
            }}
          >
            <CardMedia
              sx={{ height: 140 }}
              image={item.options.airplane.media[0].thumbnail}
              title={item.options.airplane.name}
            />
            <CardContent>
              {isExpired(item.expire) && (
                <Alert severity="warning" sx={{ marginBottom: 1 }}>
                  Expired at{' '}
                  {DateTime.fromSeconds(
                    parseInt(item.expire.toString()),
                  ).toFormat('yyyy/MM/dd mm:ss')}
                </Alert>
              )}
              <Stack direction="row" spacing={2}>
                <Box sx={{ paddingRight: 1, borderRight: 1 }}>
                  <Typography gutterBottom variant="h5">
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
                  <Prices payments={item.payment} />
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
