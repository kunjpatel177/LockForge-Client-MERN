import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import BrandLogo from '../../components/BrandLogo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('If that email exists, a reset link has been sent.');
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="auth-card p-4">
              <div className="text-center mb-4">
                {!sent && (
                  <div className="auth-brand-logo">
                    <BrandLogo size="lg" />
                  </div>
                )}
                <h2 className="fw-bold">Forgot Password</h2>
              </div>
              {sent ? (
                <div className="text-center">
                  <i className="fas fa-envelope fa-3x text-primary mb-3" />
                  <p>Check your email for a password reset link.</p>
                  <Link to="/login" className="btn btn-primary">Back to Login</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-muted">Enter your email and we&apos;ll send you a reset link.</p>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <p className="text-center mt-3"><Link to="/login">Back to Login</Link></p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
