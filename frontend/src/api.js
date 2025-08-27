// src/api.js
import axios from "axios";

// Base URL: strip trailing slash if present
const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");

// Create axios instance
export const api = axios.create({
  baseURL, // now always like: https://your-api.onrender.com
  // withCredentials: true, // uncomment if you use cookies
});

// ------------------------- Products -------------------------

export const getProducts = async () => {
  const res = await api.get("/api/products");
  return res.data;
};

export const getProduct = async (id) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};

// ------------------------- Auth -------------------------

export const register = async (payload) => {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await api.post("/api/auth/login", payload);
  return res.data;
};

// ------------------------- Orders -------------------------

export const createOrder = async (token, payload) => {
  const res = await api.post("/api/orders", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const myOrders = async (token) => {
  const res = await api.get("/api/orders/mine", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ------------------------- Products (admin) -------------------------

export const createProduct = async (token, payload) => {
  const res = await api.post("/api/products", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProduct = async (token, id, payload) => {
  const res = await api.put(`/api/products/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteProduct = async (token, id) => {
  const res = await api.delete(`/api/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ------------------------- Upload -------------------------

// src/api.js (keep axios instance from before)
export const uploadImage = async (token, file) => {
  const form = new FormData();
  form.append("image", file);

  const res = await api.post("/api/upload/image", form, {
    headers: { Authorization: `Bearer ${token}` }, // admin token required
  });

  return res.data; // { url, filename }
};
