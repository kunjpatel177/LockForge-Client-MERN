import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/guide', label: 'Guide' },
  { to: '/features', label: 'Features' },
  { to: '/security', label: 'Security' },
  { to: '/about', label: 'About' },
];

const DashboardNavbar = ({ onToggleSidebar }) => {
  const { user, logout, lockVault, vaultUnlocked } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLock = async () => {
    await lockVault();
  };

  return (
    <nav className="navbar navbar-glass navbar-dashboard px-3">
      <div className="d-flex align-items-center gap-2">
        <button type="button" className="btn btn-icon d-lg-none" onClick={onToggleSidebar}>
          <i className="fas fa-bars" />
        </button>
        <Link className="brand-logo" to="/dashboard">
          <span className="brand-icon"><i className="fas fa-shield-halved" /></span>
          <span className="d-none d-sm-inline">LockForge</span>
        </Link>
      </div>

      <ul className="navbar-nav flex-row d-none d-lg-flex gap-1 mx-auto">
        {navLinks.map((item) => (
          <li key={item.to} className="nav-item">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link nav-link-modern px-3 py-1 ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
        <li className="nav-item">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link nav-link-modern px-3 py-1 ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
        </li>
      </ul>

      <div className="d-flex align-items-center gap-2">
        {vaultUnlocked && (
          <button type="button" className="btn btn-ghost btn-sm d-none d-md-inline-flex" onClick={handleLock} title="Lock vault">
            <i className="fas fa-lock me-1 mt-1" />Lock
          </button>
        )}
        <button type="button" className="btn btn-icon" onClick={toggleTheme} title="Toggle theme">
          <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} />
        </button>
        <div className="dropdown">
          <button type="button" className="btn btn-ghost btn-sm dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
            <span className="user-avatar">{user?.name?.charAt(0)?.toUpperCase()}</span>
            <span className="d-none d-md-inline">{user?.name?.split(' ')[0]}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li className="dropdown-header d-lg-none">Navigation</li>
            {navLinks.map((item) => (
              <li key={item.to} className="d-lg-none">
                <Link className="dropdown-item" to={item.to}>{item.label}</Link>
              </li>
            ))}
            <li className="d-lg-none"><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
            <li className="d-lg-none"><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item" to="/profile"><i className="fas fa-user me-2" />Profile</Link></li>
            <li><Link className="dropdown-item" to="/settings"><i className="fas fa-cog me-2" />Settings</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button type="button" className="dropdown-item text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2" />Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
