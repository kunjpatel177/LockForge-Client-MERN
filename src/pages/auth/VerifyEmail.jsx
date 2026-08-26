import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import BrandLogo from '../../components/BrandLogo';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('No verification token provided.'); return; }
    authAPI.verifyEmail(token)
      .then(() => { setStatus('success'); setMessage('Email verified successfully!'); })
      .catch((err) => { setStatus('error'); setMessage(handleApiError(err).message); });
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
                  <Link to="/dashboard" className="btn btn-primary mt-3">Go to Dashboard</Link>
                </>
              )}
              {status === 'error' && (
                <>
                  <i className="fas fa-times-circle fa-3x text-danger mb-3" />
                  <h4>{message}</h4>
                  <Link to="/login" className="btn btn-primary mt-3">Go to Login</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
