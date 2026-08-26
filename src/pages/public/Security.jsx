import PageHero from '../../components/PageHero';
import AuthCTA from '../../components/AuthCTA';

const Security = () => {
  const pillars = [
    { icon: 'fa-lock', title: 'Encryption Architecture', desc: 'Credentials and secure notes are encrypted with AES-256-GCM using keys derived from your master password via PBKDF2 (310,000 iterations). Only encrypted ciphertext is stored — never plaintext.', tag: 'Core' },
    { icon: 'fa-key', title: 'Master Password Security', desc: 'Your master password is never stored in plaintext. A cryptographic HMAC verifier validates unlock attempts without exposing the actual password or encryption key.', tag: 'Vault' },
    { icon: 'fa-microchip', title: 'Key Derivation (PBKDF2)', desc: 'PBKDF2 with SHA-512 and 310,000 iterations derives encryption keys from your master password and a unique per-user salt, making brute-force attacks computationally infeasible.', tag: 'KDF' },
    { icon: 'fa-fingerprint', title: 'Argon2id Password Hashing', desc: 'Account login passwords are hashed with Argon2id — a memory-hard algorithm designed to resist GPU, ASIC, and side-channel attacks.', tag: 'Auth' },
    { icon: 'fa-mobile-screen-button', title: 'Two-Factor Authentication', desc: 'Optional TOTP (authenticator app) and email OTP protect your account at login. Enable one or both methods and manage them individually from Settings.', tag: '2FA' },
    { icon: 'fa-envelope-circle-check', title: 'Email Verification & Change', desc: 'Signup email verification, resend support, and secure email change with password confirmation plus a verification link sent to the new address.', tag: 'Identity' },
    { icon: 'fa-ticket', title: 'JWT Session Management', desc: 'Short-lived access tokens (15 min) and refresh tokens (7 days) with HTTP-only cookies and Bearer token fallback for reliable SPA authentication.', tag: 'Sessions' },
    { icon: 'fa-desktop', title: 'Active Session Control', desc: 'View all active sessions with device info, browser, IP address, and last activity. Revoke individual sessions or logout all devices instantly.', tag: 'Control' },
    { icon: 'fa-unlock-keyhole', title: 'Session-Bound Vault Keys', desc: 'Vault encryption keys are tied to your authenticated session in the database — not held in volatile server memory — so production deployments stay consistent and secure.', tag: 'Vault' },
    { icon: 'fa-gauge-high', title: 'Rate Limiting', desc: 'Authentication endpoints are rate-limited to prevent brute-force attacks. Login, register, and 2FA verification have dedicated throttling limits.', tag: 'Defense' },
    { icon: 'fa-shield-virus', title: 'CSRF & XSS Protection', desc: 'Helmet security headers, input validation, sanitized error responses, and SameSite cookies protect against cross-site scripting and request forgery.', tag: 'Web' },
    { icon: 'fa-eye-slash', title: 'Zero Sensitive Logging', desc: 'Passwords, encryption keys, decrypted credentials, OTP codes, and tokens are never written to logs, error responses, or activity records.', tag: 'Privacy' },
  ];

  const layers = [
    { layer: 'Transport', tech: 'HTTPS / TLS', desc: 'All data encrypted in transit between client and server.' },
    { layer: 'Authentication', tech: 'Argon2id + JWT + 2FA', desc: 'Memory-hard password hashing, short-lived tokens, and optional TOTP or email OTP.' },
    { layer: 'Vault Encryption', tech: 'AES-256-GCM', desc: 'Authenticated encryption with unique IVs and auth tags per field.' },
    { layer: 'Key Derivation', tech: 'PBKDF2-SHA512', desc: '310,000 iterations with per-user salt for key stretching.' },
    { layer: 'Session Vault Keys', tech: 'Encrypted Session Store', desc: 'Vault keys persisted per session — survives serverless restarts without exposing plaintext.' },
    { layer: 'Database', tech: 'MongoDB', desc: 'Only encrypted ciphertext stored. No plaintext secrets ever persisted.' },
    { layer: 'API Security', tech: 'Helmet + CORS + Rate Limit', desc: 'Security headers, origin validation, and request throttling on sensitive routes.' },
  ];

  const practices = [
    'Use a unique, strong master password you don\'t use anywhere else',
    'Enable two-factor authentication — TOTP, email OTP, or both',
    'Enable vault auto-lock after periods of inactivity in Settings',
    'Regularly review your Security Dashboard for weak or reused passwords',
    'Revoke unknown sessions immediately from the Sessions page',
    'Export encrypted backups periodically and store them securely offline',
    'Verify your email and use the secure email change flow if your address changes',
    'Never share your master password or account credentials',
    'Review activity logs for unauthorized access or export attempts',
  ];

  return (
    <div className="security-page">
      <PageHero
        badge="Security Architecture"
        title="Built on"
        highlight="military-grade encryption"
        subtitle="LockForge implements defense-in-depth security at every layer — from key derivation to session management. Here's exactly how your data is protected."
      />

      {/* Security pillars */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Security Pillars</span>
            <h2 className="section-title mt-3">Twelve layers of protection</h2>
          </div>
          <div className="row g-4">
            {pillars.map((p) => (
              <div key={p.title} className="col-md-6 col-lg-4">
                <div className="modern-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="card-icon-wrap card-icon-sm"><i className={`fas ${p.icon}`} /></div>
                    <span className="tag-badge">{p.tag}</span>
                  </div>
                  <h5 className="card-title-modern">{p.title}</h5>
                  <p className="card-desc mb-0">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Encryption flow */}
      <section className="section-modern section-alt py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <span className="section-badge">Encryption Flow</span>
              <h2 className="section-title mt-3 mb-3">From password to ciphertext</h2>
              <p className="section-subtitle">Understanding how LockForge transforms your master password into encrypted vault data — and why plaintext never touches the database.</p>
            </div>
            <div className="col-lg-7">
              <div className="encryption-flow encryption-flow-lg">
                {[
                  { icon: 'fa-user-lock', title: 'You enter master password', desc: 'Sent over HTTPS, never stored or logged' },
                  { icon: 'fa-gears', title: 'PBKDF2 derives encryption key', desc: '310K iterations + unique salt per user' },
                  { icon: 'fa-shield-halved', title: 'AES-256-GCM encrypts data', desc: 'Each field gets unique IV + authentication tag' },
                  { icon: 'fa-database', title: 'Ciphertext stored in MongoDB', desc: 'Only encrypted blobs — no readable secrets' },
                  { icon: 'fa-unlock-keyhole', title: 'Unlock to decrypt on demand', desc: 'Session-bound key with configurable auto-lock timeout' },
                ].map((step, i) => (
                  <div key={step.title} className="flow-step">
                    <div className="flow-icon"><i className={`fas ${step.icon}`} /></div>
                    <div>
                      <strong>{step.title}</strong>
                      <p className="mb-0 small text-muted">{step.desc}</p>
                    </div>
                    {i < 4 && <div className="flow-connector" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security layers table */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Defense in Depth</span>
            <h2 className="section-title mt-3">Security layer overview</h2>
          </div>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>Technology</th>
                  <th>Protection</th>
                </tr>
              </thead>
              <tbody>
                {layers.map((l) => (
                  <tr key={l.layer}>
                    <td><strong>{l.layer}</strong></td>
                    <td><span className="tag-badge">{l.tech}</span></td>
                    <td className="text-muted">{l.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Best practices */}
      <section className="section-modern section-alt py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="section-badge">Best Practices</span>
              <h2 className="section-title mt-3 mb-3">Stay secure with LockForge</h2>
              <p className="section-subtitle">Follow these recommendations to maximize your account and vault security.</p>
              <AuthCTA
                loggedOutLabel="Get Started Securely"
                loggedInLabel="Go to Dashboard"
                className="btn btn-primary btn-modern mt-2"
              />
            </div>
            <div className="col-lg-7">
              <ul className="checklist-modern">
                {practices.map((item) => (
                  <li key={item}><i className="fas fa-check-circle" /><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency notice */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="transparency-card">
            <div className="transparency-icon"><i className="fas fa-circle-info" /></div>
            <div>
              <h5 className="fw-bold mb-2">Transparency Notice</h5>
              <p className="mb-0 text-muted">
                LockForge uses <strong>server-side encryption</strong>. While your master password is never stored in plaintext,
                the server derives encryption keys during vault unlock to encrypt and decrypt your data.
                This is <strong>not a zero-knowledge architecture</strong>. We are transparent about this
                so you can make an informed decision about your security needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Security;
