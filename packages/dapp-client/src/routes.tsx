import { RouteObject } from 'react-router-dom';
import { MainLayout } from './layouts/Main.js';
import { HomePage } from './pages/HomePage.js';
import { RootBoundary } from './components/ErrorBoundary.js';
import { SearchPage } from './pages/SearchPage.js';
import { OfferPage } from './pages/OfferPage.js';
import { BookingsPage } from './pages/BookingsPage.js';
import { DetailsPage } from './pages/DetailsPage.js';

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
      {
        path: 'offer',
        element: <OfferPage />,
      },
      {
        path: 'bookings',
        element: <BookingsPage />,
      },
      {
        path: 'details',
        element: <DetailsPage />,
      },
    ],
  },
];

export const routesTitlesObj: Record<string, string> = {
  '': 'Book Your Flight',
  search: 'Search Airplane',
  offer: 'Book Offer',
  bookings: 'My Bookings',
  details: 'My Booking',
};

export const menuTitlesObj: Record<string, string> = {
  '/': 'Home',
  '/bookings': 'Bookings',
};

export const routesTitles = Object.entries(routesTitlesObj);

export const menuTitles = Object.entries(menuTitlesObj);

export const getTitleByPath = (currentPath: string) =>
  routesTitlesObj[currentPath.replace(/^\//, '')] || 'Protocol Client';
