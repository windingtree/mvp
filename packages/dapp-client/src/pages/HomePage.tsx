import { Container } from '@mui/material';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import { mainShowcase } from '../config.js';

export const HomePage = () => {
  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Grid container spacing={2}>
        {mainShowcase.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
              onClick={() => console.log(item.name)}
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
