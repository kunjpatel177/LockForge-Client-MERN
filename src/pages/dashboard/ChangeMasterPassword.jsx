import { useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import DashboardPageHeader from '../../components/DashboardPageHeader';

const ChangeMasterPassword = () => {
  const [form, setForm] = useState({ currentMasterPassword: '', newMasterPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newMasterPassword !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await userAPI.changeMasterPassword({
        currentMasterPassword: form.currentMasterPassword,
        newMasterPassword: form.newMasterPassword,
      });
      toast.success('Master password changed. All credentials re-encrypted.');
      setForm({ currentMasterPassword: '', newMasterPassword: '', confirm: '' });
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <DashboardPageHeader
        icon="fa-key"
        title="Change Master Password"
        subtitle="Your master password encrypts all vault data"
        breadcrumb={<Link to="/settings"><i className="fas fa-arrow-left me-1" />Back to Settings</Link>}
      />

      <div className="alert alert-warning d-flex align-items-start gap-2 mb-4">
        <i className="fas fa-triangle-exclamation mt-1" />
        <div>
          <strong>Important:</strong> Changing your master password will re-encrypt all vault data.
          Make sure you remember the new password — it cannot be recovered.
        </div>
      </div>

      <div className="settings-card" style={{ maxWidth: 520 }}>
        <div className="settings-card-header">
          <div className="settings-card-icon"><i className="fas fa-shield-halved" /></div>
          <div>
            <h5 className="fw-bold mb-0">Update Master Password</h5>
            <small className="text-muted">Enter your current and new master password</small>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="settings-card-body">
          <div className="mb-3">
            <label className="form-label">Current Master Password</label>
            <input type="password" className="form-control form-control-modern" value={form.currentMasterPassword} onChange={(e) => setForm({ ...form, currentMasterPassword: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">New Master Password</label>
            <input type="password" className="form-control form-control-modern" value={form.newMasterPassword} onChange={(e) => setForm({ ...form, newMasterPassword: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm New Master Password</label>
            <input type="password" className="form-control form-control-modern" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary btn-modern" disabled={loading}>
            {loading ? 'Changing...' : 'Change Master Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeMasterPassword;
