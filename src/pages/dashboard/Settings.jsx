import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { userAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import DashboardPageHeader from '../../components/DashboardPageHeader';

const Settings = () => {
  const { user, refreshProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [autoLock, setAutoLock] = useState(user?.settings?.autoLockMinutes || 15);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile({ settings: { theme, autoLockMinutes: autoLock } });
      await refreshProfile();
      toast.success('Settings saved');
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <DashboardPageHeader
        icon="fa-cog"
        title="Settings"
        subtitle="Customize your LockForge experience and security preferences"
      />

      <div className="row g-4">
        <div className="col-md-6">
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon"><i className="fas fa-palette" /></div>
              <div>
                <h5 className="fw-bold mb-0">Appearance</h5>
                <small className="text-muted">Theme and display preferences</small>
              </div>
            </div>
            <div className="settings-card-body">
              <div className="mb-3">
                <label className="form-label">Theme</label>
                <select className="form-select form-control-modern" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <button type="button" className="btn btn-primary btn-modern" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon"><i className="fas fa-shield-halved" /></div>
              <div>
                <h5 className="fw-bold mb-0">Security</h5>
                <small className="text-muted">Vault lock and account security</small>
              </div>
            </div>
            <div className="settings-card-body">
              <div className="mb-3">
                <label className="form-label">Auto-lock (minutes)</label>
                <input type="number" className="form-control form-control-modern" min="1" max="120" value={autoLock} onChange={(e) => setAutoLock(parseInt(e.target.value))} />
                <small className="text-muted">Vault locks after this period of inactivity</small>
              </div>
              <div className="d-flex flex-column gap-2">
                <Link to="/change-master-password" className="btn btn-ghost text-start">
                  <i className="fas fa-key me-2" />Change Master Password
                </Link>
                <Link to="/sessions" className="btn btn-ghost text-start">
                  <i className="fas fa-desktop me-2" />Manage Sessions
                </Link>
                <Link to="/trash" className="btn btn-ghost text-start">
                  <i className="fas fa-trash me-2" />View Trash
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
