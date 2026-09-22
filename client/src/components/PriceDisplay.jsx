import { useState, useEffect } from 'react';
import { api } from '../api';

const styles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    marginTop: '24px',
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  change: {
    fontSize: '0.85rem',
    fontWeight: 500,
  },
};

export default function PriceDisplay() {
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const data = await api.getPrice();
        setPrice(data.price);
        setChange(data.change24h);
      } catch {
        // silently fail
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!price) return null;

  const changeColor = change >= 0 ? 'var(--success)' : 'var(--danger)';
  const changeSign = change >= 0 ? '+' : '';

  return (
    <div style={styles.container}>
      <span style={styles.label}>ETH/USD</span>
      <span style={styles.price}>${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      {change !== null && (
        <span style={{ ...styles.change, color: changeColor }}>
          {changeSign}{change.toFixed(2)}%
        </span>
      )}
    </div>
  );
}
