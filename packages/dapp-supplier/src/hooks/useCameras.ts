import { useEffect, useState } from 'react';
import { Html5Qrcode, CameraDevice } from 'html5-qrcode';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('useCameras');

export interface UseCamerasHook {
  devices: CameraDevice[];
  error?: string;
}

export const useCameras = (): UseCamerasHook => {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((d) => setDevices(() => d))
      .catch((err) => {
        logger.error('getCameras', err);
        setError(() => err.message ?? 'Unknown useCameras error');
      });
  }, []);

  return {
    devices,
    error,
  };
};
