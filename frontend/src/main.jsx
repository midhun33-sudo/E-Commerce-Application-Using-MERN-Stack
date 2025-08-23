import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import App from './App.jsx';
import Welcome from './pages/Welcome.jsx';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminProductForm from './pages/admin/AdminProductForm.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {/* default landing is Welcome */}
        <Route index element={<Welcome />} />
        <Route path="home" element={<Home />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin/products" element={<AdminProducts />} />
        <Route path="admin/products/new" element={<AdminProductForm />} />
        <Route path="admin/products/:id" element={<AdminProductForm />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
