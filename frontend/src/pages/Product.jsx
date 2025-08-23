import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../api';
import useCart from '../hooks/useCart';

export default function Product() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const { add } = useCart();

  useEffect(() => { getProduct(id).then(setP); }, [id]);
  if (!p) return <p>Loading…</p>;

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
      <img src={p.image} alt={p.name} style={{ width:'100%', borderRadius:14 }} />
      <div className="card" style={{ height:'fit-content' }}>
        <h1>{p.name}</h1>
        <p className="muted">{p.brand} · {p.category}</p>
        <p>{p.description}</p>
        <p className="price">₹{p.price}</p>
        <button className="btn primary" onClick={() => add(p)}>Add to Cart</button>
      </div>
    </div>
  );
}
