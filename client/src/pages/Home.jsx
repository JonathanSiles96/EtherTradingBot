import { Link } from 'react-router-dom';
import PriceDisplay from '../components/PriceDisplay';
import FeatureCards from '../components/FeatureCards';
import { useAuth } from '../context/AuthContext';

const styles = {
  hero: {
    textAlign: 'center',
    padding: '80px 16px 60px',
  },
  title: {
    fontSize: '2.75rem',
    fontWeight: 700,
    marginBottom: '16px',
    background: 'linear-gradient(135deg, var(--accent-light), var(--accent))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.15rem',
    color: 'var(--text-secondary)',
    maxWidth: '520px',
    margin: '0 auto 32px',
    lineHeight: 1.6,
  },
  cta: {
    display: 'inline-block',
    padding: '14px 36px',
    background: 'var(--accent)',
    color: '#fff',
    borderRadius: 'var(--radius)',
    fontSize: '1rem',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'background 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 24px var(--accent-glow)',
  },
  section: {
    padding: '60px 16px',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '40px',
    color: 'var(--text-primary)',
  },
};

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <section style={styles.hero}>
        <h1 style={styles.title}>Simple Ethereum Trading Bot</h1>
        <p style={styles.subtitle}>
          Connect your exchange API key and let the bot trade ETH for you.
        </p>
        <Link to={user ? '/connect' : '/signup'} style={styles.cta}>
          Connect API Key
        </Link>
        <div>
          <PriceDisplay />
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Features</h2>
        <FeatureCards />
      </section>
    </>
  );
}
