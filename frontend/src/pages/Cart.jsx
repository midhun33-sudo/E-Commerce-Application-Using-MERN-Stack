import React from 'react';
import useCart from '../hooks/useCart';
import { createOrder } from '../api';

export default function Cart() {
  const { cart, remove, clear, total } = useCart();
  const token = localStorage.getItem('token');

  const checkout = async () => {
    if (!token) return alert('Login first');
    const items = cart.map(({ _id, name, price, qty, image }) => ({ product: _id, name, price, qty, image }));
    const res = await createOrder(token, { items, total, paymentMethod: 'COD' });
    if (res?._id) { alert('Order placed!'); clear(); } else { alert(res?.message || 'Failed'); }
  };

  return (
    <div>
      <h2>Cart</h2>
      {cart.length === 0 ? <p>No items.</p> : (
        <div>
          {cart.map((i) => (
            <div key={i._id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0' }}>
              <img src={i.image} alt={i.name} width={64} height={64} style={{ objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div>{i.name}</div>
                <small>₹{i.price} × {i.qty}</small>
              </div>
              <button onClick={() => remove(i._id)}>Remove</button>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Total: ₹{total}</strong>
            <button onClick={checkout}>Checkout (COD)</button>
          </div>
        </div>
      )}
    </div>
  );
}