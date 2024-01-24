import { useMemo, useEffect, useState, useCallback } from 'react';
import {
  Alert,
  Container,
  Grid,
  Card,
  CardMedia,
  Button,
  CardContent,
  Typography,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { useSearchParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { useRequests } from '../hooks/useRequests.js';
import { mainShowcase, requestExpiration, nodeTopic } from '../config.js';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { RequestQuery } from 'mvp-shared-files';
import { ClientRequestRecord } from '@windingtree/sdk-client';
import { Offers } from '../components/Offers.js';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('SearchPage');

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tourId = searchParams.get('tour');
  const tour = useMemo(
    () => mainShowcase.find((t) => t.id === tourId),
    [tourId],
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs(new Date()),
  );
  const [tourError, setTourError] = useState<string | undefined>();
  const {
    clientConnected,
    requestsManager,
    publish,
    error: requestsError,
  } = useRequests({
    expire: requestExpiration,
    topic: nodeTopic,
  });
  const [currentRequest, setCurrentRequest] = useState<
    ClientRequestRecord<RequestQuery, OfferOptions> | undefined
  >();

  useEffect(() => {
    if (!tour) {
      setTourError(`Tour "${tourId}" not found`);
    } else {
      setTourError(undefined);
    }
  }, [tourId, tour]);

  const currentOffers = useMemo(
    () => currentRequest?.offers ?? [],
    [currentRequest?.offers],
  );

  const handlePublish = useCallback(async () => {
    try {
      if (selectedDate) {
        if (requestsManager && currentRequest) {
          requestsManager.cancel(currentRequest.data.id);
          setCurrentRequest(undefined);
        }

        const request = await publish({
          date: selectedDate.format('YYYY-MM-DD'),
        });

        if (request) {
          setCurrentRequest(() => request);
        }
      }
    } catch (err) {
      logger.error(err);
    }
  }, [currentRequest, publish, requestsManager, selectedDate]);

  const handleRequestCancel = useCallback(() => {
    if (requestsManager && currentRequest) {
      requestsManager.cancel(currentRequest.data.id);
      setCurrentRequest(undefined);
      navigate('/');
    } else {
      navigate('/');
    }
  }, [currentRequest, navigate, requestsManager]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        {tour && (
          <Grid container spacing={2} alignItems="flex-start">
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Card sx={{ maxWidth: 300 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={tour.media.thumbnail}
                  alt={tour.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {tour.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tour.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} container spacing={2}>
              <Grid item>
                <DatePicker
                  label="Choose a Date"
                  value={dayjs(selectedDate)}
                  onChange={setSelectedDate}
                />
              </Grid>
              <Grid item container spacing={1}>
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    disabled={!clientConnected}
                    onClick={handlePublish}
                  >
                    Search
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="large"
                    variant="outlined"
                    onClick={handleRequestCancel}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Offers offers={currentOffers} />

        {tourError && <Alert severity="error">{tourError}</Alert>}
        {requestsError && <Alert severity="error">{requestsError}</Alert>}
      </Container>
    </LocalizationProvider>
  );
};
