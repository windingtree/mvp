import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  SxProps,
} from '@mui/material';
import { BrowserQRCodeReader } from '@zxing/browser';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('CameraSelector');

interface CameraSelectorProps {
  onChange: (device: MediaDeviceInfo | 'file') => void;
  sx?: SxProps;
}

export const CameraSelector = ({ sx, onChange }: CameraSelectorProps) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [allowedVideo, setAllowedVideo] = useState<'yes' | 'no' | 'pending'>(
    'pending',
  );
  const [camera, setCamera] = useState<'file' | MediaDeviceInfo>('file');
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const request = async () => {
      try {
        const stream = await navigator?.mediaDevices?.getUserMedia({
          video: true,
        });

        if (stream) {
          setAllowedVideo('yes');
        }
      } catch (err) {
        logger.error('getUserMedia', err);
        setAllowedVideo('no');
      }
    };

    request();
  }, []);

  const getDevices = useCallback(() => {
    setError(undefined);

    if (allowedVideo === 'yes') {
      BrowserQRCodeReader.listVideoInputDevices()
        .then((devices) => setDevices(() => devices))
        .catch((err) => {
          logger.error('listVideoInputDevices', err);
          setError(err.message ?? 'Unknown input devices list error');
        });
    }
  }, [allowedVideo]);

  useEffect(() => {
    getDevices();
  }, [allowedVideo, getDevices]);

  useEffect(() => {
    if (camera) {
      if (camera !== 'file') {
        navigator?.mediaDevices
          ?.getUserMedia({ video: { deviceId: { exact: camera.deviceId } } })
          .then(() => onChange(camera))
          .catch((err) => {
            logger.error('getUserMedia:onChange', err);
            setError(err.message ?? 'Unknown getUserMedia error');
          });
      } else {
        onChange(camera);
      }
    }
  }, [onChange, camera]);

  return (
    <>
      <Stack
        spacing={1}
        direction="column"
        alignItems="center"
        sx={{ width: '100%' }}
      >
        <Box sx={{ minWidth: 120, ...sx }}>
          <FormControl fullWidth>
            <InputLabel id="camera-select-label">Camera or File</InputLabel>
            <Select
              labelId="camera-select-label"
              id="camera-select"
              value={camera === 'file' ? camera : camera.deviceId}
              label="camera"
              onChange={(e) =>
                setCamera(
                  devices.find((d) => d.deviceId === e.target.value) ?? 'file',
                )
              }
            >
              {devices &&
                devices.length > 0 &&
                devices.map((d, index) => (
                  <MenuItem key={index} value={d.deviceId}>
                    {d.label}
                  </MenuItem>
                ))}
              <MenuItem value="file">File</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" size="small" onClick={getDevices}>
          Update devices
        </Button>
      </Stack>
      {error && (
        <Alert sx={{ marginTop: 1, marginBottom: 1 }} severity="error">
          {error}
        </Alert>
      )}
    </>
  );
};
