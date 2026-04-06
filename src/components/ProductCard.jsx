import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="glass animate-fade-in" style={{ padding: '1rem', transition: 'var(--transition-smooth)' }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} 
        />
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Star size={14} color="gold" fill="gold" />
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{product.rating}</span>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{product.name}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', height: '3rem', overflow: 'hidden', marginBottom: '1rem' }}>
          {product.description}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="gradient-text" style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
            ${product.price}
          </span>
          <button 
            onClick={() => addToCart(product)}
            className="btn-primary" 
            style={{ padding: '0.6rem', borderRadius: '10px', display: 'flex', alignItems: 'center' }}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
