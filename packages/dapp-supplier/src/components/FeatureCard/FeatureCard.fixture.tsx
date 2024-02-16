import { Grid } from '@mui/material';
import { FeatureCard } from './index.js';
import { InstallDesktop, Key } from '@mui/icons-material';

export default (
  <>
    <FeatureCard title={'Setup'} icon={<InstallDesktop />} />
    <hr />
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <FeatureCard title={'Setup'} icon={<InstallDesktop />} />
      </Grid>
      <Grid item xs={2}>
        <FeatureCard
          title={'Setup'}
          icon={<InstallDesktop />}
          badge={<Key />}
        />
      </Grid>
      <Grid item xs={2}>
        <FeatureCard title={'Setup'} icon={<InstallDesktop />} />
      </Grid>
    </Grid>
    <hr />
    <FeatureCard title={'Setup'} icon={<InstallDesktop />} badge="auth" />
    <hr />
    <FeatureCard title={'Setup'} icon={<InstallDesktop />} badge={<Key />} />
  </>
);
