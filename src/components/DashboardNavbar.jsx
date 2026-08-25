import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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

  const initials = user?.name?.charAt(0)?.toUpperCase() || 'U';
  const firstName = user?.name?.split(' ')[0] || 'Account';

  return (
    <header className="navbar-pro navbar-pro-dashboard">
      <div className="navbar-pro-container navbar-pro-dashboard-inner">
        <div className="navbar-pro-left">
          <button
            type="button"
            className="navbar-pro-icon-btn d-lg-none"
            onClick={onToggleSidebar}
            aria-label="Open menu"
          >
            <i className="fas fa-bars" />
          </button>
          <Link className="navbar-pro-brand" to="/">
            <span className="brand-icon"><i className="fas fa-shield-halved" /></span>
            <span className="d-none d-sm-inline">LockForge</span>
          </Link>
        </div>

        <div className="navbar-pro-right">
          {vaultUnlocked && (
            <button
              type="button"
              className="btn btn-ghost btn-sm navbar-pro-lock d-none d-md-inline-flex"
              onClick={handleLock}
              title="Lock vault"
            >
              <i className="fas fa-lock" />
              <span>Lock</span>
            </button>
          )}

          <button
            type="button"
            className="navbar-pro-icon-btn"
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} />
          </button>

          <div className="dropdown">
            <button
              type="button"
              className="navbar-pro-user-btn dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="user-avatar">{initials}</span>
              <span className="navbar-pro-user-name d-none d-md-inline">{firstName}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end navbar-pro-dropdown">
              <li className="dropdown-header">
                <strong>{user?.name}</strong>
                <small className="d-block text-muted">{user?.email}</small>
              </li>
              <li><hr className="dropdown-divider" /></li>
              {vaultUnlocked && (
                <li className="d-md-none">
                  <button type="button" className="dropdown-item" onClick={handleLock}>
                    <i className="fas fa-lock me-2" />Lock Vault
                  </button>
                </li>
              )}
              <li><Link className="dropdown-item" to="/profile"><i className="fas fa-user me-2" />Profile</Link></li>
              <li><Link className="dropdown-item" to="/settings"><i className="fas fa-cog me-2" />Settings</Link></li>
              <li><Link className="dropdown-item" to="/"><i className="fas fa-globe me-2" />Home</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2" />Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
