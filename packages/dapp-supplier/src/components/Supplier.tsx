import { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import { SupplierTabs } from '../components/SupplierTabs/SupplierTabs.js';
import { SupplierTabPanel } from '../components/SupplierTabs/SupplierTabPanel.js';
import {
  actionTabs,
  getTabIndex,
} from '../components/SupplierTabs/SupplierTabsConfig.js';
import { SupplierRegister } from './SupplierRegister.js';

export const Supplier = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(getTabIndex(actionTabs, location));

  const handleChange = useCallback(
    (newValue: number) => {
      setValue(newValue);
      const { path } = actionTabs[newValue];

      if (path) {
        navigate(path);
      }
    },
    [navigate],
  );

  return (
    <>
      <SupplierTabs value={value} tabs={actionTabs} onChange={handleChange} />
      <SupplierTabPanel index={0} value={value} sx={{ paddingTop: 4 }}>
        <SupplierRegister />
      </SupplierTabPanel>
      <SupplierTabPanel index={1} value={value} sx={{ paddingTop: 4 }}>
        <Typography>View</Typography>
      </SupplierTabPanel>
      <SupplierTabPanel index={2} value={value} sx={{ paddingTop: 4 }}>
        <Typography>Manage</Typography>
      </SupplierTabPanel>
    </>
  );
};
