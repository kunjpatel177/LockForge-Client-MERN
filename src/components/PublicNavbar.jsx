import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/guide', label: 'Guide' },
  { to: '/features', label: 'Features' },
  { to: '/security', label: 'Security' },
  { to: '/about', label: 'About' },
];

const closeMobileMenu = () => {
  const el = document.getElementById('publicNavMenu');
  if (!el?.classList.contains('show')) return;
  const Collapse = window.bootstrap?.Collapse;
  if (Collapse) {
    Collapse.getOrCreateInstance(el).hide();
  } else {
    el.classList.remove('show');
  }
};

const PublicNavbar = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar-pro navbar-expand-lg">
      <div className="container navbar-pro-container">
        <Link className="navbar-pro-brand" to="/" onClick={closeMobileMenu}>
          <span className="brand-icon"><i className="fas fa-shield-halved" /></span>
          <span>LockForge</span>
        </Link>

        <button
          className="navbar-pro-toggle d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNavMenu"
          aria-controls="publicNavMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>

        <div className="collapse navbar-collapse navbar-pro-collapse" id="publicNavMenu">
          <nav className="navbar-pro-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `navbar-pro-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-pro-actions">
            <button
              type="button"
              className="navbar-pro-icon-btn"
              onClick={toggleTheme}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} />
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-modern navbar-pro-cta" onClick={closeMobileMenu}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost navbar-pro-cta" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-modern navbar-pro-cta" onClick={closeMobileMenu}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
