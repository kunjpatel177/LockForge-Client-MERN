import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import BrandLogo from '../../components/BrandLogo';

const VerifyEmailChange = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { refreshProfile, isAuthenticated } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return undefined;
    }

    let cancelled = false;

    authAPI.verifyEmailChange(token)
      .then(async (res) => {
        if (cancelled) return;
        setNewEmail(res.data.data?.email || '');
        setStatus('success');
        setMessage(res.data.message || 'Email changed successfully!');
        if (isAuthenticated) {
          try {
            await refreshProfile();
          } catch {
            /* profile refresh is best-effort */
          }
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setMessage(handleApiError(err).message);
      });

    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="auth-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="auth-card p-4 text-center">
              <div className="auth-brand-logo">
                <BrandLogo size="lg" />
              </div>
              {status === 'loading' && <LoadingSpinner />}
              {status === 'success' && (
                <>
                  <i className="fas fa-check-circle fa-3x text-success mb-3" />
                  <h4>{message}</h4>
                  {newEmail && <p className="text-muted mb-0">Your account email is now <strong>{newEmail}</strong></p>}
                  <Link to={isAuthenticated ? '/profile' : '/login'} className="btn btn-primary mt-3">
                    {isAuthenticated ? 'Go to Profile' : 'Go to Login'}
                  </Link>
                </>
              )}
              {status === 'error' && (
                <>
                  <i className="fas fa-times-circle fa-3x text-danger mb-3" />
                  <h4>{message}</h4>
                  <Link to={isAuthenticated ? '/profile' : '/login'} className="btn btn-primary mt-3">
                    {isAuthenticated ? 'Back to Profile' : 'Go to Login'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailChange;
