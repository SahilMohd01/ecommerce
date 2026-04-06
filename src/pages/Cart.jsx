import React from 'react';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const shipping = cart.length > 0 ? 15 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '5rem', maxWidth: '600px', margin: '0 auto' }}>
          <ShoppingBag size={80} style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
            It looks like you haven't added anything to your cart yet. Explore our products and find something you love.
          </p>
          <Link to="/products" className="btn-primary" style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Shopping Bag</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cart.map(item => (
            <div key={item.id} className="glass" style={{
              display: 'flex',
              padding: '1.5rem',
              gap: '1.5rem',
              alignItems: 'center'
            }}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px' }} 
              />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{item.category}</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '10px' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ color: 'var(--text-secondary)' }}><Minus size={16}/></button>
                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ color: 'var(--text-secondary)' }}><Plus size={16}/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444' }}><Trash2 size={18}/></button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  ${item.price} each
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="glass" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--glass-border)',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              <span>Total</span>
              <span className="gradient-text">${total.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/checkout" className="btn-primary" style={{
            width: '100%',
            padding: '1.2rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '1.1rem'
          }}>
            Proceed to Checkout <ArrowRight size={20} />
          </Link>

          <p style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            Prices include VAT where applicable. Free shipping on orders over $2000.
          </p>
        </div>
      </div>
    </div>
  );
}
