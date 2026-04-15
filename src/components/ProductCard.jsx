import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="glass glass-hover animate-fade-in card-shine" style={{ padding: '1rem', transition: 'var(--transition-smooth)' }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '15px' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: '100%', height: '220px', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
          className="product-image"
        />
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(3, 7, 18, 0.6)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Star size={14} color="var(--accent-secondary)" fill="var(--accent-secondary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>{product.rating}</span>
        </div>
      </div>

      <div style={{ marginTop: '1.2rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '0.4rem' }}>
          {product.category}
        </div>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{product.name}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', height: '3rem', overflow: 'hidden', marginBottom: '1.2rem' }}>
          {product.description}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
              ${(product.price * 1.2).toFixed(0)}
            </span>
            <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '900' }}>
              ${product.price}
            </span>
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="btn-primary" 
            style={{ width: '44px', height: '44px', borderRadius: '12px', padding: 0 }}
          >
            <ShoppingCart size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
