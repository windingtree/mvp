import { useCallback, useState } from 'react';
import { Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { SupplierTabs } from '../components/SupplierTabs/SupplierTabs.js';
import { SupplierTabPanel } from '../components/SupplierTabs/SupplierTabPanel.js';
import { ConfigForm } from '../components/ConfigForm.js';
import { DealSeek } from '../components/DealSeek.js';
import { Supplier } from '../components/Supplier.js';
import {
  getTabIndex,
  tabs,
} from '../components/SupplierTabs/SupplierTabsConfig.js';

export const SupplierPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(getTabIndex(tabs, location));

  const handleChange = useCallback(
    (newValue: number) => {
      setValue(newValue);
      const { path } = tabs[newValue];

      if (path) {
        navigate(path);
      }
    },
    [navigate],
  );

  return (
    <Container>
      <SupplierTabs value={value} tabs={tabs} onChange={handleChange} />
      <SupplierTabPanel index={0} value={value}>
        <Supplier />
      </SupplierTabPanel>
      <SupplierTabPanel index={1} value={value}>
        {/* <LoginWidget /> */}
      </SupplierTabPanel>
      <SupplierTabPanel index={2} value={value}>
        <DealSeek />
      </SupplierTabPanel>
      <SupplierTabPanel index={3} value={value}>
        <ConfigForm />
      </SupplierTabPanel>
    </Container>
  );
};
