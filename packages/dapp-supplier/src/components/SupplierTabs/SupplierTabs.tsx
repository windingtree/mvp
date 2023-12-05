import { useState, useCallback, PropsWithChildren } from 'react';
import { Tabs, Tab, type SxProps } from '@mui/material';

export interface TabItem {
  title: string;
  path: string;
}

export interface TabsProps {
  value?: number;
  tabs: TabItem[];
  onChange: (tabId: number) => void;
  sx?: SxProps;
}

export interface TabPanelProps extends PropsWithChildren {
  id: number;
}

const getTabProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

// Simple tabs component
export const SupplierTabs = ({ value = 0, tabs, onChange, sx }: TabsProps) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = useCallback(
    (newValue: number) => {
      setCurrentValue(newValue);
      onChange(newValue);
    },
    [onChange],
  );

  if (tabs.length === 0) {
    return null;
  }

  return (
    <Tabs value={currentValue} onChange={(_, newVal) => handleChange(newVal)}>
      {tabs.map((t, index) => (
        <Tab key={index} label={t.title} {...getTabProps(index)} sx={sx} />
      ))}
    </Tabs>
  );
};
