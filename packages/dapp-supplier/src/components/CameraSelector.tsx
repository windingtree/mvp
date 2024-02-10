import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SxProps,
} from '@mui/material';
import { useCameras } from '../hooks/useCameras.js';
import { useEffect, useState } from 'react';

interface CameraSelectorProps {
  sx?: SxProps;
  onChange: (deviceId: string) => void;
}

export const CameraSelector = ({ sx, onChange }: CameraSelectorProps) => {
  const { devices, error: devicesError } = useCameras();
  const [cameraId, setCameraId] = useState<string | ''>('');

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
                <MenuItem key={index} value={d.id}>
                  {d.label}
                </MenuItem>
              ))}
            <MenuItem value="file">File</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {devicesError && (
        <Alert sx={{ marginTop: 1, marginBottom: 2 }} severity="error">
          {devicesError}
        </Alert>
      )}
    </>
  );
};
