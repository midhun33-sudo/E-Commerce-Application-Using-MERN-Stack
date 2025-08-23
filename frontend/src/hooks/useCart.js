import { useEffect, useMemo, useState } from 'react';

export default function useCart() {
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  }, []);

  const key = useMemo(() => `cart_${user?.id || 'guest'}`, [user?.id]);

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, key]);

  const add = (p, qty = 1) => {
    setCart((c) => {
      const i = c.findIndex((x) => x._id === p._id);
      if (i >= 0) { const copy = [...c]; copy[i].qty += qty; return copy; }
      return [...c, { ...p, qty }];
    });
  };

  const remove = (id) => setCart((c) => c.filter((x) => x._id !== id));
  const clear = () => setCart([]);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return { cart, add, remove, clear, total };
}
