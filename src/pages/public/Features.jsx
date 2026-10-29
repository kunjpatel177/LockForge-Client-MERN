import PageHero from '../../components/PageHero';
import AuthCTA from '../../components/AuthCTA';

const Features = () => {
  const featureGroups = [
    {
      title: 'Vault & Storage',
      subtitle: 'Store, encrypt, and organize everything sensitive',
      features: [
        { icon: 'fa-vault', title: 'Secure Password Vault', desc: 'Store credentials with AES-256-GCM encryption. Search, filter, sort, copy fields, and toggle password visibility.', color: 'indigo' },
        { icon: 'fa-eye-slash', title: 'Hidden Items (Secret Vault)', desc: 'Conceal highly confidential credentials, notes, and folders. Requires master password re-authentication and stays hidden during imports/exports.', color: 'rose' },
        { icon: 'fa-pen-to-square', title: 'Custom Fields', desc: 'Add security questions, PINs, recovery codes, license keys, and any custom label-value pairs to credentials.', color: 'violet' },
        { icon: 'fa-sticky-note', title: 'Secure Notes', desc: 'Encrypted notes for recovery phrases, Wi-Fi passwords, bank details, and private memos — with full multi-field search.', color: 'cyan' },
        { icon: 'fa-star', title: 'Favorites', desc: 'Pin your most-used credentials and notes for one-click access from the Favorites page.', color: 'amber' },
        { icon: 'fa-trash-arrow-up', title: 'Trash & Item Lifecycle', desc: 'Soft-delete credentials, notes, and folders to Trash. Restore items individually or in bulk, or permanently empty trash.', color: 'emerald' },
      ],
    },
    {
      title: 'Organization & Tools',
      subtitle: 'Keep your vault structured and easy to use',
      features: [
        { icon: 'fa-folder', title: 'Folders Management', desc: 'Default folders on signup plus custom folders. Assign items, move credentials and notes in bulk, and open folder detail views.', color: 'emerald' },
        { icon: 'fa-magnifying-glass', title: 'Multi-Field Advanced Search', desc: 'Filter search by Service Name, Username/Email, URL, Tags, Notes, or All Fields across your vault, folders, and secure notes.', color: 'indigo' },
        { icon: 'fa-file-pdf', title: 'Password-Protected PDF Export', desc: 'Generate encrypted, watermarked PDF reports of your vault or individual folders strictly protected by your master password.', color: 'rose' },
        { icon: 'fa-key', title: 'Password Generator', desc: 'Generate high-entropy passwords with customizable length, symbols, numbers, and real-time cryptographic strength scoring.', color: 'violet' },
        { icon: 'fa-heart-pulse', title: 'Weekly Security Health Audits', desc: 'Security Dashboard calculates vault health scores and automatically dispatches weekly digest emails if weak or reused passwords exist.', color: 'cyan' },
        { icon: 'fa-tags', title: 'Tags & Metadata', desc: 'Tag credentials for flexible categorization, quick filtering, and fast cross-referencing across services.', color: 'amber' },
      ],
    },
    {
      title: 'Account Security',
      subtitle: 'Protect your LockForge account and sessions',
      features: [
        { icon: 'fa-mobile-screen-button', title: 'Two-Factor Authentication', desc: 'Enable TOTP (authenticator app), email OTP, or both. Add, remove, or disable methods individually from Settings.', color: 'amber' },
        { icon: 'fa-location-dot', title: 'Real-Time Sign-In Alerts', desc: 'Receive instant email notifications upon login with UTC time, IP address, estimated geolocation, browser, and device details.', color: 'rose' },
        { icon: 'fa-envelope-circle-check', title: 'Email Verification', desc: 'Verify your email on signup. Resend verification links anytime from your Profile page.', color: 'emerald' },
        { icon: 'fa-at', title: 'Change Registered Email', desc: 'Update your account email with password confirmation. Confirm via a secure link sent to your new address.', color: 'indigo' },
        { icon: 'fa-desktop', title: 'Session Management', desc: 'View active sessions with device, browser, and IP info. Revoke individual sessions or sign out everywhere.', color: 'violet' },
        { icon: 'fa-lock', title: 'Vault Auto-Lock', desc: 'Configure inactivity auto-lock, manual vault lock from the navbar, and session-bound encryption keys.', color: 'cyan' },
      ],
    },
    {
      title: 'Backup & Monitoring',
      subtitle: 'Export, restore, and audit your vault activity',
      features: [
        { icon: 'fa-cloud-arrow-up', title: 'Smart Backup & Restore', desc: 'Export encrypted backups and restore via two modes: Full Replace or Smart Merge (updating matching items without data loss).', color: 'rose' },
        { icon: 'fa-file-export', title: 'Encrypted Offline PDF Export', desc: 'Produce clean, formatted offline PDF records secured by your master password for safekeeping.', color: 'amber' },
        { icon: 'fa-clock-rotate-left', title: 'Activity Logs', desc: 'Audit logins, credential changes, exports, 2FA events, email updates, and session revocations — with zero plaintext logging.', color: 'emerald' },
        { icon: 'fa-palette', title: 'Themes & Settings', desc: 'Switch between light and dark themes, manage auto-lock timing, and control account security preferences.', color: 'indigo' },
        { icon: 'fa-user-gear', title: 'Profile Management', desc: 'Update your name, change account password, change master password, and manage account deletion.', color: 'violet' },
      ],
    },
  ];

  return (
    <div>
      <PageHero
        badge="Platform Features"
        title="Powerful tools for"
        highlight="complete security"
        subtitle="From encrypted vault storage and two-factor authentication to folder PDF exports, secure notes, session control, and full audit logging — LockForge covers every layer of password management."
      />
      {featureGroups.map((group) => (
        <section key={group.title} className={`section-modern py-5${group.title === 'Organization & Tools' || group.title === 'Backup & Monitoring' ? ' section-alt' : ''}`}>
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-badge">{group.title}</span>
              <h2 className="section-title mt-3">{group.subtitle}</h2>
            </div>
            <div className="row g-4">
              {group.features.map((f) => (
                <div key={f.title} className="col-md-6 col-lg-4">
                  <div className={`modern-card modern-card-${f.color} h-100`}>
                    <div className="card-icon-wrap"><i className={`fas ${f.icon}`} /></div>
                    <h5 className="card-title-modern">{f.title}</h5>
                    <p className="card-desc mb-0">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="section-modern py-5">
        <div className="container text-center">
          <AuthCTA
            loggedOutLabel="Start Using LockForge"
            loggedInLabel="Go to Dashboard"
            className="btn btn-primary btn-modern btn-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default Features;
