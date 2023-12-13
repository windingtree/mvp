import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../layouts/Main.js';
import { HomePage } from '../pages/HomePage.js';
import { SupplierPage } from '../pages/SupplierPage.js';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'supplier',
        element: <SupplierPage />,
        children: [
          {
            path: 'setup',
            element: <SupplierPage />,
            children: [
              {
                path: 'register',
                element: <SupplierPage />,
              },
              {
                path: 'view',
                element: <SupplierPage />,
              },
              {
                path: 'manage',
                element: <SupplierPage />,
              },
            ],
          },
          {
            path: 'access',
            element: <SupplierPage />,
          },
          {
            path: 'deals',
            element: <SupplierPage />,
          },
          {
            path: 'config',
            element: <SupplierPage />,
          },
        ],
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
  supplier: 'Supplier',
};

export const routesTitles = Object.entries(routesTitlesObj);

export const menuTitles = Object.entries(menuTitlesObj);

export const getTitleByPath = (currentPath: string) =>
  routesTitlesObj[currentPath.replace(/^\//, '')] || 'Node Manager';
