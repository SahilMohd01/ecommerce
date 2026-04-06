import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass" style={{ marginTop: '5rem', padding: '4rem 0 2rem 0', borderRadius: '40px 40px 0 0' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div>
            <h3 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>VORTEX</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Redefining the future of digital commerce with cutting-edge technology and premium aesthetics.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Globe size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
              <Globe size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
              <Globe size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)' }}>
              <a href="#">About Us</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Support Center</a>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Mail size={18} /> contact@vortex.tech
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Phone size={18} /> +1 (555) 000-VORTEX
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <MapPin size={18} /> Silicon Valley, CA
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
          © 2026 VORTEX Digital. All rights reserved. Built with passion for excellence.
        </div>
      </div>
    </footer>
  );
}
