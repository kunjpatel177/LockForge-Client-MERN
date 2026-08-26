import PageHero from '../../components/PageHero';
import { Link } from 'react-router-dom';
import AuthCTA from '../../components/AuthCTA';
import OwnerProfile from '../../components/OwnerProfile';

const About = () => {
  const values = [
    { icon: 'fa-shield-halved', title: 'Security First', desc: 'Every architectural decision starts with "is this secure?" — not "is this fast enough to ship?"' },
    { icon: 'fa-eye', title: 'Transparency', desc: 'We clearly explain what we encrypt, how we encrypt it, and what we don\'t claim to protect.' },
    { icon: 'fa-user-shield', title: 'Privacy Respect', desc: 'Your credentials belong to you. We never sell data, never log secrets, and never access your vault.' },
    { icon: 'fa-code', title: 'Open Standards', desc: 'We use proven cryptographic standards — AES-256-GCM, Argon2id, PBKDF2 — not proprietary algorithms.' },
    { icon: 'fa-universal-access', title: 'Accessibility', desc: 'Enterprise-grade security shouldn\'t require enterprise budgets. LockForge is free to use.' },
    { icon: 'fa-arrows-rotate', title: 'Continuous Improvement', desc: 'Security is never "done." We continuously audit, update dependencies, and harden our stack.' },
  ];

  const techStack = [
    { category: 'Frontend', items: ['React 19', 'Vite', 'React Router', 'Bootstrap 5', 'Axios'] },
    { category: 'Backend', items: ['Node.js', 'Express.js', 'Mongoose', 'JWT', 'Helmet'] },
    { category: 'Security', items: ['AES-256-GCM', 'Argon2id', 'PBKDF2', 'TOTP & Email 2FA', 'Rate Limiting'] },
    { category: 'Database', items: ['MongoDB', 'Indexed Queries', 'Encrypted Fields', 'Session Store', 'Activity Logs'] },
  ];

  const milestones = [
    { year: '2024', title: 'Concept & Architecture', desc: 'Security-first design with separated auth and vault encryption layers.' },
    { year: '2025', title: 'Core Platform Launch', desc: 'Full vault management, folders, secure notes, password health, backup/restore, and activity logging.' },
    { year: '2026', title: 'LockForge 1.0', desc: 'Two-factor auth (TOTP + email), email change, folder assign/move, PDF export, session-bound vault keys, trash recovery, and production deployment.' },
    { year: 'Future', title: 'What\'s Next', desc: 'Browser extension, team vaults, hardware key support, and mobile apps.' },
  ];

  return (
    <div className="about-page">
      <PageHero
        badge="About LockForge"
        title="Security-first password management for"
        highlight="everyone"
        subtitle="LockForge was built on a simple belief: everyone deserves the same level of password security that enterprises pay thousands for — without the complexity."
      />

      {/* Mission */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="section-badge">Our Mission</span>
              <h2 className="section-title mt-3 mb-4">Making world-class security accessible</h2>
              <p className="text-muted mb-3">
                In a world where data breaches expose billions of credentials annually, password reuse remains
                the #1 attack vector. LockForge exists to eliminate that risk — giving individuals a secure,
                intuitive vault to store, generate, and monitor their passwords.
              </p>
              <p className="text-muted mb-4">
                We built LockForge as a complete MERN application demonstrating production-grade security
                patterns: authenticated encryption, memory-hard hashing, two-factor authentication,
                session management, audit logging, encrypted backup, PDF export, and secure email change —
                all wrapped in a modern, responsive interface.
              </p>
              <Link to="/security" className="btn btn-primary btn-modern">Explore Our Security</Link>
            </div>
            <div className="col-lg-6">
              <div className="mission-card">
                <div className="mission-stat">
                  <div className="mission-stat-value">256-bit</div>
                  <div className="mission-stat-label">Encryption standard</div>
                </div>
                <div className="mission-stat">
                  <div className="mission-stat-value">0</div>
                  <div className="mission-stat-label">Plaintext secrets stored</div>
                </div>
                <div className="mission-stat">
                  <div className="mission-stat-value">20+</div>
                  <div className="mission-stat-label">Platform features</div>
                </div>
                <div className="mission-stat">
                  <div className="mission-stat-value">100%</div>
                  <div className="mission-stat-label">Open crypto standards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OwnerProfile />

      {/* Values */}
      <section className="section-modern section-alt py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Our Values</span>
            <h2 className="section-title mt-3">What drives every decision</h2>
          </div>
          <div className="row g-4">
            {values.map((v) => (
              <div key={v.title} className="col-md-6 col-lg-4">
                <div className="modern-card h-100">
                  <div className="card-icon-wrap card-icon-sm mb-3"><i className={`fas ${v.icon}`} /></div>
                  <h5 className="card-title-modern">{v.title}</h5>
                  <p className="card-desc mb-0">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Technology</span>
            <h2 className="section-title mt-3">Built with modern, battle-tested tools</h2>
            <p className="section-subtitle mx-auto">A full-stack MERN architecture designed for security, scalability, and maintainability.</p>
          </div>
          <div className="row g-4">
            {techStack.map((group) => (
              <div key={group.category} className="col-md-6 col-lg-3">
                <div className="tech-card h-100">
                  <h6 className="tech-category">{group.category}</h6>
                  <ul className="tech-list">
                    {group.items.map((item) => (
                      <li key={item}><i className="fas fa-check me-2 text-primary" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="section-modern section-alt py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="section-badge">Architecture</span>
              <h2 className="section-title mt-3 mb-3">Clean separation of concerns</h2>
              <p className="text-muted mb-3">
                LockForge separates authentication data from encrypted vault data. Account passwords
                (Argon2id hashed) and master password verifiers live in the User model. Encrypted
                credentials, secure notes, and custom fields are stored as AES-256-GCM ciphertext blobs.
                Two-factor secrets, session vault keys, and email change tokens are also stored securely.
              </p>
              <p className="text-muted">
                API routes are versioned under <code>/api/v1</code> with controllers, middleware,
                validators, and centralized error handling. The React frontend communicates via
                Axios with Bearer token authentication and automatic token refresh.
              </p>
            </div>
            <div className="col-lg-7">
              <div className="arch-diagram">
                {[
                  { label: 'React Client', sub: 'Vite + React Router + Axios', color: 'cyan' },
                  { label: 'Express API', sub: '/api/v1 — Auth, Vault, Security', color: 'indigo' },
                  { label: 'Middleware Layer', sub: 'JWT · Rate Limit · Vault Lock · Validation', color: 'violet' },
                  { label: 'MongoDB', sub: 'Users · Credentials · Sessions · Logs', color: 'emerald' },
                ].map((block, i) => (
                  <div key={block.label}>
                    <div className={`arch-block arch-${block.color}`}>
                      <strong>{block.label}</strong>
                      <small>{block.sub}</small>
                    </div>
                    {i < 3 && <div className="arch-arrow"><i className="fas fa-arrow-down" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Roadmap</span>
            <h2 className="section-title mt-3">Our journey</h2>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={m.year} className={`timeline-item ${i % 2 === 0 ? '' : 'timeline-right'}`}>
                <div className="timeline-dot" />
                <div className="timeline-content modern-card">
                  <span className="tag-badge mb-2">{m.year}</span>
                  <h5 className="card-title-modern">{m.title}</h5>
                  <p className="card-desc mb-0">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="section-modern section-alt py-5">
        <div className="container">
          <div className="transparency-card">
            <div className="transparency-icon"><i className="fas fa-user-shield" /></div>
            <div>
              <h5 className="fw-bold mb-2">Privacy Commitment</h5>
              <p className="mb-2 text-muted">
                We never log passwords, encryption keys, or decrypted credentials. Activity logs track
                security events (logins, exports, session revocations) without storing sensitive values.
                Your vault data is encrypted at rest and only decrypted when you unlock with your master password.
              </p>
              <p className="mb-0 text-muted">
                LockForge is designed so that even in a database breach, attackers would only find
                encrypted ciphertext — useless without your master password.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-modern">
        <div className="container text-center cta-content">
          <h2 className="cta-title">Ready to secure your digital life?</h2>
          <p className="cta-subtitle">Join LockForge today and experience security without compromise.</p>
          <AuthCTA
            loggedOutLabel="Create Your Account"
            loggedInLabel="Go to Dashboard"
            className="btn btn-light btn-modern btn-lg cta-btn"
          />
        </div>
      </section>
    </div>
  );
};

export default About;
