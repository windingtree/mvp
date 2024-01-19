import { RouteObject } from 'react-router-dom';
import { MainLayout } from './layouts/Main.js';
import { HomePage } from './pages/HomePage.js';
import { RootBoundary } from './components/ErrorBoundary.js';

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
    ],
  },
];

export const routesTitlesObj: Record<string, string> = {
  // supplier: 'Supplier',
  // 'supplier/setup': 'Supplier Setup',
  // 'supplier/setup/register': 'Supplier Setup',
  // 'supplier/setup/view': 'Supplier Setup',
  // 'supplier/setup/manage': 'Supplier Setup',
  // 'supplier/access': 'Supplier Access',
  // 'supplier/deals': 'Deals',
  // 'supplier/config': 'Supplier Config',
  // airplanes: 'Airplanes Management',
};

export const menuTitlesObj: Record<string, string> = {
  '/': 'Home',
};

export const routesTitles = Object.entries(routesTitlesObj);

export const menuTitles = Object.entries(menuTitlesObj);

export const getTitleByPath = (currentPath: string) =>
  routesTitlesObj[currentPath.replace(/^\//, '')] || 'Protocol Client';
