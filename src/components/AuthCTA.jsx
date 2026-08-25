import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Renders a dashboard link when logged in, or a sign-up/login link when logged out.
 */
const AuthCTA = ({
  loggedOutTo = '/register',
  loggedOutLabel = 'Get Started',
  loggedOutIcon = 'fa-rocket',
  loggedInTo = '/dashboard',
  loggedInLabel = 'Go to Dashboard',
  loggedInIcon = 'fa-gauge-high',
  className = 'btn btn-primary btn-modern',
  showIcon = true,
}) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Link to={loggedInTo} className={className}>
        {showIcon}
        {/* {showIcon && <i className={`fas ${loggedInIcon} me-2`} />} */}
        {loggedInLabel}
      </Link>
    );
  }

  return (
    <Link to={loggedOutTo} className={className}>
      {showIcon && <i className={`fas ${loggedOutIcon} me-2`} />}
      {loggedOutLabel}
    </Link>
  );
};

export default AuthCTA;
