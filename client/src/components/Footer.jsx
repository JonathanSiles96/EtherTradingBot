const styles = {
  footer: {
    textAlign: 'center',
    padding: '32px 16px',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
  },
  disclaimer: {
    marginTop: '8px',
    fontSize: '0.75rem',
    opacity: 0.7,
  },
};

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} ETH Trading Bot. All rights reserved.</p>
      <p style={styles.disclaimer}>
        Crypto trading involves risk. This is not financial advice. Trade responsibly.
      </p>
    </footer>
  );
}
