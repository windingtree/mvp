import { useMemo, useEffect, useState } from 'react';
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
import { mainShowcase } from '../config.js';

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

  useEffect(() => {
    if (!tour) {
      setTourError(`Tour "${tourId}" not found`);
    } else {
      setTourError(undefined);
    }
  }, [tourId, tour]);

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
                  <Button size="large" variant="contained" color="primary">
                    Search
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="large"
                    variant="outlined"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {tourError && <Alert severity="error">{tourError}</Alert>}
      </Container>
    </LocalizationProvider>
  );
};
