import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mainShowcase } from '../config.js';
import { PageContainer } from 'mvp-shared-files/react';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <Alert severity="info">
          This project demonstrates features of the{' '}
          <Link href="https://windingtree.github.io/sdk/">
            Winding Tree Market Protocol
          </Link>
          .<br /> All the content is synthetic and used for illustration.
        </Alert>
      </Box>
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
    </PageContainer>
  );
};
