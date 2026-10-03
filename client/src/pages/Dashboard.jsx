import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const s = {
  page: { maxWidth: '900px', margin: '40px auto', padding: '0 16px' },
  title: { fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' },
  card: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '24px',
  },
  cardTitle: { fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cardValue: { fontSize: '1.5rem', fontWeight: 700 },
  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px' },
  row: { display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '0.8rem', color: 'var(--text-secondary)' },
  input: {
    padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)',
    borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem', width: '140px', outline: 'none',
  },
  btnBuy: {
    padding: '8px 20px', background: 'var(--success)', color: '#fff',
    border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem',
  },
  btnSell: {
    padding: '8px 20px', background: 'var(--danger)', color: '#fff',
    border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem',
  },
  msg: { marginTop: '12px', fontSize: '0.85rem', padding: '8px 12px', borderRadius: '6px' },
  msgOk: { background: 'rgba(46, 204, 113, 0.1)', color: 'var(--success)', border: '1px solid rgba(46, 204, 113, 0.3)' },
  msgErr: { background: 'rgba(231, 76, 60, 0.1)', color: 'var(--danger)', border: '1px solid rgba(231, 76, 60, 0.3)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 500 },
  td: { padding: '8px 12px', borderBottom: '1px solid var(--border)' },
  btnSmall: {
    padding: '4px 12px', background: 'transparent', border: '1px solid var(--danger)',
    color: 'var(--danger)', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer',
  },
  empty: { color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '16px 0' },
  walletRow: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' },
  walletInput: {
    flex: 1, minWidth: '240px', padding: '8px 12px', background: 'var(--bg-primary)',
    border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)',
    fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace',
  },
  walletBtn: {
    padding: '8px 16px', background: 'var(--accent)', color: '#fff',
    border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap',
  },
  txHash: {
    fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--accent-light)',
    maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block',
  },
  txAddr: {
    fontFamily: 'monospace', fontSize: '0.78rem', maxWidth: '110px',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block',
  },
};

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('walletAddress') || '0x1251B81aB3F2DF2FF60358aa80dEa8e7858Bf9C1');
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    api.getStats().then(setStats).catch(() => {});
    api.getBalance().then(setBalance).catch(() => {});
    api.getOrders().then(setOrders).catch(() => {});
    if (walletAddress && /^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
      loadTransactions(walletAddress);
    }
  }, [token]);

  const loadTransactions = async (addr) => {
    setTxLoading(true);
    try {
      const data = await api.getTransactions(addr, 1);
      setTransactions(data.transactions.slice(0, 10));
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  };

  const handleWalletSave = () => {
    const trimmed = walletAddress.trim();
    if (!/^0x[0-9a-fA-F]{40}$/.test(trimmed)) return;
    localStorage.setItem('walletAddress', trimmed);
    loadTransactions(trimmed);
  };

  const handleTrade = async (side) => {
    if (!amount || parseFloat(amount) <= 0) {
      setMsg({ type: 'err', text: 'Enter a valid amount' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const fn = side === 'buy' ? api.placeBuy : api.placeSell;
      await fn(parseFloat(amount), price ? parseFloat(price) : undefined);
      setMsg({ type: 'ok', text: `${side === 'buy' ? 'Buy' : 'Sell'} order placed` });
      setAmount('');
      setPrice('');
      api.getBalance().then(setBalance).catch(() => {});
      api.getOrders().then(setOrders).catch(() => {});
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await api.cancelOrder(orderId);
      setOrders(orders.filter((o) => o.id !== orderId));
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>Dashboard</h1>

      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.cardTitle}>ETH Balance</div>
          <div style={s.cardValue}>{balance ? balance.ETH.toFixed(6) : '—'}</div>
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>USDT Balance</div>
          <div style={s.cardValue}>{balance ? balance.USDT.toFixed(2) : '—'}</div>
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Session High / Low</div>
          <div style={s.cardValue}>
            {stats ? `$${stats.high.toLocaleString()} / $${stats.low.toLocaleString()}` : '—'}
          </div>
        </div>
      </div>

      <div style={s.section}>
        <h2 style={s.sectionTitle}>Place Order</h2>
        <div style={s.row}>
          <div style={s.field}>
            <span style={s.label}>Amount (ETH)</span>
            <input style={s.input} type="number" step="0.001" min="0" placeholder="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div style={s.field}>
            <span style={s.label}>Price (USDT, blank = market)</span>
            <input style={s.input} type="number" step="0.01" min="0" placeholder="Market" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <button style={s.btnBuy} onClick={() => handleTrade('buy')} disabled={loading}>Buy</button>
          <button style={s.btnSell} onClick={() => handleTrade('sell')} disabled={loading}>Sell</button>
        </div>
        {msg && <div style={{ ...s.msg, ...(msg.type === 'ok' ? s.msgOk : s.msgErr) }}>{msg.text}</div>}
      </div>

      <div style={s.section}>
        <h2 style={s.sectionTitle}>Open Orders</h2>
        {orders.length === 0 ? (
          <p style={s.empty}>No open orders</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Side</th>
                <th style={s.th}>Amount</th>
                <th style={s.th}>Price</th>
                <th style={s.th}>Status</th>
                <th style={s.th}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ ...s.td, color: o.side === 'buy' ? 'var(--success)' : 'var(--danger)' }}>{o.side?.toUpperCase()}</td>
                  <td style={s.td}>{o.amount}</td>
                  <td style={s.td}>${o.price}</td>
                  <td style={s.td}>{o.status}</td>
                  <td style={s.td}><button style={s.btnSmall} onClick={() => handleCancel(o.id)}>Cancel</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={s.section}>
        <h2 style={s.sectionTitle}>Recent Transactions</h2>
        <div style={s.walletRow}>
          <input
            style={s.walletInput}
            type="text"
            placeholder="0x... Enter your wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleWalletSave()}
          />
          <button style={s.walletBtn} onClick={handleWalletSave} disabled={txLoading}>
            {txLoading ? 'Loading...' : 'Load'}
          </button>
        </div>
        {transactions.length === 0 ? (
          <p style={s.empty}>{walletAddress ? 'No transactions found' : 'Enter your wallet address to see recent transactions'}</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Hash</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>From</th>
                <th style={s.th}>To</th>
                <th style={s.th}>Value (ETH)</th>
                <th style={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.hash}>
                  <td style={s.td}><span style={s.txHash} title={tx.hash}>{tx.hash}</span></td>
                  <td style={s.td}>{new Date(tx.timestamp).toLocaleDateString()}</td>
                  <td style={s.td}><span style={{ ...s.txAddr, color: tx.from.toLowerCase() === walletAddress.toLowerCase() ? 'var(--danger)' : 'var(--text-primary)' }} title={tx.from}>{tx.from}</span></td>
                  <td style={s.td}><span style={{ ...s.txAddr, color: tx.to?.toLowerCase() === walletAddress.toLowerCase() ? 'var(--success)' : 'var(--text-primary)' }} title={tx.to}>{tx.to || '—'}</span></td>
                  <td style={s.td}>{tx.value}</td>
                  <td style={s.td}>
                    {tx.isError
                      ? <span style={{ color: 'var(--danger)', fontWeight: 600, fontSize: '0.8rem' }}>Failed</span>
                      : <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.8rem' }}>OK</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
