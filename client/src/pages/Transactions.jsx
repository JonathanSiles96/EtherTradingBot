import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

const DEFAULT_ADDRESS = '0x1251B81aB3F2DF2FF60358aa80dEa8e7858Bf9C1';

const s = {
  page: { maxWidth: '960px', margin: '40px auto', padding: '0 16px' },
  title: { fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' },
  subtitle: { color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' },
  searchRow: {
    display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap',
  },
  input: {
    flex: 1, minWidth: '280px', padding: '10px 14px', background: 'var(--bg-primary)',
    border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)',
    fontSize: '0.95rem', outline: 'none', fontFamily: 'monospace',
  },
  btn: {
    padding: '10px 28px', background: 'var(--accent)', color: '#fff', border: 'none',
    borderRadius: 'var(--radius)', fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'nowrap',
  },
  error: {
    color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '16px',
    padding: '10px 14px', background: 'rgba(231, 76, 60, 0.1)',
    border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '6px',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' },
  th: {
    textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid var(--border)',
    color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.75rem',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  td: { padding: '10px 12px', borderBottom: '1px solid var(--border)', verticalAlign: 'top' },
  mono: { fontFamily: 'monospace', fontSize: '0.78rem' },
  addr: {
    fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--accent-light)',
    maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  hash: {
    fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--accent-light)',
    maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  value: { fontWeight: 600 },
  errorBadge: {
    display: 'inline-block', padding: '2px 6px', borderRadius: '4px',
    fontSize: '0.7rem', fontWeight: 600, background: 'rgba(231, 76, 60, 0.15)',
    color: 'var(--danger)',
  },
  successBadge: {
    display: 'inline-block', padding: '2px 6px', borderRadius: '4px',
    fontSize: '0.7rem', fontWeight: 600, background: 'rgba(46, 204, 113, 0.15)',
    color: 'var(--success)',
  },
  paginationRow: {
    display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px',
  },
  pageBtn: {
    padding: '8px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', cursor: 'pointer',
  },
  empty: { color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0', fontSize: '0.95rem' },
  tableWrap: { overflowX: 'auto' },
  senderHighlight: { color: 'var(--accent-light)', fontWeight: 600 },
};

export default function Transactions() {
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [searched, setSearched] = useState(false);
  const [searchedAddr, setSearchedAddr] = useState('');

  const fetchTransactions = useCallback(async (addr, searchPage = 1) => {
    const trimmed = addr.trim();
    if (!/^0x[0-9a-fA-F]{40}$/.test(trimmed)) {
      setError('Enter a valid Ethereum address (0x...)');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.getTransactions(trimmed, searchPage);
      setTransactions(data.transactions);
      setPage(searchPage);
      setSearchedAddr(trimmed);
    } catch (err) {
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(DEFAULT_ADDRESS);
  }, [fetchTransactions]);

  const handleSearch = (searchPage = 1) => {
    fetchTransactions(address, searchPage);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isSender = (from) => from?.toLowerCase() === searchedAddr.toLowerCase();

  return (
    <div style={s.page}>
      <h1 style={s.title}>Transaction History</h1>
      <p style={s.subtitle}>Look up Ethereum transactions by wallet address.</p>

      <div style={s.searchRow}>
        <input
          style={s.input}
          type="text"
          placeholder="0x... Enter Ethereum address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button style={s.btn} onClick={() => handleSearch()} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div style={s.error}>{error}</div>}

      {searched && !loading && transactions.length === 0 && !error && (
        <p style={s.empty}>No transactions found for this address.</p>
      )}

      {transactions.length > 0 && (
        <>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Tx Hash</th>
                  <th style={s.th}>Block</th>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>From</th>
                  <th style={s.th}>To</th>
                  <th style={s.th}>Value (ETH)</th>
                  <th style={s.th}>Gas Price (Gwei)</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.hash}>
                    <td style={s.td}>
                      <span style={s.hash} title={tx.hash}>{tx.hash}</span>
                    </td>
                    <td style={{ ...s.td, ...s.mono }}>{tx.blockNumber}</td>
                    <td style={s.td}>{formatDate(tx.timestamp)}</td>
                    <td style={s.td}>
                      <span
                        style={{ ...s.addr, ...(isSender(tx.from) ? s.senderHighlight : {}) }}
                        title={tx.from}
                      >
                        {tx.from}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={s.addr} title={tx.to}>{tx.to || '—'}</span>
                    </td>
                    <td style={{ ...s.td, ...s.value }}>{tx.value}</td>
                    <td style={{ ...s.td, ...s.mono }}>{tx.gasPrice}</td>
                    <td style={s.td}>
                      {tx.isError ? (
                        <span style={s.errorBadge}>Failed</span>
                      ) : (
                        <span style={s.successBadge}>Success</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={s.paginationRow}>
            {page > 1 && (
              <button style={s.pageBtn} onClick={() => handleSearch(page - 1)}>
                Previous
              </button>
            )}
            <span style={{ color: 'var(--text-secondary)', alignSelf: 'center', fontSize: '0.85rem' }}>
              Page {page}
            </span>
            {transactions.length === 25 && (
              <button style={s.pageBtn} onClick={() => handleSearch(page + 1)}>
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
