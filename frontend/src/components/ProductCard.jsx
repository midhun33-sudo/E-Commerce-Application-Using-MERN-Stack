import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ p, onAdd }) {
  return (
    <div className="card">
      <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src={p.image} alt={p.name} />
        <h3>{p.name}</h3>
      </Link>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span className="price">₹{p.price}</span>
        <button className="btn primary" onClick={() => onAdd(p)}>Add</button>
      </div>
    </div>
  );
}
