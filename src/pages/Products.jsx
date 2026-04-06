import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 2rem' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Our Collection</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Explore our range of meticulously designed products across multiple categories.
        </p>

        {/* Search and Filter */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div className="glass" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.8rem 1.5rem',
            gap: '1rem',
            minWidth: '350px'
          }}>
            <Search size={20} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                width: '100%',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'btn-primary' : 'glass'}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  border: selectedCategory === cat ? 'none' : '1px solid var(--glass-border)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2.5rem'
      }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))
        ) : (
          <div className="glass" style={{ gridColumn: '1 / -1', padding: '5rem', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-secondary)' }}>No products found matching your criteria.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
