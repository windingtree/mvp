import { useCallback, useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from '@conform-to/react';
import { parse } from '@conform-to/zod';
import { AirplaneConfiguration, AirplaneConfigurationSchema } from './type.js';
import { ConfigActions, useConfig } from '@windingtree/sdk-react/providers';
import { CustomConfig } from '../../main.js';
import { Gallery } from './Gallery.js';

export const AddAirplane = () => {
  const { cacheAirplane, setConfig } = useConfig<CustomConfig>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setDone] = useState<boolean>(false);

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
      console.log('@@@', submission);
    },
  });

  const handleReset = useCallback(() => {
    setConfig({
      type: ConfigActions.SET_CONFIG,
      payload: {
        cacheAirplane: undefined,
      },
    });
  }, [setConfig]);

  return (
    <>
      <form {...form.props}>
        <Stack spacing={4}>
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
            />
          </Stack>

          <Stack direction="row" spacing={4}>
            <TextField
              label="Minimum Flight Duration"
              type="number"
              name="minTime"
              placeholder="Copy your the minimum duration of flight in minutes"
              required
              error={Boolean(fieldset.minTime.error)}
              helperText={fieldset.minTime.error}
            />
            <TextField
              label="Maximum Flight Duration"
              type="number"
              name="maxTime"
              placeholder="Copy your the maximum duration of flight in minutes"
              required
              error={Boolean(fieldset.maxTime.error)}
              helperText={fieldset.maxTime.error}
            />
          </Stack>

          <Gallery onChange={() => {}} clear={isDone} />

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              type="reset"
              variant="outlined"
              disabled={isLoading}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
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
