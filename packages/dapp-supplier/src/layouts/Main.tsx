import { Outlet } from 'react-router-dom';
import { Header } from '../layouts/Header.js';

export const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
