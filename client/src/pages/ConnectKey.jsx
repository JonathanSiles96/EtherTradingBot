import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const styles = {
  container: {
    maxWidth: '480px',
    margin: '60px auto',
    padding: '0 16px',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '40px 32px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    marginBottom: '32px',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    marginBottom: '6px',
    color: 'var(--text-secondary)',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius)',
    fontSize: '1rem',
    fontWeight: 600,
    marginTop: '8px',
  },
  note: {
    marginTop: '20px',
    padding: '12px 16px',
    background: 'rgba(123, 63, 228, 0.1)',
    borderRadius: '6px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    border: '1px solid rgba(123, 63, 228, 0.2)',
  },
  status: {
    marginTop: '20px',
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 500,
    textAlign: 'center',
  },
  success: {
    background: 'rgba(46, 204, 113, 0.1)',
    color: 'var(--success)',
    border: '1px solid rgba(46, 204, 113, 0.3)',
  },
  error: {
    background: 'rgba(231, 76, 60, 0.1)',
    color: 'var(--danger)',
    border: '1px solid rgba(231, 76, 60, 0.3)',
  },
};

export default function ConnectKey() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState('binance');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      api.getKeyStatus()
        .then((data) => setStatus(data.connected ? 'connected' : null))
        .catch(() => {});
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api.saveKey(exchange, apiKey, apiSecret);
      setStatus('connected');
      setApiKey('');
      setApiSecret('');
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Connect API Key</h1>
        <p style={styles.subtitle}>Link your exchange account to enable automated trading.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Exchange</label>
            <select
              style={styles.select}
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
            >
              <option value="binance">Binance</option>
              <option value="coinbase">Coinbase</option>
              <option value="kraken">Kraken</option>
              <option value="bybit">Bybit</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>API Key</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>API Secret</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your API secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              required
            />
          </div>

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Connect'}
          </button>
        </form>

        {status === 'connected' && (
          <div style={{ ...styles.status, ...styles.success }}>
            Connected
          </div>
        )}
        {status === 'error' && (
          <div style={{ ...styles.status, ...styles.error }}>
            Not connected — please check your keys
          </div>
        )}

        <div style={styles.note}>
          Use trade-only API keys. Do not enable withdrawal permission.
        </div>
      </div>
    </div>
  );
}
