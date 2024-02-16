import { Container, Grid, Typography } from '@mui/material';
import { FeatureCard } from '../components/FeatureCard/index.js';

export const HomePage = () => {
  return (
    <Container sx={{ paddingTop: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4">Basic configuration</Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FeatureCard title="Node URL" />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FeatureCard title="IPFS API Key" />
        </Grid>
      </Grid>
    </Container>
  );
};
