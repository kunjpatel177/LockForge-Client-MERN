import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import AuthCTA from '../../components/AuthCTA';

const UserGuide = () => {
  const quickStart = [
    { step: 1, title: 'Create your account', desc: 'Register with your email, set a strong account password, and choose a master password. Your master password encrypts your vault — store it safely.', icon: 'fa-user-plus' },
    { step: 2, title: 'Verify your email', desc: 'Check your inbox for a verification link. Verifying your email helps secure account recovery and notifications.', icon: 'fa-envelope-circle-check' },
    { step: 3, title: 'Unlock your vault', desc: 'After logging in, click "Unlock Vault" and enter your master password. Your vault stays unlocked until you lock it or your session expires.', icon: 'fa-unlock-keyhole' },
    { step: 4, title: 'Add your first credential', desc: 'Go to Vault → Add Credential. Fill in the service name, username or email, password, and optionally assign a folder.', icon: 'fa-plus' },
    { step: 5, title: 'Organize & monitor', desc: 'Use folders, favorites, and the Security Dashboard to keep credentials organized and check password health.', icon: 'fa-chart-line' },
  ];

  const storableItems = [
    {
      icon: 'fa-key',
      title: 'Login Credentials',
      items: ['Service / website name', 'Username or email', 'Password (encrypted)', 'Website URL', 'Notes'],
      color: 'indigo',
    },
    {
      icon: 'fa-puzzle-piece',
      title: 'Custom Fields',
      items: ['Security questions & answers', 'PIN codes', 'Recovery codes', 'License keys', 'Any label + value pair'],
      color: 'violet',
    },
    {
      icon: 'fa-sticky-note',
      title: 'Secure Notes',
      items: ['Private text content', 'Wi-Fi passwords', 'Bank details', 'Software licenses', 'Sensitive instructions'],
      color: 'cyan',
    },
    {
      icon: 'fa-tags',
      title: 'Metadata & Organization',
      items: ['Folders (Work, Banking, etc.)', 'Tags for quick search', 'Favorites for fast access', 'Created & updated dates'],
      color: 'amber',
    },
  ];

  const features = [
    {
      icon: 'fa-vault',
      title: 'Vault',
      path: '/vault',
      desc: 'Your central hub for all credentials. Search, filter by folder, sort by date, show/hide passwords, and copy values with one click.',
      tips: ['Use the search bar to find credentials by service name or tag', 'Click a row to view full details', 'Deleted items go to Trash and can be restored'],
    },
    {
      icon: 'fa-folder',
      title: 'Folders',
      path: '/folders',
      desc: 'Group credentials and notes into folders like Personal, Work, Banking, Social, and Development. Click a folder to see everything inside it.',
      tips: ['Create custom folders for your workflow', 'Move credentials between folders when editing', 'Default folders are created automatically on signup'],
    },
    {
      icon: 'fa-star',
      title: 'Favorites',
      path: '/favorites',
      desc: 'Mark frequently used credentials as favorites for quick access from the Favorites page.',
      tips: ['Toggle the star icon in the vault table or credential form', 'Great for daily-use accounts like email and work tools'],
    },
    {
      icon: 'fa-wand-magic-sparkles',
      title: 'Password Generator',
      path: '/generator',
      desc: 'Generate strong, unique passwords with customizable length, character types, and an optional exclude-ambiguous setting.',
      tips: ['Use 16+ characters with all character types enabled', 'Generate before saving a new credential', 'Check the strength indicator before using'],
    },
    {
      icon: 'fa-heart-pulse',
      title: 'Security Dashboard',
      path: '/security-dashboard',
      desc: 'Monitor your vault health with a security score. Detects weak, reused, and outdated passwords without exposing them unnecessarily.',
      tips: ['Review weak passwords weekly', 'Update reused passwords across services', 'Aim for a security score above 80%'],
    },
    {
      icon: 'fa-sticky-note',
      title: 'Secure Notes',
      path: '/notes',
      desc: 'Store encrypted text notes for information that is not a traditional login — recovery phrases, Wi-Fi details, or private memos.',
      tips: ['Assign notes to folders like credentials', 'Notes are encrypted the same way as vault data', 'Use clear titles for easy searching'],
    },
    {
      icon: 'fa-cloud-arrow-up',
      title: 'Backup & Restore',
      path: '/backup',
      desc: 'Export an encrypted backup of your entire vault. Restore from backup when switching devices or recovering data.',
      tips: ['Store backups in a safe, offline location', 'PDF export contains decrypted data — handle with care', 'Re-enter master password to export or restore'],
    },
    {
      icon: 'fa-desktop',
      title: 'Sessions & Activity',
      path: '/sessions',
      desc: 'View active login sessions across devices and review activity logs for logins, credential changes, exports, and security events.',
      tips: ['Revoke unknown sessions immediately', 'Check activity logs after traveling', 'Use "Logout All Devices" if you suspect compromise'],
    },
  ];

  const passwords = [
    { label: 'Account Password', desc: 'Used to log in to LockForge. Hashed with Argon2id. Can be changed in Profile → Change Password.' },
    { label: 'Master Password', desc: 'Encrypts and decrypts your vault. Never stored in plaintext. Required to unlock the vault. Cannot be recovered if lost.' },
  ];

  const faqs = [
    { q: 'Why do I need to unlock the vault separately?', a: 'Your master password derives the encryption key for your credentials. Unlocking is an extra security layer — even if someone accesses your logged-in session, they cannot read vault data without your master password.' },
    { q: 'What happens when I delete a credential?', a: 'Deleted credentials are moved to Trash first. You can restore them or permanently delete them. Empty Trash removes all trashed items forever.' },
    { q: 'Can I use LockForge on multiple devices?', a: 'Yes. Log in on any device with your account. Your vault data syncs through the server (encrypted). Unlock the vault on each device with your master password.' },
    { q: 'How do folders and tags differ?', a: 'Folders organize items into broad categories (one folder per item). Tags are flexible labels — you can add multiple tags to a credential for cross-cutting search.' },
  ];

  return (
    <div className="guide-page">
      <PageHero
        badge="User Guide"
        title="Learn how to use"
        highlight="LockForge"
        subtitle="Everything you need to know — from creating your account to organizing credentials, generating passwords, and keeping your vault secure."
      />

      {/* Quick Start */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Quick Start</span>
            <h2 className="section-title mt-3">Get up and running in 5 steps</h2>
          </div>
          <div className="row g-4">
            {quickStart.map((item) => (
              <div key={item.step} className="col-md-6 col-lg-4">
                <div className="guide-step-card h-100">
                  <div className="guide-step-num">{item.step}</div>
                  <div className="guide-step-icon"><i className={`fas ${item.icon}`} /></div>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you can store */}
      <section className="section-modern section-alt py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Your Vault</span>
            <h2 className="section-title mt-3">What you can store</h2>
            <p className="section-subtitle mx-auto">LockForge is more than a password list — it is a secure vault for all sensitive information.</p>
          </div>
          <div className="row g-4">
            {storableItems.map((block) => (
              <div key={block.title} className="col-md-6">
                <div className={`modern-card modern-card-${block.color} h-100`}>
                  <div className="card-icon-wrap"><i className={`fas ${block.icon}`} /></div>
                  <h5 className="card-title-modern">{block.title}</h5>
                  <ul className="guide-check-list">
                    {block.items.map((item) => (
                      <li key={item}><i className="fas fa-check" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two passwords */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-4">
                <span className="section-badge">Important</span>
                <h2 className="section-title mt-3">Two passwords, two purposes</h2>
              </div>
              <div className="row g-3">
                {passwords.map((p) => (
                  <div key={p.label} className="col-md-6">
                    <div className="modern-card h-100">
                      <h6 className="fw-bold text-primary mb-2">{p.label}</h6>
                      <p className="text-muted small mb-0">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature walkthrough */}
      <section className="section-modern section-alt py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Features</span>
            <h2 className="section-title mt-3">How to use each feature</h2>
          </div>
          <div className="guide-feature-list">
            {features.map((f, i) => (
              <div key={f.title} className="guide-feature-item">
                <div className="guide-feature-icon"><i className={`fas ${f.icon}`} /></div>
                <div className="guide-feature-content">
                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <h5 className="fw-bold mb-0">{f.title}</h5>
                    <Link to={f.path} className="tag-badge text-decoration-none">Open in app →</Link>
                  </div>
                  <p className="text-muted mb-2">{f.desc}</p>
                  <ul className="guide-tips-list">
                    {f.tips.map((tip) => (
                      <li key={tip}><i className="fas fa-lightbulb text-warning me-1" />{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keyboard shortcuts / workflow */}
      <section className="section-modern py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="section-badge">Daily Workflow</span>
              <h2 className="section-title mt-3 mb-3">A typical session</h2>
              <div className="encryption-flow">
                {[
                  { icon: 'fa-right-to-bracket', title: 'Log in', desc: 'Use your account email and password' },
                  { icon: 'fa-unlock', title: 'Unlock vault', desc: 'Enter your master password once per session' },
                  { icon: 'fa-search', title: 'Find & copy', desc: 'Search vault, copy username or password' },
                  { icon: 'fa-lock', title: 'Lock when done', desc: 'Click Lock in the navbar or log out' },
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
            <div className="col-lg-7">
              <div className="modern-card">
                <h5 className="fw-bold mb-3"><i className="fas fa-shield-halved text-primary me-2" />Security Best Practices</h5>
                <ul className="checklist-modern">
                  {[
                    'Use a unique master password you do not use anywhere else',
                    'Enable vault auto-lock in Settings after periods of inactivity',
                    'Never share your master password or account credentials',
                    'Review the Security Dashboard monthly for weak or reused passwords',
                    'Export encrypted backups regularly and store them offline',
                    'Revoke unfamiliar sessions from the Sessions page',
                    'Use the password generator instead of reusing passwords',
                  ].map((item) => (
                    <li key={item}><i className="fas fa-check-circle" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-modern section-alt py-5">
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
          <h2 className="cta-title">Ready to put this into practice?</h2>
          <p className="cta-subtitle">Create your account and start securing your digital life in minutes.</p>
          <AuthCTA
            loggedOutLabel="Create Free Account"
            loggedInLabel="Go to Dashboard"
            className="btn btn-light btn-modern btn-lg cta-btn"
          />
        </div>
      </section>
    </div>
  );
};

export default UserGuide;
