import { RouteObject } from 'react-router-dom';
import { MainLayout } from './layouts/Main.js';
import { HomePage } from './pages/HomePage.js';
import { RootBoundary } from './components/ErrorBoundary.js';
import { SearchPage } from './pages/SearchPage.js';

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
        path: 'search',
        element: <SearchPage />,
      },
    ],
  },
];

export const routesTitlesObj: Record<string, string> = {
  '': 'Book Your Flight',
  search: 'Search Airplane',
};

export const menuTitlesObj: Record<string, string> = {
  '/': 'Home',
};

export const routesTitles = Object.entries(routesTitlesObj);

export const menuTitles = Object.entries(menuTitlesObj);

export const getTitleByPath = (currentPath: string) =>
  routesTitlesObj[currentPath.replace(/^\//, '')] || 'Protocol Client';
