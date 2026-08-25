import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PublicNavbar = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar navbar-expand-lg navbar-glass sticky-top">
      <div className="container">
        <Link className="navbar-brand brand-logo" to="/">
          <span className="brand-icon"><i className="fas fa-shield-halved" /></span>
          LockForge
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto gap-lg-1">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/guide', label: 'Guide' },
              { to: '/features', label: 'Features' },
              { to: '/security', label: 'Security' },
              { to: '/about', label: 'About' },
            ].map((item) => (
              <li key={item.to} className="nav-item">
                <NavLink className="nav-link nav-link-modern" to={item.to} end={item.end}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2 mt-3 mt-lg-0 navbar-mobile-actions">
            <button className="btn btn-icon align-self-sm-center" onClick={toggleTheme} title="Toggle theme" type="button">
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} />
            </button>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-modern w-100 w-sm-auto">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost w-100 w-sm-auto">Login</Link>
                <Link to="/register" className="btn btn-primary btn-modern w-100 w-sm-auto">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
