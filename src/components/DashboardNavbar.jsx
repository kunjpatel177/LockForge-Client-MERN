import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from './BrandLogo';

const DashboardNavbar = ({ onToggleSidebar, onUnlock }) => {
  const { user, logout, lockVault, vaultUnlocked } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on route change
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setUserDropdownOpen(false);
  }

  // Close on Escape key
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setUserDropdownOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userDropdownOpen]);

  // Close on click outside
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userDropdownOpen]);

  const closeDropdown = () => setUserDropdownOpen(false);

  const handleLogout = async () => {
    closeDropdown();
    await logout();
    navigate('/login');
  };

  const handleLock = async () => {
    closeDropdown();
    await lockVault();
  };

  const handleUnlock = () => {
    closeDropdown();
    if (onUnlock) onUnlock();
  };

  const initials = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';
  const firstName = user?.name ? user.name.trim().split(' ')[0] : 'Account';
  const fullName = user?.name || 'User Account';
  const email = user?.email || '';

  return (
    <header className="navbar-pro navbar-pro-dashboard">
      <div className="navbar-pro-container navbar-pro-dashboard-inner">
        {/* Left: Mobile Toggle & Brand Identity */}
        <div className="navbar-pro-left">
          <button
            type="button"
            className="navbar-pro-icon-btn d-lg-none"
            onClick={onToggleSidebar}
            aria-label="Open sidebar menu"
            title="Toggle Menu"
          >
            <i className="fas fa-bars" />
          </button>

          <Link className="navbar-pro-brand" to="/dashboard" title="LockForge Dashboard">
            <span className="brand-icon">
              <BrandLogo size="sm" />
            </span>
            <span className="navbar-brand-name">LockForge</span>
          </Link>
        </div>

        {/* Right: Security Status, Quick Action, Theme, Profile */}
        <div className="navbar-pro-right">
          {/* Desktop/Tablet Vault Security Status Pill */}
          {vaultUnlocked ? (
            <div className="navbar-vault-pill unlocked d-none d-sm-inline-flex" title="Vault is decrypted in this session">
              <span className="vault-pulse-dot pulse-green" />
              <span className="vault-pill-label d-none d-md-inline">Unlocked</span>
              <button
                type="button"
                className="navbar-pill-lock-btn"
                onClick={handleLock}
                title="Lock vault immediately"
                aria-label="Lock vault"
              >
                <i className="fas fa-lock" />
                <span className="d-none d-lg-inline ms-1">Lock</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="navbar-vault-pill locked d-none d-sm-inline-flex"
              onClick={onUnlock}
              title="Vault is locked. Click to unlock."
            >
              <i className="fas fa-unlock-keyhole text-warning" />
              <span className="vault-pill-label d-none d-md-inline ms-1">Unlock</span>
            </button>
          )}

          {/* Activity Logs Shortcut (Desktop only) */}
          <Link
            to="/activity"
            className="navbar-pro-icon-btn d-none d-lg-inline-flex"
            title="Activity logs & audit trail"
            aria-label="Activity logs"
          >
            <i className="fas fa-clock-rotate-left" />
          </Link>

          {/* Theme Switcher Button (Desktop/Tablet) */}
          <button
            type="button"
            className="navbar-pro-icon-btn navbar-theme-btn d-none d-sm-inline-flex"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme"
          >
            <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun text-warning'}`} />
          </button>

          {/* User Profile Dropdown */}
          <div className={`dropdown ${userDropdownOpen ? 'show' : ''}`} ref={dropdownRef}>
            <button
              type="button"
              className={`navbar-pro-user-btn dropdown-toggle ${userDropdownOpen ? 'show' : ''}`}
              aria-expanded={userDropdownOpen}
              aria-haspopup="true"
              aria-label="User account menu"
              onClick={() => setUserDropdownOpen((prev) => !prev)}
            >
              <div className="navbar-avatar-wrapper">
                <span className="user-avatar navbar-avatar">{initials}</span>
                <span className={`navbar-status-badge ${vaultUnlocked ? 'online' : 'locked'}`} />
              </div>
              <div className="navbar-user-text d-none d-md-flex">
                <span className="navbar-pro-user-name">{firstName}</span>
                <span className="navbar-pro-user-role d-none d-lg-block">{vaultUnlocked ? 'Enclave Active' : 'Locked'}</span>
              </div>
              <i className="fas fa-chevron-down navbar-user-chevron" />
            </button>

            <div className={`dropdown-menu dropdown-menu-end navbar-pro-dropdown ${userDropdownOpen ? 'show' : ''}`}>
              <div className="navbar-dropdown-inner">
                {/* Dropdown Header Card */}
                <div className="navbar-dropdown-profile-header">
                  <div className="d-flex align-items-center gap-3">
                    <div className="navbar-avatar-lg">
                      {initials}
                    </div>
                    <div className="navbar-profile-meta">
                      <div className="navbar-profile-name">{fullName}</div>
                      <div className="navbar-profile-email" title={email}>{email}</div>
                    </div>
                  </div>
                  <div className="navbar-profile-badge-row mt-2">
                    <span className={`navbar-status-pill-subtle ${vaultUnlocked ? 'success' : 'warning'}`}>
                      <i className={`fas ${vaultUnlocked ? 'fa-shield-halved' : 'fa-lock'} me-1`} />
                      {vaultUnlocked ? 'Vault Decrypted' : 'Vault Locked'}
                    </span>
                  </div>
                </div>

                {/* ─── Smartphone Exclusive Section ─── */}
                <div className="navbar-mobile-card d-md-none">
                  {/* Smartphone Vault Enclave Control */}
                  <div className="navbar-mobile-vault-status">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className={`vault-pulse-dot ${vaultUnlocked ? 'pulse-green' : 'pulse-amber'}`} />
                        <span className="fw-bold small dropdown-appearance-text ms-1">{vaultUnlocked ? 'Vault Decrypted' : 'Vault Locked'}</span>
                      </div>
                      <span className="badge-vault-crypto">AES-256</span>
                    </div>
                    {vaultUnlocked ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning w-100 d-flex align-items-center justify-content-center gap-2 navbar-mobile-lock-btn"
                        onClick={handleLock}
                      >
                        <i className="fas fa-lock" />
                        <span>Lock Vault Now</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-warning w-100 d-flex align-items-center justify-content-center gap-2 text-dark fw-bold navbar-mobile-unlock-btn"
                        onClick={handleUnlock}
                      >
                        <i className="fas fa-unlock-keyhole" />
                        <span>Unlock Vault</span>
                      </button>
                    )}
                  </div>

                  {/* Smartphone Quick Action: Add Item */}
                  <div className="mt-2">
                    <Link
                      to="/vault/add"
                      className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2 navbar-mobile-add-btn"
                      onClick={closeDropdown}
                    >
                      <i className="fas fa-plus" />
                      <span>New Credential</span>
                    </Link>
                  </div>

                  {/* Smartphone Theme Switcher Row */}
                  <div className="navbar-mobile-theme-row mt-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`fas ${theme === 'light' ? 'fa-sun text-warning' : 'fa-moon text-primary'} mobile-theme-icon`} />
                      <span className="small fw-semibold dropdown-appearance-text">Appearance</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm navbar-mobile-theme-toggle"
                      onClick={toggleTheme}
                      aria-label="Toggle color theme"
                    >
                      <span className="me-1">{theme === 'light' ? 'Light' : 'Dark'}</span>
                      <i className={`fas ${theme === 'light' ? 'fa-toggle-off text-muted' : 'fa-toggle-on text-primary'}`} />
                    </button>
                  </div>
                </div>

                <div className="dropdown-divider my-1" />

                {/* Smartphone Quick Tools Grid */}
                <div className="d-md-none">
                  <div className="navbar-dropdown-section-label">Quick Tools</div>
                  <div className="navbar-mobile-tools-grid">
                    <Link to="/generator" className="navbar-tool-chip" onClick={closeDropdown}>
                      <i className="fas fa-wand-magic-sparkles text-primary" />
                      <span>Generator</span>
                    </Link>
                    <Link to="/notes" className="navbar-tool-chip" onClick={closeDropdown}>
                      <i className="fas fa-sticky-note text-warning" />
                      <span>Notes</span>
                    </Link>
                    <Link to="/activity" className="navbar-tool-chip" onClick={closeDropdown}>
                      <i className="fas fa-clock-rotate-left text-info" />
                      <span>Activity</span>
                    </Link>
                  </div>
                  <div className="dropdown-divider my-1" />
                </div>

                {/* Workspace Navigation */}
                <div className="navbar-dropdown-section-label">Workspace</div>
                <Link className="dropdown-item" to="/dashboard" onClick={closeDropdown}>
                  <i className="fas fa-gauge-high dropdown-icon" />
                  <span>Dashboard</span>
                </Link>
                <Link className="dropdown-item" to="/vault" onClick={closeDropdown}>
                  <i className="fas fa-vault dropdown-icon" />
                  <span>Vault Credentials</span>
                </Link>
                <Link className="dropdown-item" to="/hidden" onClick={closeDropdown}>
                  <i className="fas fa-eye-slash dropdown-icon text-secondary" />
                  <span>Hidden Items</span>
                </Link>
                <Link className="dropdown-item" to="/security-dashboard" onClick={closeDropdown}>
                  <i className="fas fa-shield-halved dropdown-icon text-info" />
                  <span>Security Health</span>
                </Link>

                <div className="dropdown-divider my-1" />

                {/* Account Settings */}
                <div className="navbar-dropdown-section-label">Account</div>
                <Link className="dropdown-item" to="/profile" onClick={closeDropdown}>
                  <i className="fas fa-user-shield dropdown-icon" />
                  <span>User Profile</span>
                </Link>
                <Link className="dropdown-item" to="/sessions" onClick={closeDropdown}>
                  <i className="fas fa-desktop dropdown-icon" />
                  <span>Active Sessions</span>
                </Link>
                <Link className="dropdown-item" to="/settings" onClick={closeDropdown}>
                  <i className="fas fa-sliders dropdown-icon" />
                  <span>Settings & Security</span>
                </Link>

                <div className="dropdown-divider my-1" />

                {/* Public Site Link */}
                <Link className="dropdown-item" to="/" onClick={closeDropdown}>
                  <i className="fas fa-arrow-up-right-from-square dropdown-icon text-muted" />
                  <span>Landing Page</span>
                </Link>

                {/* Desktop Lock button in menu */}
                <div className="d-none d-md-block">
                  {vaultUnlocked ? (
                    <button type="button" className="dropdown-item text-warning" onClick={handleLock}>
                      <i className="fas fa-lock dropdown-icon text-warning" />
                      <span>Lock Vault Now</span>
                    </button>
                  ) : (
                    <button type="button" className="dropdown-item text-primary" onClick={handleUnlock}>
                      <i className="fas fa-unlock-keyhole dropdown-icon text-primary" />
                      <span>Unlock Vault</span>
                    </button>
                  )}
                  <div className="dropdown-divider my-1" />
                </div>

                {/* Logout */}
                <button type="button" className="dropdown-item dropdown-item-danger text-danger" onClick={handleLogout}>
                  <i className="fas fa-arrow-right-from-bracket dropdown-icon text-danger" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
