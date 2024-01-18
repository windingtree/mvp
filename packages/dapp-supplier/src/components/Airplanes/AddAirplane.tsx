import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  FormLabel,
  Stack,
  TextField,
  Typography,
  Modal,
  Card,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm } from '@conform-to/react';
import { parse } from '@conform-to/zod';
import {
  AirplaneConfiguration,
  AirplaneConfigurationSchema,
  AirplaneMedia,
  AirplaneMeta,
  PriceOption,
} from './type.js';
import { useNode } from '@windingtree/sdk-react/providers';
import { Gallery } from './Gallery.js';
import { Prices } from './Prices.js';
import { AppRouter } from '@windingtree/mvp-node';
import { inferProcedureInput } from '@trpc/server';

type AirplanesAddInput = inferProcedureInput<AppRouter['airlines']['add']>;

interface AddAirplaneProps {
  show?: boolean;
  onDone?: () => void;
  record?: AirplaneMeta;
}

export const AddAirplane = ({
  show = true,
  record,
  onDone = () => {},
}: AddAirplaneProps) => {
  const { node } = useNode<AppRouter>();
  const [values, setValues] = useState<AirplaneConfiguration | undefined>();
  const [prices, setPrices] = useState<PriceOption[]>([]);
  const [gallery, setGallery] = useState<AirplaneMedia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (record) {
      setValues(record.config);
      setPrices(record.prices);
      setGallery(record.media);
    }
  }, [record]);

  const handleAdd = useCallback(
    async (record: AirplanesAddInput) => {
      try {
        setIsLoading(true);

        if (!node) {
          throw new Error('Not connected to the node');
        }

        await node.airlines.add.mutate(record);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(true);
        setError((err as Error).message ?? 'Unknown airplanes addition error');
      }
    },
    [node],
  );

  const handleUpdate = useCallback(
    async (id: string, record: AirplanesAddInput) => {
      try {
        setIsLoading(true);

        if (!node) {
          throw new Error('Not connected to the node');
        }

        await node.airlines.update.mutate({
          id,
          data: record,
        });
        setIsLoading(false);
      } catch (err) {
        setIsLoading(true);
        setError((err as Error).message ?? 'Unknown airplanes update error');
      }
    },
    [node],
  );

  const [form, fieldset] = useForm<AirplaneConfiguration>({
    shouldValidate: 'onBlur',
    onValidate({ formData }) {
      const submission = parse(formData, {
        schema: AirplaneConfigurationSchema,
      });
      return submission;
    },
    onSubmit(e, { submission }) {
      e.preventDefault();

      if (!node) {
        setError('Not connected to the Node yet');
        return;
      }

      setIsLoading(true);
      // console.log('@@@', submission);
      // console.log('===', gallery, prices);

      const data: AirplanesAddInput = {
        name: submission.value.name,
        description: submission.value.description,
        capacity: submission.value.capacity,
        minTime: submission.value.minTime,
        maxTime: submission.value.maxTime,
        media: gallery,
        price: prices.map((p) => ({
          value: BigInt(p.price).toString(),
          token: p.coin.address,
        })),
      };

      console.log('Record ===', data);

      if (record?.id) {
        handleUpdate(record.id, data).then(() => {
          handleReset();
          onDone();
        });
      } else {
        handleAdd(data).then(() => {
          handleReset();
          onDone();
        });
      }
    },
  });

  const handleReset = useCallback(() => {
    setValues(undefined);
    setGallery([]);
    setPrices([]);
  }, []);

  const isReady = useMemo(
    () => form.errors.length === 0 && gallery.length > 0 && prices.length > 0,
    [form.errors.length, gallery.length, prices.length],
  );

  useEffect(() => {
    console.log('%%% new Gal', gallery);
  }, [gallery]);

  if (!show) {
    return null;
  }

  return (
    <>
      <Modal
        open={show}
        onClose={onDone}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 2,
        }}
      >
        <Card
          sx={{
            width: '95vw',
            maxHeight: '86vh',
            padding: 2,
            overflowY: 'auto',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              bgcolor: 'white',
            }}
            size="small"
            onClick={() => {
              handleReset();
              onDone();
            }}
          >
            <CloseIcon />
          </IconButton>
          <form {...form.props}>
            <Stack spacing={4} sx={{ marginBottom: 2 }}>
              <header>
                <Typography variant="h6" component="h1">
                  Airplane configuration {record?.id && `(#${record.id})`}
                </Typography>
                <Typography variant="subtitle1">
                  Using this for you are able to add or update airplane in the
                  Node database
                </Typography>
              </header>

              <FormLabel>
                <Typography variant="h6">General Configuration</Typography>
              </FormLabel>

              <TextField
                label="Airplane Type"
                type="text"
                name="name"
                placeholder="Copy your airplane type/name here"
                required
                defaultValue={values?.name}
                disabled={isLoading}
                error={Boolean(fieldset.name.error)}
                helperText={fieldset.name.error}
              />
              <TextField
                label="Airplane Details"
                type="text"
                name="description"
                placeholder="Copy your airplane details here (markdown accepted)"
                multiline
                rows={4}
                required
                defaultValue={values?.description}
                disabled={isLoading}
                error={Boolean(fieldset.description.error)}
                helperText={fieldset.description.error}
              />
              <Stack direction="row" spacing={4}>
                <TextField
                  label="Airplane Capacity"
                  type="number"
                  name="capacity"
                  placeholder="Copy your the maximum number of airplane passengers"
                  required
                  defaultValue={values?.capacity}
                  disabled={isLoading}
                />
              </Stack>

              <Stack direction="row" spacing={4}>
                <TextField
                  label="Minimum Flight Duration"
                  type="number"
                  name="minTime"
                  placeholder="Copy your the minimum duration of flight in minutes"
                  required
                  defaultValue={values?.minTime}
                  disabled={isLoading}
                  error={Boolean(fieldset.minTime.error)}
                  helperText={fieldset.minTime.error}
                />
                <TextField
                  label="Maximum Flight Duration"
                  type="number"
                  name="maxTime"
                  placeholder="Copy your the maximum duration of flight in minutes"
                  required
                  defaultValue={values?.maxTime}
                  disabled={isLoading}
                  error={Boolean(fieldset.maxTime.error)}
                  helperText={fieldset.maxTime.error}
                />
              </Stack>

              <Gallery
                gallery={gallery}
                onChange={setGallery}
                disabled={isLoading}
              />

              <Prices
                prices={prices}
                onChange={setPrices}
                disabled={isLoading}
              />

              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                sx={{ paddingTop: 4 }}
              >
                <Button
                  type="reset"
                  variant="outlined"
                  disabled={isLoading}
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading || !isReady}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography>{record ? 'Update' : 'Add'}</Typography>
                    {isLoading && (
                      <CircularProgress color="inherit" size={16} />
                    )}
                  </Stack>
                </Button>
              </Stack>
            </Stack>
          </form>

          <Stack spacing={4} sx={{ marginBottom: 2 }}></Stack>

          {error && <Alert severity="error">{error}</Alert>}
        </Card>
      </Modal>
    </>
  );
};
