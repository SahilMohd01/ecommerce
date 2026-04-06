import React from 'react';
import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export default function Home() {
  const featured = products.slice(0, 3);

  return (
    <div className="container animate-fade-in">
      {/* Hero Section */}
      <section style={{
        padding: '5rem 0',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, transparent 70%)'
      }}>
        <div className="glass" style={{
          padding: '0.4rem 1.2rem',
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          marginBottom: '2rem'
        }}>
          <Sparkles size={16} color="var(--accent-secondary)" />
          <span>New Experience in E-Commerce</span>
        </div>
        
        <h1 style={{ fontSize: '4rem', lineHeight: '1.1', marginBottom: '2rem' }}>
          Step Into the <br />
          <span className="gradient-text">Future of Shopping</span>
        </h1>
        
        <p style={{
          maxWidth: '600px',
          color: 'var(--text-secondary)',
          fontSize: '1.2rem',
          marginBottom: '3rem'
        }}>
          Discover a curated collection of premium products, designed for those who refuse to settle for anything but excellence.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/products" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
            Shop Collection
          </Link>
          <Link to="/plans" className="btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
            View Plans
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        padding: '5rem 0'
      }}>
        {[
          { icon: <Zap color="cyan" />, title: "Ultra Fast Delivery", desc: "Get your items within 24 hours of ordering." },
          { icon: <Shield color="green" />, title: "Secure Checkout", desc: "Enterprise-grade encryption for all payments." },
          { icon: <TrendingUp color="orange" />, title: "Market Trends", desc: "Only the latest and most sought-after products." }
        ].map((f, i) => (
          <div key={i} className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
              {f.icon}
            </div>
            <h3 style={{ marginBottom: '1rem' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section style={{ padding: '5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Featured Arrivals</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Handpicked selection from our diverse catalog.</p>
          </div>
          <Link to="/products" className="gradient-text" style={{ fontWeight: 'bold' }}>View All Products &rarr;</Link>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
