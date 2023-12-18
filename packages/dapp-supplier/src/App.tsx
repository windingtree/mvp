import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './config/routes.js';

/**
 * Main application component
 */
export const App = () => {
  return (
    <>
      <RouterProvider router={createBrowserRouter(routes)} />
    </>
  );
};
