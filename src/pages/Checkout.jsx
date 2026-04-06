import React, { useState, useEffect } from 'react';
import { ShoppingCart, Truck, CreditCard, CheckCircle, Smartphone, MapPin, Receipt, Star, Gift, Package, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const total = subtotal + 15 + (subtotal * 0.1);

  useEffect(() => {
    if (cart.length === 0 && !showModal) navigate('/cart');
  }, [cart, showModal, navigate]);

  const handleStepClick = (stepIndex) => {
    // Only allow clicking current step or completed steps
    if (stepIndex === completedSteps.length) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const fireFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleBuyNow = () => {
    if (completedSteps.length === 5) {
      setCompletedSteps([...completedSteps, 5]);
      setShowModal(true);
      fireFireworks();
      clearCart();
    }
  };

  const steps = [
    { label: "Add Address", icon: <MapPin size={20} /> },
    { label: "Checkout Summary", icon: <ShoppingCart size={20} /> },
    { label: "Order Details", icon: <Package size={20} /> },
    { label: "Payment Info", icon: <CreditCard size={20} /> },
    { label: "Payment Complete", icon: <Receipt size={20} /> },
    { label: "Buy Now", icon: <Gift size={20} /> }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>Secure Checkout</h1>

      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = completedSteps.length === index;
          const isLocked = index > completedSteps.length;
          const isBuyNow = index === 5;

          return (
            <button
              key={index}
              onClick={() => isBuyNow ? handleBuyNow() : handleStepClick(index)}
              disabled={isLocked || (isCompleted && !isBuyNow)}
              className="glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem 2rem',
                borderRadius: '20px',
                border: isCurrent ? '2px solid var(--accent-primary)' : isCompleted ? '2px solid #22c55e' : '1px solid var(--glass-border)',
                background: isCompleted ? 'rgba(34, 197, 94, 0.1)' : isCurrent ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255,255,255,0.05)',
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isCompleted ? '#22c55e' : isCurrent ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {isCompleted ? <CheckCircle size={20} /> : step.icon}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: isCompleted ? '#22c55e' : 'white' }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {isCompleted ? 'Step Confirmed' : isCurrent ? 'Active Step' : 'Pending Step'}
                  </div>
                </div>
              </div>

              {isCurrent && !isCompleted && (
                <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>Complete Now &rarr;</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="glass animate-fade-in" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '4rem 2rem',
            textAlign: 'center',
            position: 'relative',
            border: '2px solid var(--accent-primary)',
            boxShadow: '0 0 50px rgba(124, 58, 237, 0.4)'
          }}>
            <div style={{
              display: 'inline-flex',
              padding: '1.5rem',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '50%',
              marginBottom: '2rem',
              color: '#22c55e'
            }}>
              <Star size={60} />
            </div>
            
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Congratulations!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>
              Your futuristic order has been placed successfully. A confirmation email is heading to your inbox!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/" className="btn-primary" style={{ padding: '1.2rem' }}>
                Continue Shopping
              </Link>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>
                HTTP 200 OK — TRANSACTION SUCCESS
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Sidebar logic or small component can be added here if needed */}
    </div>
  );
}
