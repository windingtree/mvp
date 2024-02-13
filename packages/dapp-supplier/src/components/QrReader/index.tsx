import { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { CameraSelector } from './CameraSelector.js';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { FileInput } from '../FileInput.js';
import { ImageBox } from './ImageBox.js';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('QrReader');

const defaultVideoId = 'qr-code-reader-video';
const defaultFileId = 'qr-code-reader-file';

interface QrReaderProps {
  id?: string;
  fileId?: string;
  size?: number;
  scanTimeout?: number;
  onSuccess: (
    text: string,
    result: Awaited<ReturnType<BrowserQRCodeReader['decodeFromImageElement']>>,
  ) => void;
  onError?: (errText: string, err?: Error) => void;
}

export const QrReader = ({
  id,
  fileId,
  size = 300,
  scanTimeout = 20000,
  onSuccess,
  onError = () => {},
}: QrReaderProps) => {
  const [reader, setReader] = useState<BrowserQRCodeReader | undefined>();
  const [camera, setCamera] = useState<MediaDeviceInfo | 'file' | undefined>();
  const [image, setImage] = useState<File | null>(null);
  const [stopScan, setStopScan] = useState<Function | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const isCamera = useMemo<boolean>(
    () => Boolean(camera) && camera !== 'file',
    [camera],
  );
  const imageId = useMemo<string>(
    () => `${fileId ?? defaultFileId}-${image}`,
    [fileId, image],
  );
  const videoId = useMemo<string>(() => id ?? defaultVideoId, [id]);

  useEffect(() => {
    setReader(() => new BrowserQRCodeReader());

    return () => {
      setReader(undefined);
    };
  }, [stopScan]);

  const handleFileScan = useCallback(() => {
    setSuccess(false);

    if (reader && camera === 'file' && image) {
      const img = document.getElementById(imageId) as HTMLImageElement;

      if (img) {
        reader
          .decodeFromImageElement(img)
          .then((result) => {
            const text = result.getText();
            logger.trace('decodeFromImageElement', text);
            onSuccess(text, result);
            setSuccess(true);
          })
          .catch((err) => {
            logger.error('decodeFromImageElement', err);
            onError(err.message ?? 'Unknown QR scanner error', err);
            setSuccess(false);
          });
      }
    }
  }, [camera, image, imageId, onError, onSuccess, reader]);

  const handleCameraScan = useCallback(async () => {
    setSuccess(false);

    try {
      if (reader && camera && camera !== 'file') {
        const videoElement = document.getElementById(
          videoId,
        ) as HTMLVideoElement;

        if (videoElement) {
          const controls = await reader.decodeFromVideoDevice(
            camera.deviceId,
            videoElement,
            (result) => {
              if (result) {
                const text = result.getText();
                logger.trace('decodeFromImageElement', text);
                onSuccess(text, result);
                setSuccess(true);
                controls.stop();
                setStopScan(null);
              }
            },
          );
          setStopScan(() => () => {
            controls.stop();
            setStopScan(null);
          });
          setTimeout(() => {
            setStopScan(null);
            controls.stop();
          }, scanTimeout);
        }
      }
    } catch (err) {
      logger.error('decodeFromImageElement', err);
      onError(
        (err as Error).message ?? 'Unknown QR scanner error',
        err as Error,
      );
      setSuccess(false);
    }
  }, [camera, onError, onSuccess, reader, scanTimeout, videoId]);

  return (
    <Paper
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <CameraSelector onChange={setCamera} sx={{ alignSelf: 'stretch' }} />

      {isCamera && (
        <>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Camera: {(camera as MediaDeviceInfo).label}
          </Typography>
          <video
            id={videoId}
            width={size}
            height={size}
            style={{
              border: `1px solid ${success ? 'green' : 'grey'}`,
              marginTop: '10px',
              marginBottom: '10px',
            }}
          />
          {typeof stopScan !== 'function' && (
            <Button variant="contained" size="large" onClick={handleCameraScan}>
              Scan QR
            </Button>
          )}
          {stopScan && (
            <Button variant="contained" size="large" onClick={() => stopScan()}>
              Stop scanning
            </Button>
          )}
        </>
      )}

      {!isCamera && (
        <>
          <FileInput
            id={fileId ?? defaultFileId}
            onChange={(e) => {
              if (e.target.files) {
                setImage(e.target.files[0]);
              }
            }}
            inputProps={{ accept: 'image/*' }}
            sx={{ marginTop: 2 }}
          />
          <ImageBox
            id={imageId}
            file={image}
            width={size}
            height={size}
            sx={{
              marginTop: 2,
              marginBottom: 2,
              border: `1px solid ${success ? 'green' : 'grey'}`,
            }}
          />
          {image && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => handleFileScan()}
              >
                Scan QR
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  setSuccess(false);
                  setImage(null);
                }}
              >
                Reset
              </Button>
            </Stack>
          )}
        </>
      )}
    </Paper>
  );
};
