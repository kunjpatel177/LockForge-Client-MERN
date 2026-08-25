import PageHero from '../../components/PageHero';
import AuthCTA from '../../components/AuthCTA';

const Features = () => {
  const features = [
    { icon: 'fa-vault', title: 'Secure Password Vault', desc: 'Store all your credentials in an encrypted vault protected by your master password.', color: 'indigo' },
    { icon: 'fa-lock', title: 'AES-256-GCM Encryption', desc: 'Industry-standard authenticated encryption ensures your data remains confidential and tamper-proof.', color: 'violet' },
    { icon: 'fa-key', title: 'Password Generator', desc: 'Generate strong, unique passwords with customizable length and character sets.', color: 'cyan' },
    { icon: 'fa-pen-to-square', title: 'Custom Fields', desc: 'Add custom fields to credentials for security questions, PINs, and more.', color: 'rose' },
    { icon: 'fa-folder', title: 'Folders', desc: 'Organize credentials into folders like Personal, Work, Banking, and more.', color: 'amber' },
    { icon: 'fa-sticky-note', title: 'Secure Notes', desc: 'Store encrypted notes for sensitive information beyond passwords.', color: 'emerald' },
    { icon: 'fa-star', title: 'Favorites', desc: 'Quickly access your most-used credentials with favorites.', color: 'indigo' },
    { icon: 'fa-heart-pulse', title: 'Password Health', desc: 'Identify weak, reused, and outdated passwords with the security dashboard.', color: 'violet' },
    { icon: 'fa-clock-rotate-left', title: 'Activity Logs', desc: 'Monitor all security events including logins, credential changes, and exports.', color: 'cyan' },
    { icon: 'fa-cloud-arrow-up', title: 'Secure Backup', desc: 'Export encrypted backups and restore your vault when needed.', color: 'rose' },
    { icon: 'fa-desktop', title: 'Session Management', desc: 'View and revoke active sessions across all your devices.', color: 'amber' },
    { icon: 'fa-mobile-screen', title: '2FA/TOTP Support', desc: 'Two-factor authentication support for enhanced account security.', color: 'emerald' },
  ];

  return (
    <div>
      <PageHero
        badge="Platform Features"
        title="Powerful tools for"
        highlight="complete security"
        subtitle="Everything you need to generate, store, organize, and monitor your passwords — in one secure platform."
      />
      <section className="section-modern py-5">
        <div className="container">
          <div className="row g-4">
            {features.map((f) => (
              <div key={f.title} className="col-md-6 col-lg-4">
                <div className={`modern-card modern-card-${f.color} h-100`}>
                  <div className="card-icon-wrap"><i className={`fas ${f.icon}`} /></div>
                  <h5 className="card-title-modern">{f.title}</h5>
                  <p className="card-desc mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <AuthCTA
              loggedOutLabel="Start Using LockForge"
              loggedInLabel="Go to Dashboard"
              className="btn btn-primary btn-modern btn-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
