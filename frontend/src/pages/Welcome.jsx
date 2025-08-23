import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';

export default function Welcome() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const [featured, setFeatured] = useState([]);
  useEffect(() => {
    getProducts().then((all) => setFeatured((all || []).slice(0, 4)));
  }, []);

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <h1>Find your next favorite thing.</h1>
          <p className="muted">
            Quality products, smooth checkout, and a clean shopping experience.
          </p>

          <div className="hero-actions">
            <Link className="btn primary" to="/home">Start shopping</Link>
            {!token ? (
              <>
                <Link className="btn" to="/login">Login</Link>
                <Link className="btn" to="/register">Register</Link>
              </>
            ) : (
              <span className="badge">👋 Hi, {user?.name}</span>
            )}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="grid highlights">
        <Feature icon="🚚" title="Fast shipping" text="Across India with reliable carriers." />
        <Feature icon="🛡️" title="Secure checkout" text="Your data stays safe with us." />
        <Feature icon="↩️" title="Easy returns" text="7‑day hassle‑free returns." />
      </section>

      {/* FEATURED PRODUCTS */}
      <section>
        <div className="section-head">
          <h2>Featured products</h2>
          <Link className="btn" to="/home">View all</Link>
        </div>
        <div className="grid">
          {featured.map((p) => <ProductCard key={p._id} p={p} onAdd={() => {}} />)}
          {featured.length === 0 && <small className="muted">Nothing featured yet.</small>}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="card" style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="avatar">★</div>
          <div>
            <strong>Customers love it</strong>
            <p className="muted" style={{ margin: 0 }}>
              “Sleek UI, fast delivery, and checkout was a breeze. I’ll be back!”
            </p>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="cta-strip">
        <div className="cta-inner">
          <h3>Ready to explore the catalog?</h3>
          <Link className="btn primary" to="/home">Browse products</Link>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="card feature">
      <div className="feature-icon">{icon}</div>
      <div>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <small className="muted">{text}</small>
      </div>
    </div>
  );
}
