import React from 'react';
import { Check, Star, Shield, Zap } from 'lucide-react';

export default function Plans() {
  const tiers = [
    {
      name: "Basic",
      price: "19",
      icon: <Zap size={24} />,
      features: ["Standard Support", "Free Shipping", "Basic Analytics", "1-Year Warranty"],
      recommended: false
    },
    {
      name: "Premium",
      price: "49",
      icon: <Star size={24} color="var(--accent-secondary)" />,
      features: ["24/7 Priority Support", "Next-Day Shipping", "Advanced Insights", "Lifetime Warranty", "Exclusive Early Access"],
      recommended: true
    },
    {
      name: "Elite",
      price: "99",
      icon: <Shield size={24} color="cyan" />,
      features: ["Dedicated Account Manager", "Same-Day Delivery", "Custom Solutions", "2-Day Return Window", "VIP Event Access"],
      recommended: false
    }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
      <header style={{ marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Choose Your Experience</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Select the Vortex membership tier that best fits your lifestyle and shopping needs.
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {tiers.map((tier, index) => (
          <div 
            key={index} 
            className="glass" 
            style={{ 
              padding: '3rem 2.5rem', 
              position: 'relative',
              border: tier.recommended ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
              transform: tier.recommended ? 'scale(1.05)' : 'none',
              zIndex: tier.recommended ? 1 : 0
            }}
          >
            {tier.recommended && (
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--accent-primary)',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}> Most Popular </div>
            )}
            
            <div style={{ marginBottom: '2rem', display: 'inline-block', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
              {tier.icon}
            </div>
            
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{tier.name}</h2>
            <div style={{ marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>${tier.price}</span>
              <span style={{ color: 'var(--text-secondary)' }}>/month</span>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {tier.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Check size={18} color="green" /> {f}
                </div>
              ))}
            </div>

            <button className={tier.recommended ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', padding: '1rem' }}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
