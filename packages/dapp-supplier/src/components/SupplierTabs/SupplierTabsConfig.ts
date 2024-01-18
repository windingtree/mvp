import { matchPath, type Location } from 'react-router-dom';
import { TabItem } from './SupplierTabs.js';

export const tabs: TabItem[] = [
  {
    title: 'Supplier setup',
    path: 'setup',
  },
  {
    title: 'Access',
    path: 'access',
  },
  {
    title: 'Deals',
    path: 'deals',
  },
  {
    title: 'Configuration',
    path: 'config',
  },
];

export const actionTabs: TabItem[] = [
  {
    title: 'Register',
    path: 'setup/register',
  },
  {
    title: 'View',
    path: 'setup/view',
  },
  {
    title: 'Manage',
    path: 'setup/manage',
  },
  {
    title: 'Node',
    path: 'setup/node',
  },
  {
    title: 'IPFS',
    path: 'setup/ipfs',
  },
];

export const getTabIndex = (tabs: TabItem[], location: Location) => {
  const index = tabs.findIndex((tb) =>
    matchPath(`/supplier/${tb.path}`, location.pathname),
  );
  return index !== -1 ? index : 0;
};
