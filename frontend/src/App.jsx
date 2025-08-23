import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';

export default function App() {
  const { pathname } = useLocation();
  const authPage = pathname === '/login' || pathname === '/register';

  return (
    <div className="container">
      {!authPage && <Navbar />}   {/* hide on auth pages */}
      <Outlet />
    </div>
  );
}
