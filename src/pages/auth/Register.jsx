import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import PasswordInput from '../../components/PasswordInput';
import BrandLogo from '../../components/BrandLogo';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', masterPassword: '', confirmPassword: '', confirmMaster: '' });
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.masterPassword !== form.confirmMaster) return toast.error('Master passwords do not match');
    submittingRef.current = true;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, masterPassword: form.masterPassword });
      toast.success('Account created! Please verify your email.');
      navigate('/dashboard');
    } catch (err) {
      const { message } = handleApiError(err);
      toast.error(message || err.message || 'Registration failed');
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="auth-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="auth-card p-4">
              <div className="text-center mb-4">
                <div className="auth-brand-logo">
                  <BrandLogo size="lg" />
                </div>
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Start securing your passwords with LockForge</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Account Password</label>
                    <PasswordInput className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" required />
                    <small className="text-muted">Min 8 chars, uppercase, lowercase, number, special char</small>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password</label>
                    <PasswordInput className="form-control" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirm your password" required />
                  </div>
                </div>
                <div className="alert alert-info small">
                  <i className="fas fa-info-circle me-1" />
                  Your <strong>master password</strong> encrypts your vault. It cannot be recovered if lost.
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Master Password</label>
                    <PasswordInput className="form-control" value={form.masterPassword} onChange={(e) => setForm({ ...form, masterPassword: e.target.value })} placeholder="Enter master password" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Master Password</label>
                    <PasswordInput className="form-control" value={form.confirmMaster} onChange={(e) => setForm({ ...form, confirmMaster: e.target.value })} placeholder="Confirm master password" required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
              <p className="text-center mt-3 mb-0 text-muted">
                Already have an account? <Link to="/login">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
