import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from './BrandLogo';

const navItems = [
  { to: '/', label: 'Home', end: true, icon: 'fa-house' },
  { to: '/guide', label: 'Guide', icon: 'fa-book-open' },
  { to: '/features', label: 'Features', icon: 'fa-layer-group' },
  { to: '/security', label: 'Security', icon: 'fa-shield-halved' },
  { to: '/about', label: 'About', icon: 'fa-circle-info' },
];

const PublicNavbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => (typeof window !== 'undefined' ? window.scrollY > 12 : false));
  const navRef = useRef(null);
  const location = useLocation();

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsOpen(false);
  }

  // Track window scroll for elevated shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on click outside navbar on mobile
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <header
      className={`navbar-pro navbar-expand-lg ${scrolled ? 'scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}
      ref={navRef}
    >
      <div className="container navbar-pro-container">
        {/* Brand identity */}
        <Link className="navbar-pro-brand" to="/" onClick={() => setIsOpen(false)} title="LockForge Home">
          <span className="brand-icon">
            <BrandLogo size="sm" />
          </span>
          <span className="navbar-brand-name">LockForge</span>
        </Link>

        {/* Mobile controls (Quick Theme toggle + Animated Hamburger) */}
        <div className="navbar-pro-mobile-controls d-lg-none">
          <button
            type="button"
            className="navbar-pro-icon-btn navbar-theme-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme"
          >
            <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun text-warning'}`} />
          </button>

          <button
            className={`navbar-pro-toggle ${isOpen ? 'active' : ''}`}
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-controls="publicNavMenu"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Navigation Dropdown Collapse */}
        <div
          className={`collapse navbar-collapse navbar-pro-collapse ${isOpen ? 'show' : ''}`}
          id="publicNavMenu"
        >
          <div className="navbar-pro-collapse-inner">
            <nav className="navbar-pro-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `navbar-pro-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="navbar-pro-link-left">
                    <i className={`fas ${item.icon} navbar-pro-link-icon d-lg-none`} />
                    <span>{item.label}</span>
                  </span>
                  <i className="fas fa-chevron-right navbar-pro-link-arrow d-lg-none" />
                </NavLink>
              ))}
            </nav>

            <div className="navbar-pro-actions">
              {/* Desktop Theme Switcher */}
              <button
                type="button"
                className="navbar-pro-icon-btn navbar-theme-btn d-none d-lg-inline-flex"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                aria-label="Toggle theme"
              >
                <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun text-warning'}`} />
              </button>

              {/* Mobile Theme Switcher Row inside dropdown */}
              {/* <div className="navbar-mobile-theme-row d-lg-none">
                <div className="d-flex align-items-center gap-2">
                  <i className={`fas ${theme === 'light' ? 'fa-moon text-primary' : 'fa-sun text-warning'}`} />
                  <span className="small fw-semibold">{theme === 'light' ? 'Dark Theme' : 'Light Theme'}</span>
                </div>
                <button
                  type="button"
                  className="navbar-mobile-theme-pill"
                  onClick={toggleTheme}
                >
                  <span>Switch to {theme === 'light' ? 'Dark' : 'Light'}</span>
                </button>
              </div> */}

              {/* Authentication Actions */}
              {isAuthenticated ? (
                <div className="navbar-pro-cta-group">
                  <div className="navbar-mobile-user-status d-lg-none">
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-card border border-border">
                      <div className="d-flex align-items-center gap-2">
                        <span className="user-avatar" style={{ width: 30, height: 30, fontSize: '0.8rem' }}>
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                        <div className="text-truncate" style={{ maxWidth: 160 }}>
                          <div className="fw-semibold small text-truncate">{user?.name || 'Account'}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>Logged in</div>
                        </div>
                      </div>
                      <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.7rem' }}>
                        <i className="fas fa-circle-check me-1" />Ready
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="btn btn-primary btn-modern navbar-pro-cta"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fas fa-gauge-high d-none d-lg-inline me-1" />
                    <span>Dashboard</span>
                    <i className="fas fa-arrow-right ms-1" style={{ fontSize: '0.75rem' }} />
                  </Link>
                </div>
              ) : (
                <div className="navbar-pro-cta-group">
                  <Link
                    to="/login"
                    className="btn btn-ghost navbar-pro-cta"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-modern navbar-pro-cta"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Get Started</span>
                    <i className="fas fa-arrow-right ms-1" style={{ fontSize: '0.75rem' }} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
