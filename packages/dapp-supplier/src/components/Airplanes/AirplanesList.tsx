import {
  Alert,
  Grid,
  Typography,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { AppRouter } from '@windingtree/mvp-node/types';
import { useNode } from '@windingtree/sdk-react/providers';
import { useCallback, useEffect, useState } from 'react';
import { inferProcedureOutput } from '@trpc/server';
import { AirplaneMeta, PriceOption } from './type.js';
import { useProtocolConfig } from '../../hooks/useProtocolConfig.js';

type AirplanesResponseGetAll = inferProcedureOutput<
  AppRouter['airlines']['getAll']
>;

interface AirplanesListProps {
  version?: number;
  onSelected: (data: AirplaneMeta) => void;
}

export const AirplanesList = ({
  version = 1,
  onSelected,
}: AirplanesListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { node, nodeConnected } = useNode<AppRouter>();
  const { stableCoins } = useProtocolConfig();
  const [records, setRecords] = useState<AirplanesResponseGetAll>([]);
  const [error, setError] = useState<string | undefined>();

  const handleGetAirplanes = useCallback(async () => {
    try {
      setError(undefined);

      if (!node) {
        return;
      }

      const response = await node.airlines.getAll.query();
      setRecords(response);
    } catch (err) {
      setError((err as Error).message ?? 'Unknown airplanes list error');
    }
  }, [node]);

  const handleDelete = useCallback(
    async (id?: string) => {
      try {
        if (!node) {
          throw new Error('Not connected to the node');
        }

        if (!id) {
          throw new Error('Invalid configuration. Record Id not found');
        }

        await node.airlines.delete.mutate(id);
        handleGetAirplanes();
      } catch (err) {
        setError((err as Error).message ?? 'Unknown airplanes delete error');
      }
    },
    [handleGetAirplanes, node],
  );

  const handleSelect = useCallback(
    (record: AirplanesResponseGetAll[number]) => {
      onSelected({
        id: record.id,
        config: {
          name: record.name,
          description: record.description,
          capacity: record.capacity,
          minTime: record.minTime,
          maxTime: record.maxTime,
        },
        media: record.media,
        prices: record.price.reduce((a, v) => {
          const coin = stableCoins.find((c) => c.address === v.token);

          if (coin) {
            return [
              ...a,
              {
                price: BigInt(v.value),
                coin,
              },
            ];
          }

          return a;
        }, [] as PriceOption[]),
      });
    },
    [onSelected, stableCoins],
  );

  useEffect(() => {
    if (node) {
      handleGetAirplanes();
    }
  }, [node, handleGetAirplanes, version]);

  if (!nodeConnected && records.length === 0) {
    return (
      <>
        <Typography variant="h6">
          Unable to get the list of airplanes. Not connected to the Node.
        </Typography>
      </>
    );
  }

  return (
    <>
      {records.length === 0 && (
        <Grid container spacing={2}>
          <Grid item sx={{ padding: 10, textAlign: 'center' }}>
            <Typography variant="body1">Airplanes list is empty</Typography>
          </Grid>
        </Grid>
      )}

      {records.length > 0 && (
        <>
          {!isMobile && (
            <Grid container spacing={2} sx={{ borderBottom: 1 }}>
              <Grid item xs={4} sx={{ textAlign: 'left' }}>
                <Typography variant="caption">Name (type)</Typography>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: 'center' }}>
                <Typography variant="caption">Capacity</Typography>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: 'center' }}>
                <Typography variant="caption">Min hours</Typography>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: 'center' }}>
                <Typography variant="caption">Max hours</Typography>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: 'center' }}>
                <Typography variant="caption">Action</Typography>
              </Grid>
            </Grid>
          )}

          {records.map((r, i) => (
            <Grid
              key={i}
              container
              spacing={2}
              sx={{
                borderBottom: isMobile ? 1 : 'none',
                marginTop: isMobile ? 2 : 0,
                ':first-child': { marginTop: 0 },
                marginBottom: isMobile ? 2 : 0,
                paddingBottom: isMobile ? 2 : 0,
              }}
            >
              <Grid item xs={isMobile ? 12 : 4} sx={{ textAlign: 'left' }}>
                {isMobile && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h6">Name (type):</Typography>
                    <Typography variant="body1">{r.name}</Typography>
                  </Stack>
                )}
                {!isMobile && <Typography variant="body1">{r.name}</Typography>}
              </Grid>
              <Grid item xs={isMobile ? 12 : 2} sx={{ textAlign: 'center' }}>
                {isMobile && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h6">Capacity:</Typography>
                    <Typography variant="body1">{r.capacity}</Typography>
                  </Stack>
                )}
                {!isMobile && (
                  <Typography variant="body1">{r.capacity}</Typography>
                )}
              </Grid>
              <Grid item xs={isMobile ? 12 : 2} sx={{ textAlign: 'center' }}>
                {isMobile && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h6">Min hours:</Typography>
                    <Typography variant="body1">{r.minTime}</Typography>
                  </Stack>
                )}
                {!isMobile && (
                  <Typography variant="body1">{r.minTime}</Typography>
                )}
              </Grid>
              <Grid item xs={isMobile ? 12 : 2} sx={{ textAlign: 'center' }}>
                {isMobile && (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h6">Max hours:</Typography>
                    <Typography variant="body1">{r.maxTime}</Typography>
                  </Stack>
                )}
                {!isMobile && (
                  <Typography variant="body1">{r.maxTime}</Typography>
                )}
              </Grid>
              <Grid
                item
                xs={isMobile ? 12 : 2}
                sx={{ textAlign: isMobile ? 'left' : 'center' }}
              >
                {isMobile && (
                  <Stack direction="row" spacing={2}>
                    <Typography variant="h6">Action:</Typography>
                    <IconButton size="small" onClick={() => handleSelect(r)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(r.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
                {!isMobile && (
                  <Stack direction="row" spacing={2}>
                    <IconButton size="small" onClick={() => handleSelect(r)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(r.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
              </Grid>
            </Grid>
          ))}
        </>
      )}

      {error && <Alert severity="error">{error}</Alert>}
    </>
  );
};
