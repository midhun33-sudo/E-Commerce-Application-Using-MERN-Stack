import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, updateProduct } from '../../api';

const PAGE_SIZE = 8;

export default function AdminProducts() {
  const [raw, setRaw] = useState([]);          // original data
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');              // search term
  const [sortBy, setSortBy] = useState('name'); // name | price | stock
  const [dir, setDir] = useState('asc');        // asc | desc
  const [page, setPage] = useState(1);          // pagination
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    if (!user?.isAdmin) return (window.location.href = '/'); // guard
    getProducts().then((d) => { setRaw(d || []); setLoading(false); });
  }, []);

  // debounced search
  const [search, setSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setSearch(q.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [q]);

  const filtered = useMemo(() => {
    let d = [...raw];
    if (search) {
      d = d.filter(p =>
        (p.name || '').toLowerCase().includes(search) ||
        (p.category || '').toLowerCase().includes(search) ||
        (p.brand || '').toLowerCase().includes(search)
      );
    }
    d.sort((a, b) => {
      const get = (key, item) => {
        if (key === 'stock') return Number(item.countInStock || 0);
        if (key === 'price') return Number(item.price || 0);
        return String(item.name || '').toLowerCase();
      };
      const va = get(sortBy, a), vb = get(sortBy, b);
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return d;
  }, [raw, search, sortBy, dir]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, sortBy, dir]); // reset page when filters change

  const onDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    const res = await deleteProduct(token, id);
    if (res?.ok) setRaw((p) => p.filter((x) => x._id !== id));
    else alert(res?.message || 'Failed to delete');
  };

  const onQuickStock = async (id, nextStock) => {
    const n = Number(nextStock);
    if (Number.isNaN(n) || n < 0) return;
    // optimistic UI
    setRaw((p) => p.map(x => x._id === id ? { ...x, countInStock: n } : x));
    const res = await updateProduct(token, id, { countInStock: n });
    if (!res?._id) alert(res?.message || 'Stock update failed');
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display:'grid', gap:12, marginBottom: 8 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <h2 style={{ margin:0 }}>Admin – Products</h2>
          <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
            <Link to="/admin/products/new"><button className="btn primary">Create Product</button></Link>
          </div>
        </div>

        {/* controls */}
        <div style={{ display:'grid', gap:10, gridTemplateColumns:'1fr 180px 140px' }}>
          <input
            className="input"
            placeholder="Search by name, brand, category…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <select className="select" value={`${sortBy}:${dir}`} onChange={(e)=>{
            const [s, d] = e.target.value.split(':');
            setSortBy(s); setDir(d);
          }}>
            <option value="name:asc">Name ↑</option>
            <option value="name:desc">Name ↓</option>
            <option value="price:asc">Price ↑</option>
            <option value="price:desc">Price ↓</option>
            <option value="stock:asc">Stock ↑</option>
            <option value="stock:desc">Stock ↓</option>
          </select>
          <div style={{ display:'flex', gap:6, alignItems:'center', justifyContent:'flex-end' }}>
            <small className="muted">Page {page}/{pages}</small>
            <button className="btn" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
            <button className="btn" disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>Next</button>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th align="left" style={{ width: 64 }}>Image</th>
              <th align="left">Name</th>
              <th align="left">Category</th>
              <th align="left">Brand</th>
              <th align="right">Price</th>
              <th align="center">Stock</th>
              <th align="center" style={{ width: 200 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: 14 }}><small className="muted">Loading…</small></td></tr>
            ) : pageData.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: 14 }}><small className="muted">No products found.</small></td></tr>
            ) : (
              pageData.map(p => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image || 'https://placehold.co/64x48?text=—'}
                      alt={p.name}
                      style={{ width:54, height:42, objectFit:'cover', borderRadius:8, border:'1px solid var(--border)' }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.brand}</td>
                  <td align="right">₹{Number(p.price || 0).toLocaleString('en-IN')}</td>
                  <td align="center">
                    <input
                      className="input"
                      type="number" min="0"
                      value={p.countInStock ?? 0}
                      onChange={(e)=>onQuickStock(p._id, e.target.value)}
                      style={{ width: 90, padding: 6, textAlign:'center' }}
                      title="Edit stock"
                    />
                  </td>
                  <td align="center">
                    <div className="actions" style={{ justifyContent:'center' }}>
                      <Link to={`/admin/products/${p._id}`}><button className="btn">Edit</button></Link>
                      <button className="btn danger" onClick={() => onDelete(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
