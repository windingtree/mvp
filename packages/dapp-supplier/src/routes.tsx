import { RouteObject } from 'react-router-dom';
import { MainLayout } from './layouts/Main.js';
import { HomePage } from './pages/HomePage.js';
import { SupplierSetupPage } from './pages/SupplierSetupPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { RootBoundary } from './components/ErrorBoundary.js';
import { AddAirplane } from './components/Airplanes/AddAirplane.js';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RootBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'supplier',
        element: <SupplierSetupPage />,
        children: [
          {
            path: 'setup',
            element: <SupplierSetupPage />,
            children: [
              {
                path: 'register',
                element: <SupplierSetupPage />,
              },
              {
                path: 'view',
                element: <SupplierSetupPage />,
              },
              {
                path: 'manage',
                element: <SupplierSetupPage />,
              },
              {
                path: 'node',
                element: <SupplierSetupPage />,
              },
              {
                path: 'ipfs',
                element: <SupplierSetupPage />,
              },
            ],
          },
        ],
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: 'airplanes',
        element: <AddAirplane />,
      },
    ],
  },
];

export const routesTitlesObj: Record<string, string> = {
  supplier: 'Supplier',
  'supplier/setup': 'Supplier Setup',
  'supplier/setup/register': 'Supplier Setup',
  'supplier/setup/view': 'Supplier Setup',
  'supplier/setup/manage': 'Supplier Setup',
  'supplier/access': 'Supplier Access',
  'supplier/deals': 'Deals',
  'supplier/config': 'Supplier Config',
};

export const menuTitlesObj: Record<string, string> = {
  '/': 'Home',
  'supplier/setup': 'Setup',
  auth: 'Users',
  airplanes: 'Airplanes',
};

export const routesTitles = Object.entries(routesTitlesObj);

export const menuTitles = Object.entries(menuTitlesObj);

export const getTitleByPath = (currentPath: string) =>
  routesTitlesObj[currentPath.replace(/^\//, '')] || 'Node Manager';
