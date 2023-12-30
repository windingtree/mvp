import { useCallback, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  TextField,
  CardActions,
  Grid,
  FormLabel,
  Modal,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { IpfsUploadResponse, useIpfs } from '../../hooks/useIpfs.js';
import { AirplaneMedia } from './type.js';
import { createThumbnail, getImageDimensions } from '../../utils/images.js';

interface GalleryProps {
  onChange(gallery: AirplaneMedia[]): void;
  gallery: AirplaneMedia[];
  disabled?: boolean;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const Gallery = ({
  onChange,
  gallery,
  disabled = false,
}: GalleryProps) => {
  const { ipfs, error: configError } = useIpfs();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [showImg, setShowImg] = useState<string | undefined>();

  const handleUpload = useCallback(
    async (file?: File) => {
      try {
        setError(undefined);
        setIsLoading(true);

        if (!file) {
          throw new Error('Unable to read file');
        }

        const dim = await getImageDimensions(file);

        let resThumb: IpfsUploadResponse | undefined;

        if (dim.width > 200) {
          const fileThumb = await createThumbnail(file, 200);
          resThumb = await ipfs.upload(fileThumb);
        }

        const res = await ipfs.upload(file);
        onChange(
          gallery.concat([
            {
              type: 'image',
              uri: res.fastUrl,
              thumbnail: resThumb ? resThumb.fastUrl : res.fastUrl,
              description: '',
            },
          ]),
        );

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError((err as Error).message ?? 'Unknown file upload error');
      }
    },
    [gallery, ipfs, onChange],
  );

  return (
    <>
      <Stack spacing={2}>
        <FormLabel>
          <Typography variant="h6">Gallery</Typography>
        </FormLabel>
        {gallery.length > 0 && (
          <Paper sx={{ padding: 2 }}>
            <Grid container spacing={1}>
              {gallery.map((gal, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card sx={{ width: 200 }}>
                    <CardMedia
                      component="img"
                      image={gal.thumbnail}
                      onClick={() => setShowImg(gal.uri)}
                      sx={{ cursor: 'pointer', height: 200 }}
                    />
                    <CardContent>
                      <TextField
                        label="Image description"
                        type="text"
                        multiline
                        rows={2}
                        value={gal.description}
                        disabled={disabled}
                        onChange={(e) => {
                          onChange(
                            gallery.map((g, i) =>
                              i === index
                                ? {
                                    ...g,
                                    description: e.target.value,
                                  }
                                : g,
                            ),
                          );
                        }}
                      />
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => {
                          onChange(gallery.filter((_, i) => i !== index));
                        }}
                        disabled={disabled}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={Boolean(configError) || isLoading || disabled}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Upload image</Typography>
            {isLoading && <CircularProgress color="inherit" size={16} />}
          </Stack>
          <VisuallyHiddenInput
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
        </Button>
        {configError && <Alert severity="error">{configError}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <Modal
        open={Boolean(showImg)}
        onClose={() => setShowImg(undefined)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Card sx={{ width: '95vw', maxHeight: '86vh', overflowY: 'auto' }}>
          <IconButton
            onClick={() => setShowImg(undefined)}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>
          <CardMedia component="img" image={showImg} />
        </Card>
      </Modal>
    </>
  );
};
