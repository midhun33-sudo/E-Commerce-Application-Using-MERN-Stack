import React, { useEffect, useState } from 'react';
import { getProducts } from '../api';
import useCart from '../hooks/useCart';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [data, setData] = useState([]);
  const { add } = useCart();

  useEffect(() => { getProducts().then(setData); }, []);

  return (
    <>
      <h2>Latest products</h2>
      <div className="grid">
        {data.map((p) => (<ProductCard key={p._id} p={p} onAdd={add} />))}
      </div>
      {data.length === 0 && <small className="muted">No products yet.</small>}
    </>
  );
}
