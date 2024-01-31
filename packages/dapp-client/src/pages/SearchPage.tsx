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
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { useSearchParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { mainShowcase } from '../config.js';
import { OfferOptions } from '@windingtree/mvp-node/types';
import { RequestQuery } from 'mvp-shared-files';
import { ClientRequestRecord } from '@windingtree/sdk-client';
import { Offers } from '../components/Offers.js';
import { createLogger } from '@windingtree/sdk-logger';
import { useClient } from '@windingtree/sdk-react/providers';
import { useSearchProvider } from '../providers/SearchProvider/SearchProviderContext.js';

const logger = createLogger('SearchPage');

export const SearchPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tourId = searchParams.get('tour');
  const requestId = searchParams.get('requestId');
  const tour = useMemo(
    () => mainShowcase.find((t) => t.id === tourId),
    [tourId],
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [tourError, setTourError] = useState<string | undefined>();
  const { clientConnected } = useClient();
  const {
    requestsManager,
    requests,
    publish,
    error: requestsError,
  } = useSearchProvider();
  const currentRequest = useMemo<
    ClientRequestRecord<RequestQuery, OfferOptions> | undefined
  >(() => requests.find((r) => r.data.id === requestId), [requestId, requests]);

  useEffect(() => {
    if (!tour) {
      setTourError(`Tour "${tourId}" not found`);
    } else {
      setTourError(undefined);
    }
  }, [tourId, tour]);

  const handlePublish = useCallback(async () => {
    try {
      if (selectedDate) {
        if (requestsManager && currentRequest) {
          requestsManager.cancel(currentRequest.data.id);
        }

        const request = await publish({
          date: selectedDate.format('YYYY-MM-DD'),
        });

        if (request) {
          navigate(`?tour=${tourId}&requestId=${request.data.id}`);
        }
      }
    } catch (err) {
      logger.error('handlePublish', err);
    }
  }, [
    currentRequest,
    navigate,
    publish,
    requestsManager,
    selectedDate,
    tourId,
  ]);

  const handleRequestStop = useCallback(() => {
    if (requestsManager && currentRequest) {
      requestsManager.cancel(currentRequest.data.id);
    }
  }, [currentRequest, requestsManager]);

  const handleRequestCancel = useCallback(() => {
    if (requestsManager && currentRequest) {
      handleRequestStop();
      navigate(`?tour=${tourId}`);
    } else {
      navigate('/');
    }
  }, [currentRequest, handleRequestStop, navigate, requestsManager, tourId]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        {tour && (
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            sx={{ marginBottom: 4 }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: 'flex',
                justifyContent: isMobile ? 'center' : 'flex-end',
              }}
            >
              <Card sx={{ maxWidth: 300, marginBottom: 2 }}>
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
            <Grid
              item
              xs={12}
              sm={6}
              container
              spacing={2}
              sx={{
                display: 'flex',
                justifyContent: isMobile ? 'center' : 'flex-start',
              }}
            >
              <Grid item>
                <DatePicker
                  label="Choose a Date"
                  disabled={Boolean(requestId)}
                  value={selectedDate !== null ? dayjs(selectedDate) : null}
                  onChange={setSelectedDate}
                  minDate={dayjs().add(1, 'day')}
                />
              </Grid>
              <Grid
                item
                container
                spacing={1}
                sx={{
                  display: 'flex',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}
              >
                <Grid item>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    disabled={
                      !selectedDate || !clientConnected || Boolean(requestId)
                    }
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
                    {currentRequest?.subscribed ? 'Cancel' : 'Back'}
                  </Button>
                </Grid>
                <Grid item>
                  {!clientConnected && (
                    <Alert severity="warning">
                      Connecting to the server...
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Offers
          offers={currentRequest?.offers}
          subscribed={Boolean(currentRequest?.subscribed)}
          onStop={handleRequestStop}
        />

        {tourError && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {tourError}
          </Alert>
        )}
        {requestsError && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {requestsError}
          </Alert>
        )}
      </Container>
    </LocalizationProvider>
  );
};
