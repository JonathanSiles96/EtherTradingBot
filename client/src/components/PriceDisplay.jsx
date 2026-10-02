import { useState, useEffect } from 'react';
import { api } from '../api';

const styles = {
  wrapper: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginTop: '24px',
  },
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 28px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--success)',
    boxShadow: '0 0 6px var(--success)',
    animation: 'pulse 2s ease-in-out infinite',
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
  timestamp: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    opacity: 0.7,
  },
};

function timeAgo(isoString) {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export default function PriceDisplay() {
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const data = await api.getPrice();
        setPrice(data.price);
        setChange(data.change24h);
        setTimestamp(data.timestamp);
      } catch {
        // silently fail
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(tick);
  }, []);

  if (!price) return null;

  const changeColor = change >= 0 ? 'var(--success)' : 'var(--danger)';
  const changeSign = change >= 0 ? '+' : '';

  return (
    <div style={styles.wrapper}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      <div style={styles.container}>
        <div style={styles.liveDot} />
        <span style={styles.label}>ETH/USD</span>
        <span style={styles.price}>
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        {change !== null && (
          <span style={{ ...styles.change, color: changeColor }}>
            {changeSign}{change.toFixed(2)}%
          </span>
        )}
      </div>
      {timestamp && (
        <span style={styles.timestamp}>
          Scanner updated {timeAgo(timestamp)}
        </span>
      )}
    </div>
  );
}
