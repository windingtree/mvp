import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mainShowcase } from '../config.js';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Grid container spacing={2}>
        {mainShowcase.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 300,
                height: '100%',
              }}
              onClick={() => navigate(`search?tour=${item.id}`)}
            >
              <CardMedia
                sx={{ height: 140 }}
                image={item.media.thumbnail}
                title={item.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
