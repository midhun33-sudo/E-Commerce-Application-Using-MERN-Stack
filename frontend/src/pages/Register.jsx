import React, { useState } from 'react';
import { register } from '../api';
// styles are already imported once in main.jsx via: import './styles.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    // tiny client-side check (optional)
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setErr('Name, email, and password are required'); 
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      };
      const res = await register(payload);
      if (res?.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user)); // includes isAdmin from server (default false)
        location.href = '/';
      } else {
        setErr(res?.message || 'Registration failed');
      }
    } catch (e) {
      setErr(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 380 }}>
      <h2>Create account</h2>
      {err && <small style={{ color: '#ef4444' }}>{err}</small>}

      <input
        className="input"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="input"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="input"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="btn primary" type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Register'}
      </button>
    </form>
  );
}
