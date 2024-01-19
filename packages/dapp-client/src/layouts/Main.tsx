import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header.js';

export const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
