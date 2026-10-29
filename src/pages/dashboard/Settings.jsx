import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { userAPI, vaultAPI, noteAPI, folderAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import ConfirmModal from '../../components/ConfirmModal';
import PasswordInput from '../../components/PasswordInput';
import TwoFactorSettings from '../../components/TwoFactorSettings';
import { useConfirm } from '../../hooks/useConfirm';

const Settings = () => {
  const { user, refreshProfile, destroyAuth, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { confirm, ConfirmDialog } = useConfirm();

  const [autoLock, setAutoLock] = useState(user?.settings?.autoLockMinutes || 15);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgePassword, setPurgePassword] = useState('');
  const [purging, setPurging] = useState(false);

  const handleDeleteAllCredentials = async () => {
    const ok = await confirm({
      title: 'Delete All Credentials',
      message: 'Move all credentials to trash? You can restore them anytime from Trash.',
      confirmLabel: 'Move all to trash',
      variant: 'danger',
      icon: 'fa-key',
    });
    if (!ok) return;
    try {
      await vaultAPI.deleteAll({ permanent: false });
      toast.success('All credentials moved to trash');
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handleDeleteAllNotes = async () => {
    const ok = await confirm({
      title: 'Delete All Secure Notes',
      message: 'Move all secure notes to trash? You can restore them anytime from Trash.',
      confirmLabel: 'Move all to trash',
      variant: 'danger',
      icon: 'fa-sticky-note',
    });
    if (!ok) return;
    try {
      await noteAPI.deleteAll({ permanent: false });
      toast.success('All secure notes moved to trash');
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handleDeleteAllFolders = async () => {
    const ok = await confirm({
      title: 'Delete All Folders',
      message: 'Move all folders to trash? Any credentials and notes inside will be preserved, and you can restore folders anytime from Trash.',
      confirmLabel: 'Move all to trash',
      variant: 'danger',
      icon: 'fa-folder',
    });
    if (!ok) return;
    try {
      await folderAPI.deleteAll({ permanent: false });
      toast.success('All folders moved to trash');
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const closePurgeModal = () => {
    if (purging) return;
    setShowPurgeModal(false);
    setPurgePassword('');
  };

  const handlePurgeVault = async () => {
    if (!purgePassword.trim()) {
      toast.error('Enter your password to confirm');
      return;
    }
    setPurging(true);
    try {
      await vaultAPI.purgeAll({ masterPassword: purgePassword.trim(), password: purgePassword.trim() });
      toast.success('All credentials, folders, and notes permanently cleared');
      setShowPurgeModal(false);
      setPurgePassword('');
      refreshProfile?.();
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setPurging(false);
    }
  };

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Log Out',
      message: 'Are you sure you want to log out of your LockForge account? Your session will end and your vault will be locked.',
      confirmLabel: 'Log out',
      variant: 'danger',
      icon: 'fa-right-from-bracket',
    });
    if (!ok) return;

    setLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile({ settings: { theme, autoLockMinutes: autoLock } });
      await refreshProfile();
      toast.success('Settings saved');
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setSaving(false); }
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setDeletePassword('');
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error('Enter your password to confirm');
      return;
    }
    setDeleting(true);
    try {
      await userAPI.deleteAccount(deletePassword);
      toast.success('Your account has been permanently deleted');
      destroyAuth();
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {ConfirmDialog}
      <DashboardPageHeader
        icon="fa-cog"
        title="Settings"
        subtitle="Customize your LockForge experience and security preferences"
        actions={
          <button
            type="button"
            className="btn btn-outline-danger btn-modern"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Log out of your account"
          >
            <i className="fas fa-right-from-bracket me-2" />
            {loggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        }
      />

      <div className="row g-4">
        <div className="col-md-6 d-flex flex-column gap-4">
          <div className="settings-card" style={{ height: 'auto' }}>
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

          <div className="settings-card" style={{ height: 'auto' }}>
            <div className="settings-card-header">
              <div className="settings-card-icon"><i className="fas fa-right-from-bracket" /></div>
              <div>
                <h5 className="fw-bold mb-0">Session & Logout</h5>
                <small className="text-muted">Manage your active authentication session</small>
              </div>
            </div>
            <div className="settings-card-body">
              <p className="text-muted small mb-3">
                Logged in as <strong className="text-body">{user?.email || 'User'}</strong>. Logging out ends your current session on this device and securely locks your vault.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-modern"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <i className="fas fa-right-from-bracket me-2" />
                  {loggingOut ? 'Logging out...' : 'Log Out'}
                </button>
                <Link to="/sessions" className="btn btn-ghost btn-modern">
                  <i className="fas fa-desktop me-2" />Manage Sessions
                </Link>
              </div>
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
              <div className="mb-4">
                <TwoFactorSettings
                  enabled={user?.twoFactorEnabled}
                  onStatusChange={() => refreshProfile()}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Auto-lock (minutes)</label>
                <input type="number" className="form-control form-control-modern" min="1" max="120" value={autoLock} onChange={(e) => setAutoLock(parseInt(e.target.value))} />
                <small className="text-muted">Vault locks after this period of inactivity</small>
              </div>
              <div className="d-flex flex-column gap-2">
                <Link to="/profile" className="btn btn-ghost text-start">
                  <i className="fas fa-user me-2" />Edit Profile & Email
                </Link>
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

        <div className="col-12">
          <div className="settings-card danger-zone-card">
            <div className="settings-card-header">
              <div className="settings-card-icon danger"><i className="fas fa-triangle-exclamation" /></div>
              <div>
                <h5 className="fw-bold mb-0 text-danger">Danger Zone</h5>
                <small className="text-muted">Irreversible vault and account actions</small>
              </div>
            </div>
            <div className="settings-card-body">
              {/* Vault Data Purge */}
              <div className="mb-4 pb-4 border-bottom">
                <h6 className="fw-bold mb-1 text-danger">Purge Vault Data</h6>
                <p className="text-muted small mb-3">
                  Permanently delete all credentials, folders, and secure notes from your vault while keeping your LockForge account active.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-modern btn-sm"
                    onClick={() => setShowPurgeModal(true)}
                  >
                    <i className="fas fa-trash-can me-1" />Clear All Vault Data
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost text-danger btn-modern btn-sm"
                    onClick={handleDeleteAllCredentials}
                  >
                    <i className="fas fa-key me-1" />Delete All Credentials
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost text-danger btn-modern btn-sm"
                    onClick={handleDeleteAllNotes}
                  >
                    <i className="fas fa-sticky-note me-1" />Delete All Notes
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost text-danger btn-modern btn-sm"
                    onClick={handleDeleteAllFolders}
                  >
                    <i className="fas fa-folder me-1" />Delete All Folders
                  </button>
                </div>
              </div>

              {/* Account Deletion */}
              <div>
                <h6 className="fw-bold mb-1 text-danger">Delete Account</h6>
                <p className="text-muted small mb-3">
                  Permanently delete your account along with all vault data, folders, notes, sessions, and activity logs. This action cannot be undone.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-modern"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className="fas fa-user-xmark me-2" />Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showPurgeModal}
        title="Clear All Vault Data"
        message="Enter your Master Password or Account Password to permanently clear all credentials, folders, and secure notes from your vault. Your account will remain active, but your vault contents will be permanently erased."
        confirmLabel="Permanently Clear All Vault Data"
        variant="danger"
        icon="fa-trash-can"
        loading={purging}
        onClose={closePurgeModal}
        onConfirm={handlePurgeVault}
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="purge-vault-password">Master or Account Password</label>
          <PasswordInput
            id="purge-vault-password"
            className="form-control form-control-modern"
            value={purgePassword}
            onChange={(e) => setPurgePassword(e.target.value)}
            placeholder="Enter password to confirm"
            autoFocus
            required
          />
        </div>
      </ConfirmModal>

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Account"
        message="Enter your account password to permanently delete your LockForge account and all associated data."
        confirmLabel="Delete my account"
        variant="danger"
        icon="fa-user-xmark"
        loading={deleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteAccount}
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="delete-account-password">Account Password</label>
          <PasswordInput
            id="delete-account-password"
            className="form-control form-control-modern"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Enter your password"
            autoFocus
            required
          />
        </div>
      </ConfirmModal>
    </div>
  );
};

export default Settings;
