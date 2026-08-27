import { NavLink } from 'react-router-dom';

const navSections = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', icon: 'fa-gauge-high', label: 'Dashboard', end: true },
      { to: '/vault', icon: 'fa-vault', label: 'Vault' },
      { to: '/vault/add', icon: 'fa-plus', label: 'Add Credential' },
      { to: '/folders', icon: 'fa-folder', label: 'Folders' },
      { to: '/favorites', icon: 'fa-star', label: 'Favorites' },
      { to: '/notes', icon: 'fa-sticky-note', label: 'Secure Notes' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { to: '/generator', icon: 'fa-wand-magic-sparkles', label: 'Password Generator' },
      { to: '/security-dashboard', icon: 'fa-shield-halved', label: 'Security Dashboard' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/sessions', icon: 'fa-desktop', label: 'Active Sessions' },
      { to: '/activity', icon: 'fa-clock-rotate-left', label: 'Activity Logs' },
      { to: '/backup', icon: 'fa-cloud-arrow-up', label: 'Backup & Restore' },
      { to: '/trash', icon: 'fa-trash', label: 'Trash' },
      { to: '/profile', icon: 'fa-user', label: 'Profile' },
      { to: '/settings', icon: 'fa-cog', label: 'Settings' },
    ],
  },
];

const Sidebar = ({ show, onClose }) => (
  <aside
    className={`sidebar ${show ? 'show' : ''}`}
    aria-hidden={!show}
    aria-label="Dashboard navigation"
  >
    <div className="sidebar-header d-lg-none">
      <span className="fw-bold">Menu</span>
      <button type="button" className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
        <i className="fas fa-times" />
      </button>
    </div>
    <nav className="sidebar-nav">
      {navSections.map((section, idx) => (
        <div key={section.label}>
          {idx > 0 && <div className="sidebar-divider" />}
          <div className="sidebar-section-label">{section.label}</div>
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className={`fas ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
