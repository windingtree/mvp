import { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SupplierTabs } from '../components/SupplierTabs/SupplierTabs.js';
import { SupplierTabPanel } from '../components/SupplierTabs/SupplierTabPanel.js';
import {
  actionTabs,
  getTabIndex,
} from '../components/SupplierTabs/SupplierTabsConfig.js';
import { SupplierRegister } from './SupplierRegister.js';
import { SupplierView } from './SupplierView.js';
import { SupplierManage } from './SupplierManage/SupplierManage.js';

export const Supplier = () => {
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
    <>
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
    </>
  );
};
