import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import { SupplierTabs } from '../components/SupplierTabs/SupplierTabs.js';
import { SupplierTabPanel } from '../components/SupplierTabs/SupplierTabPanel.js';
import {
  actionTabs,
  getTabIndex,
} from '../components/SupplierTabs/SupplierTabsConfig.js';
import { SupplierRegister } from '../components/SupplierManage/SupplierRegister.js';
import { SupplierView } from '../components/SupplierManage/SupplierView.js';
import { SupplierManage } from '../components/SupplierManage/SupplierManage.js';
import { NodeConfig } from '../components/SupplierManage/NodeConfig.js';
import { IpfsConfig } from '../components/SupplierManage/IpfsConfig.js';

export const SupplierSetupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState<number | undefined>(
    getTabIndex(actionTabs, location),
  );

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

  useEffect(() => {
    setValue(getTabIndex(actionTabs, location));
  }, [location]);

  return (
    <Container sx={{ paddingTop: 1, paddingBottom: 20 }}>
      <SupplierTabs value={value} tabs={actionTabs} onChange={handleChange} />
      <SupplierTabPanel index={0} value={value} sx={{ paddingTop: 4 }}>
        <SupplierRegister />
      </SupplierTabPanel>
      <SupplierTabPanel index={1} value={value} sx={{ paddingTop: 4 }}>
        <SupplierView />
      </SupplierTabPanel>
      <SupplierTabPanel index={2} value={value} sx={{ paddingTop: 4 }}>
        <SupplierManage />
      </SupplierTabPanel>
      <SupplierTabPanel index={3} value={value} sx={{ paddingTop: 4 }}>
        <NodeConfig />
      </SupplierTabPanel>
      <SupplierTabPanel index={4} value={value} sx={{ paddingTop: 4 }}>
        <IpfsConfig />
      </SupplierTabPanel>
    </Container>
  );
};
