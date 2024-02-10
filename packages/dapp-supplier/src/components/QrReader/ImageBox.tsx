import { useState, useEffect } from 'react';
import { Box, SxProps } from '@mui/material';

interface ImageBoxProps {
  id?: string;
  file: File | null;
  width: string | number;
  height: string | number;
  sx?: SxProps;
}

export const ImageBox = ({ id, file, width, height, sx }: ImageBoxProps) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSrc(null);
    }
  }, [file]);

  if (!src) {
    return null;
  }

  return (
    <Box sx={sx}>
      <img
        id={id}
        src={src}
        alt={file?.name}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
    </Box>
  );
};
