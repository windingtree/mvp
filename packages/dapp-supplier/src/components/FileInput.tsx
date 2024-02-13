import { ChangeEvent, InputHTMLAttributes, useCallback, useRef } from 'react';
import { SxProps, styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { UploadFile as UploadFileIcon } from '@mui/icons-material';

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

interface FileInputProps {
  id?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  sx?: SxProps;
}

export const FileInput = ({ id, onChange, inputProps, sx }: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<UploadFileIcon />}
      sx={sx}
    >
      Upload file
      <VisuallyHiddenInput
        ref={inputRef}
        id={id}
        type="file"
        onChange={onChange}
        onClick={handleClick}
        {...inputProps}
      />
    </Button>
  );
};
