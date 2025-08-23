import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const { pathname } = useLocation();

  // Hide navbar on auth pages if you want a cleaner look:
  const authPage = pathname === '/login' || pathname === '/register';
  if (authPage) return null;

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.href = '/';
  };

  return (
    <nav className="nav">
      <Link to="/home"><strong>🏠 Home</strong></Link>
      <Link to="/cart" className="nav-link">🛒</Link>

      {user?.isAdmin && <Link to="/admin/products">Admin Products</Link>}
      <div className="spacer" />
      {token ? (
        <>
          <small className="muted">Hi, {user?.name}</small>
          <button className="btn" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link className="btn" to="/login">Login</Link>
          <Link className="btn primary" to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
