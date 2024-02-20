import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Stack, Typography } from '@mui/material';
import {
  Link as LinkIcon,
  Key as KeyIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  AppRegistration as RegisterIcon,
  ManageAccounts as ManageIcon,
  Visibility as VisibilityIcon,
  PersonAdd as PersonIcon,
  SelfImprovement as AdminIcon,
  Group as TeamIcon,
  ConnectingAirports as AirplanesIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { FeatureCard } from '../components/FeatureCard/index.js';
import { useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../main.js';
import { PageContainer } from 'mvp-shared-files/react';
import { useEntity } from '../hooks/useEntity.js';

export const HomePage = () => {
  const navigate = useNavigate();
  const { nodeHost } = useConfig<CustomConfig>();
  const { ipfsProjectId, ipfsServerKey, supplierId } =
    useConfig<CustomConfig>();
  const {
    data: { status },
  } = useEntity(supplierId);

  const nodeHostReady = useMemo(
    () => String(nodeHost).startsWith('http'),
    [nodeHost],
  );
  const ipfsConfigReady = useMemo(
    () => ipfsProjectId && ipfsServerKey,
    [ipfsProjectId, ipfsServerKey],
  );

  return (
    <PageContainer>
      {(!nodeHostReady || !ipfsConfigReady) && (
        <Grid container spacing={4} sx={{ marginTop: 0 }}>
          <Grid item xs={12}>
            <Typography variant="h5">Basic configuration</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={true}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
            }}
          >
            <FeatureCard
              title="Node URL"
              icon={<LinkIcon />}
              badge={
                nodeHostReady ? (
                  <CheckIcon color="success" />
                ) : (
                  <WarningIcon color="warning" />
                )
              }
              badgeColor="default"
              onClick={() => navigate('/supplier/setup/node')}
              sx={{ flexGrow: 1 }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={true}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
            }}
          >
            <FeatureCard
              title="IPFS API Config"
              icon={<KeyIcon />}
              badge={
                ipfsConfigReady ? (
                  <CheckIcon color="success" />
                ) : (
                  <WarningIcon color="warning" />
                )
              }
              badgeColor="default"
              onClick={() => navigate('/supplier/setup/ipfs')}
              sx={{ flexGrow: 1 }}
            />
          </Grid>
        </Grid>
      )}

      <Grid
        container
        spacing={4}
        sx={{ marginTop: nodeHostReady && ipfsConfigReady ? 0 : 2 }}
      >
        <Grid item xs={12}>
          <Typography variant="h5">Entity Setup</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={true}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          <FeatureCard
            title="Register Entity"
            icon={<RegisterIcon />}
            badge={
              supplierId ? (
                <CheckIcon color="success" />
              ) : (
                <WarningIcon color="warning" />
              )
            }
            badgeColor="default"
            onClick={() => navigate('/supplier/setup/register')}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={true}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          <FeatureCard
            title="Manage Entity"
            icon={<ManageIcon />}
            badge={
              <Stack direction="row" alignItems="center" spacing={1}>
                <KeyIcon />
                <Typography variant="caption">admin</Typography>
              </Stack>
            }
            onClick={() => navigate('/supplier/setup/manage')}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={true}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          <FeatureCard
            title="View Entity Status"
            icon={<VisibilityIcon />}
            badge={supplierId ? (status ? 'enabled' : 'disabled') : null}
            badgeColor="warning"
            onClick={() => navigate('/supplier/setup/view')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h5">Access Management</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={true}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          <FeatureCard
            title="Register Admin"
            icon={<AdminIcon />}
            onClick={() => navigate('/auth?panel=registerAdmin')}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={true}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          <FeatureCard
            title="Register Manager"
            icon={<PersonIcon />}
            badge={
              <Stack direction="row" alignItems="center" spacing={1}>
                <KeyIcon />
                <Typography variant="caption">admin</Typography>
              </Stack>
            }
            onClick={() => navigate('/auth?panel=registerUser')}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={true}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          <FeatureCard
            title="Manage Team"
            icon={<TeamIcon />}
            badge={
              <Stack direction="row" alignItems="center" spacing={1}>
                <KeyIcon />
                <Typography variant="caption">admin</Typography>
              </Stack>
            }
            onClick={() => navigate('/auth?panel=manageTeam')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h5">Property Management</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={true}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          <FeatureCard
            title="Airplanes"
            icon={<AirplanesIcon />}
            badge={
              <Stack direction="row" alignItems="center" spacing={1}>
                <KeyIcon />
                <Typography variant="caption">admin</Typography>
              </Stack>
            }
            onClick={() => navigate('/airplanes')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h5">Deals Management</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={true}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          <FeatureCard
            title="Deals"
            icon={<ShoppingCartIcon />}
            badge={
              <Stack direction="row" alignItems="center" spacing={1}>
                <KeyIcon />
                <Typography variant="caption">manager</Typography>
              </Stack>
            }
            badgeColor="secondary"
            onClick={() => navigate('/deals')}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
};
