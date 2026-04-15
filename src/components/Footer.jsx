import React from 'react';
import { Mail, Phone, MapPin, Globe, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass" style={{ marginTop: '5rem', padding: '4rem 0 2rem 0', borderRadius: '40px 40px 0 0', borderBottom: 'none' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div>
            <h3 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Magic Cart</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Experience the pinnacle of digital commerce where luxury meets technology. Step into the future of curated shopping.
            </p>
            <div style={{ display: 'flex', gap: '1.2rem' }}>
              <Globe size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} className="glass-hover" />
              <Shield size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} className="glass-hover" />
              <Sparkles size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} className="glass-hover" />
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Curated Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)' }}>
              <a href="#" className="nav-link">About the Collection</a>
              <a href="#" className="nav-link">Privacy & Security</a>
              <a href="#" className="nav-link">Shipping Logistics</a>
              <a href="#" className="nav-link">Bespoke Support</a>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Concierge</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Mail size={18} /> hello@magiccart.io
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Phone size={18} /> +1 (888) MAGIC-01
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <MapPin size={18} /> Artisan District, NY
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '2rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          © 2026 Magic Cart Luxury. Powered by BehaviorShift Engine.
        </div>
      </div>
    </footer>
  );
}
