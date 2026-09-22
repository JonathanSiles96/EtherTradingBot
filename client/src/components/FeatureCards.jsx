const features = [
  {
    title: 'Automated Trading',
    desc: 'Set your strategy and let the bot execute trades 24/7 without manual intervention.',
    icon: '⟳',
  },
  {
    title: 'Easy Setup',
    desc: 'Connect your exchange API key in seconds. No complex configuration needed.',
    icon: '⚡',
  },
  {
    title: 'Secure API Keys',
    desc: 'Your API keys are encrypted and stored securely. We never request withdrawal access.',
    icon: '🔒',
  },
];

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 16px',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '32px 24px',
    textAlign: 'center',
    transition: 'border-color 0.2s',
  },
  icon: {
    fontSize: '2rem',
    marginBottom: '16px',
    display: 'block',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'var(--text-primary)',
  },
  desc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },
};

export default function FeatureCards() {
  return (
    <div style={styles.grid}>
      {features.map((f) => (
        <div
          key={f.title}
          style={styles.card}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <span style={styles.icon}>{f.icon}</span>
          <h3 style={styles.title}>{f.title}</h3>
          <p style={styles.desc}>{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
