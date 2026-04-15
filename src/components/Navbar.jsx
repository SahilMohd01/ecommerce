import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LayoutGrid, Home, CreditCard, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ position: 'sticky', top: '0', zIndex: 100, padding: '1rem' }}>
      <nav className="glass" style={{ padding: '0.8rem 2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
          <Link to="/" className="brand-font" style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--accent-primary), #6d28d9)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} color="white" />
              </div>
            </div>
            <span className="gradient-text">Magic Cart</span>
          </Link>
          
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', fontWeight: '500' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="nav-link">
              <Home size={18} className="text-secondary" /> Home
            </Link>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="nav-link">
              <LayoutGrid size={18} className="text-secondary" /> Products
            </Link>
            <Link to="/plans" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="nav-link">
              <CreditCard size={18} className="text-secondary" /> Plans
            </Link>
            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }} className="btn-primary" style={{ padding: '0.6rem 1rem', borderRadius: '12px' }}>
              <ShoppingCart size={20} />
              <span>Cart</span>
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--accent-secondary)',
                  color: '#000',
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: '2px solid var(--bg-color)'
                }}>
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
