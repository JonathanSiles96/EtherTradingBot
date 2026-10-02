import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const s = {
  page: { maxWidth: '600px', margin: '40px auto', padding: '0 16px' },
  title: { fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' },
  card: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '24px', marginBottom: '24px',
  },
  row: { display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  label: { fontSize: '0.8rem', color: 'var(--text-secondary)' },
  input: {
    padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
    borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', width: '100%',
  },
  select: {
    padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
    borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', width: '100%',
  },
  btn: {
    padding: '8px 20px', background: 'var(--accent)', color: '#fff',
    border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  alertItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '16px 20px',
  },
  alertInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  alertType: { fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 },
  alertPrice: { fontSize: '1.1rem', fontWeight: 600 },
  alertTime: { fontSize: '0.75rem', color: 'var(--text-secondary)' },
  triggered: { fontSize: '0.75rem', color: 'var(--success)', fontWeight: 500 },
  btnRemove: {
    padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)',
    color: 'var(--text-secondary)', borderRadius: '6px', fontSize: '0.8rem',
  },
  empty: { color: 'var(--text-secondary)', fontSize: '0.9rem' },
};

export default function Alerts() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [type, setType] = useState('above');
  const [targetPrice, setTargetPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    api.getAlerts().then(setAlerts).catch(() => {});
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!targetPrice || parseFloat(targetPrice) <= 0) return;
    setLoading(true);
    try {
      const alert = await api.createAlert(type, parseFloat(targetPrice));
      setAlerts([alert, ...alerts]);
      setTargetPrice('');
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (alertId) => {
    try {
      await api.removeAlert(alertId);
      setAlerts(alerts.filter((a) => a.id !== alertId));
    } catch {
      // silently fail
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Price Alerts</h1>

      <div style={s.card}>
        <form onSubmit={handleCreate}>
          <div style={s.row}>
            <div style={s.field}>
              <span style={s.label}>Condition</span>
              <select style={s.select} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="above">Price goes above</option>
                <option value="below">Price goes below</option>
              </select>
            </div>
            <div style={s.field}>
              <span style={s.label}>Target Price (USD)</span>
              <input style={s.input} type="number" step="0.01" min="0" placeholder="2500.00" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} required />
            </div>
            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Alert'}
            </button>
          </div>
        </form>
      </div>

      <div style={s.list}>
        {alerts.length === 0 ? (
          <p style={s.empty}>No alerts set. Create one above.</p>
        ) : (
          alerts.map((a) => (
            <div key={a.id} style={s.alertItem}>
              <div style={s.alertInfo}>
                <span style={{ ...s.alertType, color: a.type === 'above' ? 'var(--success)' : 'var(--danger)' }}>
                  {a.type === 'above' ? 'Above' : 'Below'}
                </span>
                <span style={s.alertPrice}>${a.targetPrice.toLocaleString()}</span>
                {a.triggered ? (
                  <span style={s.triggered}>Triggered at ${a.triggeredPrice?.toLocaleString()}</span>
                ) : (
                  <span style={s.alertTime}>Created {new Date(a.createdAt).toLocaleString()}</span>
                )}
              </div>
              <button style={s.btnRemove} onClick={() => handleRemove(a.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
