import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput';
import BrandLogo from '../../components/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [twoFactorToken, setTwoFactorToken] = useState(null);
  const [twoFactorMethods, setTwoFactorMethods] = useState([]);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { login, verifyTwoFactor, resendTwoFactor } = useAuth();
  const navigate = useNavigate();

  const hasEmail = twoFactorMethods.includes('email');
  const hasTotp = twoFactorMethods.includes('totp');
  const hasBoth = hasEmail && hasTotp;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (result?.requiresTwoFactor) {
        const methods = result.twoFactorMethods || [];
        setTwoFactorToken(result.twoFactorToken);
        setTwoFactorMethods(methods);
        setMaskedEmail(result.maskedEmail || '');
        if (methods.includes('email') && methods.includes('totp')) {
          toast.info('A code was sent to your email, or use your authenticator app');
        } else if (methods.includes('email')) {
          toast.info('A verification code was sent to your email');
        } else {
          toast.info('Enter the code from your authenticator app');
        }
        return;
      }
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const { message, status } = handleApiError(err);
      toast.error(status === 429 ? 'Too many attempts. Please wait.' : message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTwoFactor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyTwoFactor(twoFactorToken, code);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const { message, status } = handleApiError(err);
      toast.error(status === 429 ? 'Too many attempts. Please wait.' : message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      const data = await resendTwoFactor(twoFactorToken);
      setMaskedEmail(data.maskedEmail || maskedEmail);
      toast.success('A new verification code has been sent');
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setResending(false);
    }
  };

  const resetToLogin = () => {
    setTwoFactorToken(null);
    setTwoFactorMethods([]);
    setMaskedEmail('');
    setCode('');
  };

  return (
    <div className="auth-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="auth-card p-4">
              <div className="text-center mb-4">
                {twoFactorToken ? (
                  <i className={`fas ${hasEmail ? 'fa-envelope-circle-check' : 'fa-mobile-screen-button'} fa-3x text-primary mb-3`} />
                ) : (
                  <div className="auth-brand-logo">
                    <BrandLogo size="lg" />
                  </div>
                )}
                <h2 className="fw-bold">{twoFactorToken ? 'Verify Your Identity' : 'Welcome Back'}</h2>
                <p className="text-muted">
                  {twoFactorToken
                    ? hasBoth
                      ? 'Enter a code from your email or authenticator app'
                      : hasEmail
                        ? 'Enter the 6-digit code sent to your registered email'
                        : 'Enter the 6-digit code from your authenticator app'
                    : 'Sign in to your LockForge account'}
                </p>
              </div>

              {twoFactorToken ? (
                <form onSubmit={handleVerifyTwoFactor}>
                  {hasEmail && maskedEmail && (
                    <div className="two-factor-email-hint text-center mb-3">
                      <small className="text-muted d-block">Code sent to</small>
                      <strong>{maskedEmail}</strong>
                    </div>
                  )}
                  {hasBoth && (
                    <p className="small text-muted text-center mb-3">
                      You can use either your email code or authenticator app code.
                    </p>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Verification Code</label>
                    <input
                      type="text"
                      className="form-control text-center"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      required
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading || code.length !== 6}>
                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                  </button>
                  {hasEmail && (
                    <button
                      type="button"
                      className="btn btn-ghost w-100 mb-2"
                      onClick={handleResendCode}
                      disabled={loading || resending}
                    >
                      {resending ? 'Sending...' : 'Resend email code'}
                    </button>
                  )}
                  <button type="button" className="btn btn-ghost w-100" onClick={resetToLogin} disabled={loading}>
                    Back to sign in
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <PasswordInput
                      className="form-control"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <Link to="/forgot-password" className="text-decoration-none small">Forgot password?</Link>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              )}

              {!twoFactorToken && (
                <p className="text-center mt-3 mb-0 text-muted">
                  Don&apos;t have an account? <Link to="/register">Register</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
