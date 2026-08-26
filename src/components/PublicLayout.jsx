import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from './PublicNavbar';
import AuthCTA from './AuthCTA';
import BrandLogo from './BrandLogo';

const PublicLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="public-layout">
      <PublicNavbar />
      <main><Outlet /></main>
      <footer className="footer-modern">
        <div className="container">
          <div className="row g-4 py-5">
            <div className="col-lg-4">
              <div className="brand-logo mb-3">
                <span className="brand-icon"><BrandLogo size="sm" /></span>
                LockForge
              </div>
              <p className="footer-desc">Enterprise-grade password security for everyone. Encrypt, organize, and protect your digital life with confidence.</p>
              <div className="footer-social">
                {/* <a href="#" aria-label="Twitter"><i className="fab fa-x-twitter" /></a> */}
                {/* <a href="#" aria-label="GitHub"><i className="fab fa-github" /></a>
                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
                <a href="#" aria-label="Gmail"><i className="fas fa-envelope" /></a> */}
                <a href="https://github.com/kunjpatel177" target="_blank" aria-label="GitHub"><i className="fab fa-github" /></a>
                <a href="https://www.linkedin.com/in/kunjpatel177/" target="_blank" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
                <a href="mailto:kunjmpatel1774@gmail.com" aria-label="Gmail"><i className="fas fa-envelope" /></a>
                
              </div>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="footer-heading">Product</h6>
              <ul className="footer-links">
                <li><Link to="/guide">User Guide</Link></li>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/security">Security</Link></li>
                <li>
                  {isAuthenticated ? (
                    <Link to="/dashboard">Dashboard</Link>
                  ) : (
                    <Link to="/register">Get Started</Link>
                  )}
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="footer-heading">Company</h6>
              <ul className="footer-links">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/security">Trust Center</Link></li>
              </ul>
            </div>
            <div className="col-md-6 col-lg-4">
              <h6 className="footer-heading">{isAuthenticated ? 'Your Vault' : 'Stay Secure'}</h6>
              <p className="footer-desc small">
                {isAuthenticated
                  ? 'Manage your credentials, security health, and settings from your dashboard.'
                  : 'Start protecting your credentials in under 2 minutes.'}
              </p>
              <AuthCTA
                loggedOutLabel="Create Free Account"
                loggedInLabel="Open Dashboard"
                className="btn btn-primary btn-modern"
              />
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} LockForge · Created by <Link to="/about">Kunj Patel</Link></p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
