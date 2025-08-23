import React, { useState } from 'react';
import { login } from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await login(form);
      if (res?.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        location.href = '/';
      } else setErr(res?.message || 'Login failed');
    } catch (e) { setErr(e.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} style={{ display:'grid', gap:12, maxWidth:380 }}>
      <h2>Login</h2>
      {err && <small style={{ color:'#ef4444' }}>{err}</small>}
      <input className="input" placeholder="Email" type="email"
        value={form.email} onChange={(e)=>setForm({ ...form, email:e.target.value })} />
      <input className="input" placeholder="Password" type="password"
        value={form.password} onChange={(e)=>setForm({ ...form, password:e.target.value })} />
      <button className="btn primary" type="submit" disabled={loading}>
        {loading? 'Logging in…':'Login'}
      </button>
    </form>
  );
}
