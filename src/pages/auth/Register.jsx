import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import PasswordInput from '../../components/PasswordInput';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', masterPassword: '', confirmPassword: '', confirmMaster: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.masterPassword !== form.confirmMaster) return toast.error('Master passwords do not match');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, masterPassword: form.masterPassword });
      toast.success('Account created! Please verify your email.');
      navigate('/dashboard');
    } catch (err) {
      const { message } = handleApiError(err);
      toast.error(message);
    } finally {
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
                <i className="fas fa-shield-halved fa-3x text-primary mb-3" />
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Start securing your passwords with LockForge</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Account Password</label>
                    <PasswordInput className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                    <small className="text-muted">Min 8 chars, uppercase, lowercase, number, special char</small>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password</label>
                    <PasswordInput className="form-control" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
                  </div>
                </div>
                <div className="alert alert-info small">
                  <i className="fas fa-info-circle me-1" />
                  Your <strong>master password</strong> encrypts your vault. It cannot be recovered if lost.
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Master Password</label>
                    <PasswordInput className="form-control" value={form.masterPassword} onChange={(e) => setForm({ ...form, masterPassword: e.target.value })} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Master Password</label>
                    <PasswordInput className="form-control" value={form.confirmMaster} onChange={(e) => setForm({ ...form, confirmMaster: e.target.value })} required />
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
