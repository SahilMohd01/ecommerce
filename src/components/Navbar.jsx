import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LayoutGrid, Home, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="glass sticky top-0 z-50 margin-1rem" style={{ margin: '1rem', padding: '0.8rem 2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="brand-font" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px' }}></div>
          <span className="gradient-text">VORTEX</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Home size={18} /> Home
          </Link>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <LayoutGrid size={18} /> Products
          </Link>
          <Link to="/plans" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CreditCard size={18} /> Plans
          </Link>
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--accent-secondary)',
                color: 'var(--bg-color)',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '50%'
              }}>
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
