import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
} from '@mui/material';
import { BrowserCodeReader } from '@zxing/browser';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('CameraSelector');

interface CameraSelectorProps {
  sx?: SxProps;
  onChange: (deviceId: string) => void;
}

export const CameraSelector = ({ sx, onChange }: CameraSelectorProps) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [cameraId, setCameraId] = useState<string | ''>('');

  useEffect(() => {
    BrowserCodeReader.listVideoInputDevices()
      .then((d) => setDevices(() => d))
      .catch((err) => {
        logger.error('getVideoInputDevices', err);
        setError(err.message ?? 'Unknown listVideoInputDevices error');
      });
  }, []);

  useEffect(() => {
    if (cameraId !== '') {
      onChange(cameraId);
    }
  }, [onChange, cameraId]);

  return (
    <>
      <Box sx={{ minWidth: 120, ...sx }}>
        <FormControl fullWidth>
          <InputLabel id="camera-select-label">Camera or File</InputLabel>
          <Select
            labelId="camera-select-label"
            id="camera-select"
            value={cameraId}
            label="camera"
            onChange={(e) => setCameraId(e.target.value)}
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
      {error && (
        <Alert sx={{ marginTop: 1, marginBottom: 2 }} severity="error">
          {error}
        </Alert>
      )}
    </>
  );
};
