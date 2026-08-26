import PageHero from '../../components/PageHero';
import AuthCTA from '../../components/AuthCTA';

const Features = () => {
  const featureGroups = [
    {
      title: 'Vault & Storage',
      subtitle: 'Store, encrypt, and organize everything sensitive',
      features: [
        { icon: 'fa-vault', title: 'Secure Password Vault', desc: 'Store credentials with AES-256-GCM encryption. Search, filter, sort, copy fields, and toggle password visibility.', color: 'indigo' },
        { icon: 'fa-pen-to-square', title: 'Custom Fields', desc: 'Add security questions, PINs, recovery codes, license keys, and any custom label-value pairs to credentials.', color: 'violet' },
        { icon: 'fa-sticky-note', title: 'Secure Notes', desc: 'Encrypted notes for recovery phrases, Wi-Fi passwords, bank details, and private memos — with search support.', color: 'cyan' },
        { icon: 'fa-star', title: 'Favorites', desc: 'Pin your most-used credentials and notes for one-click access from the Favorites page.', color: 'rose' },
        { icon: 'fa-trash-arrow-up', title: 'Trash & Restore', desc: 'Soft-delete credentials to Trash, restore them later, or permanently remove items when you are ready.', color: 'amber' },
      ],
    },
    {
      title: 'Organization & Tools',
      subtitle: 'Keep your vault structured and easy to use',
      features: [
        { icon: 'fa-folder', title: 'Folders', desc: 'Default folders on signup plus custom folders. Assign items, move credentials and notes in bulk, and open folder detail views.', color: 'emerald' },
        { icon: 'fa-file-pdf', title: 'Folder PDF Export', desc: 'Export a folder\'s credentials and notes as a watermarked PDF after re-verifying your master password.', color: 'indigo' },
        { icon: 'fa-key', title: 'Password Generator', desc: 'Generate strong passwords with customizable length, character sets, and real-time strength feedback.', color: 'violet' },
        { icon: 'fa-heart-pulse', title: 'Security Dashboard', desc: 'Vault health score with detection of weak, reused, and outdated passwords across all entries.', color: 'cyan' },
        { icon: 'fa-tags', title: 'Tags & Search', desc: 'Tag credentials for flexible filtering and use global search across services, usernames, and tags.', color: 'rose' },
      ],
    },
    {
      title: 'Account Security',
      subtitle: 'Protect your LockForge account and sessions',
      features: [
        { icon: 'fa-mobile-screen-button', title: 'Two-Factor Authentication', desc: 'Enable TOTP (authenticator app), email OTP, or both. Add, remove, or disable methods individually from Settings.', color: 'amber' },
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
        { icon: 'fa-cloud-arrow-up', title: 'Encrypted Backup', desc: 'Export a full encrypted backup of your vault and restore it on any device with your master password.', color: 'rose' },
        { icon: 'fa-file-export', title: 'PDF Vault Export', desc: 'Generate a formatted, watermarked PDF of your vault or individual folders for offline reference.', color: 'amber' },
        { icon: 'fa-clock-rotate-left', title: 'Activity Logs', desc: 'Audit logins, credential changes, exports, 2FA events, email updates, and session revocations.', color: 'emerald' },
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
