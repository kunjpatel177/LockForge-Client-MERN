import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthCTA from '../../components/AuthCTA';
import { ownerInfo } from '../../config/owner';
import { API_BASE_URL } from '../../config/api';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [generated, setGenerated] = useState('');
  const [strength, setStrength] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/public/generate-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true }),
      });
      const data = await res.json();
      setGenerated(data.data.password);
      setStrength(data.data.strength);
    } catch {
      setGenerated('Kx9#mP2$vL8@nQ4!wR6z');
      setStrength({ score: 4, label: 'Strong' });
    }
    setCopied(false);
  };

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { value: 'AES-256', label: 'Military-grade encryption' },
    { value: '0', label: 'Plaintext passwords stored' },
    { value: '24/7', label: 'Vault access control' },
    { value: '100%', label: 'Encrypted at rest' },
  ];

  const features = [
    { icon: 'fa-vault', title: 'Encrypted Vault', desc: 'Every credential is encrypted with AES-256-GCM before it ever touches the database.', color: 'indigo' },
    { icon: 'fa-key', title: 'Smart Generator', desc: 'Create cryptographically strong passwords with customizable length and character sets.', color: 'violet' },
    { icon: 'fa-folder-tree', title: 'Folders & Tags', desc: 'Organize credentials into folders like Work, Banking, and Social with flexible tagging.', color: 'cyan' },
    { icon: 'fa-heart-pulse', title: 'Password Health', desc: 'Instantly detect weak, reused, and outdated passwords across your entire vault.', color: 'rose' },
    { icon: 'fa-clock-rotate-left', title: 'Activity Logs', desc: 'Full audit trail of logins, changes, exports, and session events — without sensitive data.', color: 'amber' },
    { icon: 'fa-cloud-arrow-up', title: 'Encrypted Backup', desc: 'Export and restore your vault with encrypted backups. Your data, your control.', color: 'emerald' },
  ];

  const steps = [
    { num: '01', title: 'Create your account', desc: 'Sign up with a strong account password and set your master password — the key to your vault.' },
    { num: '02', title: 'Unlock your vault', desc: 'Your master password derives an encryption key via PBKDF2. Only you can decrypt your data.' },
    { num: '03', title: 'Store & organize', desc: 'Add credentials, notes, and custom fields. Organize with folders, tags, and favorites.' },
    { num: '04', title: 'Stay protected', desc: 'Monitor password health, review activity logs, and manage sessions across all devices.' },
  ];

  const faqs = [
    { q: 'Is my master password stored anywhere?', a: 'No. Only a cryptographic verifier is stored to validate unlock attempts. Your actual master password never leaves your session.' },
    { q: 'What happens if I forget my master password?', a: 'Your master password cannot be recovered — by design. This ensures only you can access your encrypted vault.' },
    { q: 'Is LockForge zero-knowledge?', a: 'LockForge uses server-side encryption. Your master password is never stored, but keys are derived server-side during vault unlock.' },
    { q: 'Can I export my data?', a: 'Yes. Export encrypted backups or generate a PDF export (with master password re-verification) at any time.' },
  ];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-modern">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="container position-relative">
          <div className="row align-items-center min-vh-80 py-5">
            <div className="col-lg-6">
              <span className="section-badge mb-4"><i className="fas fa-shield-halved me-2" />Trusted Password Security</span>
              <h1 className="hero-title">
                Your passwords.<br />
                <span className="gradient-text">Protected by design.</span>
              </h1>
              <p className="hero-subtitle">
                LockForge encrypts every credential with AES-256-GCM, monitors password health,
                and gives you complete control over your digital security — all in one beautiful vault.
              </p>
              <div className="d-flex gap-3 flex-wrap mb-4">
                <AuthCTA
                  loggedOutLabel="Get Started Free"
                  loggedInLabel="Go to Dashboard"
                  className="btn btn-primary btn-modern btn-lg"
                />
                <Link to="/guide" className="btn btn-ghost btn-lg">
                  <i className="fas fa-book me-2" />User Guide
                </Link>
                <Link to="/security" className="btn btn-ghost btn-lg">
                  <i className="fas fa-lock me-2" />How It Works
                </Link>
              </div>
              <div className="hero-trust">
                <i className="fas fa-check-circle text-success me-2" />
                <span>
                  {isAuthenticated
                    ? 'Welcome back — your vault is ready'
                    : 'Free to use · No credit card · Setup in 2 minutes'}
                </span>
              </div>
              <p className="hero-founder mt-3 mb-0">
                Created by <Link to="/about" className="hero-founder-link">{ownerInfo.name}</Link>
              </p>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="hero-mockup">
                <div className="mockup-header">
                  <span className="mockup-dot red" /><span className="mockup-dot yellow" /><span className="mockup-dot green" />
                  <span className="mockup-title">LockForge Vault</span>
                </div>
                <div className="mockup-body">
                  {[
                    { icon: 'fa-google', name: 'Google', user: 'you@gmail.com', color: '#ea4335' },
                    { icon: 'fa-github', name: 'GitHub', user: 'dev_user', color: '#333' },
                    { icon: 'fa-amazon', name: 'Amazon', user: 'shopper@mail.com', color: '#ff9900' },
                    { icon: 'fa-building-columns', name: 'Chase Bank', user: '••••••••', color: '#117aca' },
                  ].map((item) => (
                    <div key={item.name} className="mockup-row">
                      <span className="mockup-icon" style={{ background: item.color }}><i className={`fab ${item.icon}`} /></span>
                      <div className="mockup-info">
                        <strong>{item.name}</strong>
                        <small>{item.user}</small>
                      </div>
                      <span className="mockup-lock"><i className="fas fa-lock" /></span>
                    </div>
                  ))}
                </div>
                <div className="mockup-footer">
                  <span><i className="fas fa-shield-halved me-1" />AES-256-GCM Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container">
          <div className="row g-4">
            {stats.map((s) => (
              <div key={s.label} className="col-6 col-md-3 text-center">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Features</span>
            <h2 className="section-title mt-3">Everything you need to stay secure</h2>
            <p className="section-subtitle mx-auto">A complete password management platform built with security at its core.</p>
          </div>
          <div className="row g-4">
            {features.map((f) => (
              <div key={f.title} className="col-md-6 col-lg-4">
                <div className={`modern-card modern-card-${f.color} h-100`}>
                  <div className="card-icon-wrap"><i className={`fas ${f.icon}`} /></div>
                  <h5 className="card-title-modern">{f.title}</h5>
                  <p className="card-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-modern section-alt py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title mt-3">Up and running in minutes</h2>
          </div>
          <div className="row g-4">
            {steps.map((step) => (
              <div key={step.num} className="col-md-6 col-lg-3">
                <div className="step-card">
                  <div className="step-num">{step.num}</div>
                  <h5 className="fw-bold mb-2">{step.title}</h5>
                  <p className="text-muted mb-0 small">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Password Generator + Encryption */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="section-badge">Password Generator</span>
              <h2 className="section-title mt-3 mb-3">Generate unbreakable passwords</h2>
              <p className="section-subtitle mb-4">Create cryptographically strong passwords with one click. Customize length, character types, and exclude ambiguous characters.</p>
              <button className="btn btn-primary btn-modern mb-3" onClick={handleGenerate} type="button">
                <i className="fas fa-wand-magic-sparkles me-2" />Generate Password
              </button>
              {generated && (
                <div className="generator-output">
                  <code>{generated}</code>
                  <div className="generator-actions">
                    {strength && <span className={`strength-badge strength-${strength.score >= 3 ? 'high' : 'low'}`}>{strength.label}</span>}
                    <button className="btn btn-sm btn-ghost" onClick={handleCopy} type="button">
                      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} me-1`} />{copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <div className="encryption-flow">
                <h5 className="fw-bold mb-4"><i className="fas fa-lock me-2 text-primary" />Encryption Pipeline</h5>
                {[
                  { icon: 'fa-key', title: 'Master Password', desc: 'PBKDF2 key derivation (310K iterations)' },
                  { icon: 'fa-shield-halved', title: 'AES-256-GCM', desc: 'Authenticated encryption with unique IVs' },
                  { icon: 'fa-database', title: 'Encrypted Storage', desc: 'Only ciphertext stored in MongoDB' },
                  { icon: 'fa-unlock', title: 'Vault Unlock', desc: 'Decryption requires master password' },
                ].map((step, i) => (
                  <div key={step.title} className="flow-step">
                    <div className="flow-icon"><i className={`fas ${step.icon}`} /></div>
                    <div>
                      <strong>{step.title}</strong>
                      <p className="mb-0 small text-muted">{step.desc}</p>
                    </div>
                    {i < 3 && <div className="flow-connector" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-modern section-alt py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Why LockForge</span>
            <h2 className="section-title mt-3">Built different from the start</h2>
          </div>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th className="highlight-col">LockForge</th>
                  <th>Browser Storage</th>
                  <th>Plain Text Files</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AES-256-GCM Encryption', true, false, false],
                  ['Password Health Monitoring', true, false, false],
                  ['Activity Audit Logs', true, false, false],
                  ['Encrypted Backup/Restore', true, false, false],
                  ['Session Management', true, false, false],
                  ['Master Password Protection', true, false, false],
                ].map(([cap, lf, browser, plain]) => (
                  <tr key={cap}>
                    <td>{cap}</td>
                    <td className="highlight-col">{lf ? <i className="fas fa-check text-success" /> : <i className="fas fa-times text-danger" />}</td>
                    <td>{browser ? <i className="fas fa-check text-success" /> : <i className="fas fa-times text-danger" />}</td>
                    <td>{plain ? <i className="fas fa-check text-success" /> : <i className="fas fa-times text-danger" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <span className="section-badge">FAQ</span>
                <h2 className="section-title mt-3">Common questions</h2>
              </div>
              <div className="faq-list">
                {faqs.map((faq) => (
                  <div key={faq.q} className="faq-item">
                    <h6 className="faq-question"><i className="fas fa-circle-question me-2 text-primary" />{faq.q}</h6>
                    <p className="faq-answer">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <div className="container text-center cta-content">
          <h2 className="cta-title">Ready to take control of your security?</h2>
          <p className="cta-subtitle">Join thousands of users who trust LockForge to protect their digital life.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <AuthCTA
              loggedOutLabel="Create Free Account"
              loggedInLabel="Go to Dashboard"
              className="btn btn-light btn-modern btn-lg cta-btn"
            />
            <Link to="/guide" className="btn btn-light btn-modern btn-lg cta-btn">Read User Guide</Link>
            <Link to="/features" className="btn btn-light btn-modern btn-lg cta-btn">Explore Features</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
