import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  CircularProgress,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from '@conform-to/react';
import { parse } from '@conform-to/zod';
import {
  AirplaneConfiguration,
  AirplaneConfigurationSchema,
  AirplaneMedia,
  PriceOption,
} from './type.js';
import { ConfigActions, useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../../main.js';
import { Gallery } from './Gallery.js';
import { Prices } from './Prices.js';

export const AddAirplane = () => {
  const { cacheAirplane, setConfig } = useConfig<CustomConfig>();
  const [prices, setPrices] = useState<PriceOption[]>([]);
  const [gallery, setGallery] = useState<AirplaneMedia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [form, fieldset] = useForm<AirplaneConfiguration>({
    defaultValue: cacheAirplane,
    shouldValidate: 'onBlur',
    onValidate({ formData }) {
      const submission = parse(formData, {
        schema: AirplaneConfigurationSchema,
      });
      setConfig({
        type: ConfigActions.SET_CONFIG,
        payload: {
          cacheAirplane: submission.payload as AirplaneConfiguration,
        },
      });
      return submission;
    },
    onSubmit(e, { submission }) {
      e.preventDefault();
      setIsLoading(true);
      console.log('@@@', submission);
      console.log('===', gallery, prices);
      // TODO Send request to the Node
      // TODO Handle Node response

      setIsLoading(true);
    },
  });

  const handleReset = useCallback(() => {
    setConfig({
      type: ConfigActions.SET_CONFIG,
      payload: {
        cacheAirplane: undefined,
      },
    });
    setGallery([]);
    setPrices([]);
  }, [setConfig]);

  const isReady = useMemo(
    () => form.errors.length === 0 && gallery.length > 0 && prices.length > 0,
    [form.errors.length, gallery.length, prices.length],
  );

  useEffect(() => {
    console.log('%%% new Gal', gallery);
  }, [gallery]);

  return (
    <>
      <form {...form.props}>
        <Stack spacing={4} sx={{ marginBottom: 6 }}>
          <header>
            <Typography variant="h6" component="h1">
              Airplane configuration
            </Typography>
            <Typography variant="subtitle1">
              Using this for you are able to add or update airplane in the Node
              database
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

          <Prices prices={prices} onChange={setPrices} disabled={isLoading} />

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
                <Typography>Submit</Typography>
                {isLoading && <CircularProgress color="inherit" size={16} />}
              </Stack>
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
};
