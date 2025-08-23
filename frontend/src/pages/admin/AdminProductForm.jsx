import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, createProduct, updateProduct, uploadImage } from '../../api';

const EMPTY = {
  name: '',
  price: 0,
  description: '',
  image: '',
  countInStock: 0,
  brand: '',
  category: 'general',
};

// Small helper component for file upload
function UploadField({ token, onDone }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr('');
    if (!file.type.startsWith('image/')) return setErr('Please select an image file');
    if (file.size > 5 * 1024 * 1024) return setErr('Max size is 5MB');

    setBusy(true);
    try {
      const res = await uploadImage(token, file);
      if (res?.url) onDone(res.url);
      else setErr(res?.message || 'Upload failed');
    } catch (er) {
      setErr(er.message || 'Upload failed');
    } finally {
      setBusy(false);
      e.target.value = ''; // reset input so same file can be re-picked if needed
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onPick} disabled={busy} className="input" />
      {busy && <small className="muted">Uploading…</small>}
      {err && <small style={{ color: 'var(--danger)' }}>{err}</small>}
    </div>
  );
}

export default function AdminProductForm() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const { id } = useParams(); // if present -> edit mode
  const nav = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!!id);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) return (window.location.href = '/'); // guard
    if (id) {
      getProduct(id).then((p) => {
        if (!p?._id) setErr('Not found');
        setForm({ ...EMPTY, ...p });
        setLoading(false);
      });
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!form.name?.trim() || form.price === '' || form.price == null) {
      return setErr('Name and price are required');
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description || '',
      image: form.image || '',
      countInStock: Number(form.countInStock || 0),
      brand: form.brand || '',
      category: form.category || 'general',
    };

    const res = id
      ? await updateProduct(token, id, payload)
      : await createProduct(token, payload);

    if (res?._id || res?.ok) nav('/admin/products');
    else setErr(res?.message || 'Save failed');
  };

  if (!user?.isAdmin) return null;
  if (loading) return <p>Loading…</p>;

  return (
    <div className="card" style={{ padding: 20, maxWidth: 720 }}>
      <h2 style={{ marginBottom: 6 }}>{id ? 'Edit' : 'Create'} Product</h2>
      <small className="muted">Fill in the details and click {id ? 'Update' : 'Create'}.</small>

      <form onSubmit={submit} style={{ display: 'grid', gap: 12, marginTop: 14 }}>
        {err && <small style={{ color: 'var(--danger)' }}>{err}</small>}

        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input
            className="input"
            placeholder="Price"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="input"
            placeholder="Count in stock"
            type="number"
            min="0"
            value={form.countInStock}
            onChange={(e) => setForm({ ...form, countInStock: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input
            className="input"
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />
          <input
            className="input"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>

        {/* Image upload + preview */}
        <div className="card" style={{ padding: 12 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Product Image</label>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <img
              src={form.image || 'https://placehold.co/160x120?text=Preview'}
              alt="preview"
              style={{
                width: 160,
                height: 120,
                objectFit: 'cover',
                borderRadius: 10,
                border: '1px solid var(--border)',
              }}
            />
            <small className="muted">JPG/PNG up to 5MB.</small>
          </div>

          <UploadField token={token} onDone={(url) => setForm({ ...form, image: url })} />

          {/* Optional: allow direct URL paste */}
          <input
            className="input"
            placeholder="Or paste Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            style={{ marginTop: 10 }}
          />
        </div>

        <textarea
          className="textarea"
          placeholder="Description"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button className="btn primary" type="submit">
            {id ? 'Update' : 'Create'}
          </button>
          <button className="btn" type="button" onClick={() => nav(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
