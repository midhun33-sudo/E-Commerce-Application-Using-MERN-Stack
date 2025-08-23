const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const getProducts = async () => (await fetch(`${API}/api/products`)).json();
export const getProduct = async (id) => (await fetch(`${API}/api/products/${id}`)).json();

export const register = async (payload) => (await fetch(`${API}/api/auth/register`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
})).json();

export const login = async (payload) => (await fetch(`${API}/api/auth/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
})).json();

export const createOrder = async (token, payload) => (await fetch(`${API}/api/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify(payload)
})).json();

export const myOrders = async (token) => (await fetch(`${API}/api/orders/mine`, {
  headers: { Authorization: `Bearer ${token}` }
})).json();

export const createProduct = async (token, payload) =>
  (await fetch(`${API}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  })).json();

export const updateProduct = async (token, id, payload) =>
  (await fetch(`${API}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  })).json();

export const deleteProduct = async (token, id) =>
  (await fetch(`${API}/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })).json();

export const uploadImage = async (token, file) => {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API}/api/upload/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }, // do NOT set Content-Type
    body: form
  });
  return res.json();
};