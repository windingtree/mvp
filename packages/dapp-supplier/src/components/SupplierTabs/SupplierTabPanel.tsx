import { Box, type SxProps } from '@mui/material';

export interface SupplierTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: SxProps;
}

export const SupplierTabPanel = (props: SupplierTabPanelProps) => {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={sx}>{children}</Box>}
    </div>
  );
};
