
import { useState } from 'react';
import './Glass-products.css';

const glassProducts = [
  { id: 1, name: 'Euro Bronze', color: '#A99A8A', price: 'Request a quote' },
  { id: 2, name: 'Golden Bronze', color: '#C7A36D', price: 'Request a quote' },
  { id: 3, name: 'Black', color: '#343B3E', price: 'Request a quote' },
  { id: 4, name: 'Euro Grey', color: '#A8A8A8', price: 'Request a quote' },
  { id: 5, name: 'Dark Grey', color: '#596168', price: 'Request a quote' },
  { id: 6, name: 'Blue Grey', color: '#9AAFC2', price: 'Request a quote' },
  { id: 7, name: 'Ford Blue', color: '#86C5EE', price: 'Request a quote' },
  { id: 8, name: 'Dark Blue', color: '#0755C5', price: 'Request a quote' },
  { id: 9, name: 'Ultra Clear', color: '#EAF4F3', price: 'Request a quote' },
  { id: 10, name: 'Clear', color: '#DCE8E8', price: 'Request a quote' },
  { id: 11, name: 'Dark Green', color: '#5FAF92', price: 'Request a quote' },
  { id: 12, name: 'F-Green', color: '#A4DCC7', price: 'Request a quote' },
];

export default function GlassProducts() {
  const [search, setSearch] = useState('');

  const filteredProducts = glassProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="glass-page">
      <div className="glass-heading">
        <div>
          <p className="glass-label">FLOR GLASS & ALUMINUM</p>
          <h1>Glass Products</h1>
          <p>Choose your preferred glass tint and color.</p>
        </div>
        <span className="glass-total">
          {filteredProducts.length} Products
        </span>
      </div>

      <div className="glass-toolbar">
        <input
          type="search"
          placeholder="Search glass color..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="glass-grid">
        {filteredProducts.map((product) => (
          <article className="glass-card" key={product.id}>
            <div className="glass-preview">
              <div
                className="glass-sample"
                style={{ '--glass-color': product.color }}
              >
                <span className="glass-reflection" />
                <span className="glass-holder" />
              </div>
            </div>

            <div className="glass-info">
              <span className="glass-category">GLASS</span>
              <h2>{product.name}</h2>
              <p>{product.price}</p>
              <button
                type="button"
                onClick={() =>
                  window.alert(
                    `${product.name}\nPlease contact us for a quotation.`
                  )
                }
              >
                View Product
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="glass-empty">No glass products found.</p>
      )}
    </main>
  );
}
