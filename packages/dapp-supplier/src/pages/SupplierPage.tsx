import { useCallback, useState } from 'react';
import { Container } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { SupplierTabs } from '../components/SupplierTabs/SupplierTabs.js';
import { SupplierTabPanel } from '../components/SupplierTabs/SupplierTabPanel.js';
// import { NodeConfigForm } from '../components/SupplierManage/NodeConfig.js';
import { DealSeek } from '../components/DealSeek.js';
import { SupplierSetup } from './SupplierSetup.js';
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
    <Container sx={{ paddingBottom: 20 }}>
      <SupplierTabs value={value} tabs={tabs} onChange={handleChange} />
      <SupplierTabPanel index={0} value={value}>
        <SupplierSetup />
      </SupplierTabPanel>
      <SupplierTabPanel index={1} value={value}>
        {/* <LoginWidget /> */}
      </SupplierTabPanel>
      <SupplierTabPanel index={2} value={value}>
        <DealSeek />
      </SupplierTabPanel>
      <SupplierTabPanel index={3} value={value}>
        {/* <NodeConfigForm /> */}
      </SupplierTabPanel>
    </Container>
  );
};
