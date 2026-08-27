import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, authAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import PasswordInput from '../../components/PasswordInput';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userAPI.updateProfile({ name });
      await refreshProfile();
      toast.success('Profile updated');
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return toast.error('Enter a new email address');
    setEmailLoading(true);
    try {
      await userAPI.requestEmailChange({ newEmail, password: emailPassword });
      await refreshProfile();
      toast.success('Verification link sent to your new email address');
      setNewEmail('');
      setEmailPassword('');
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setEmailLoading(false); }
  };

  const handleCancelEmailChange = async () => {
    setCancelLoading(true);
    try {
      await userAPI.cancelEmailChange();
      await refreshProfile();
      toast.success('Email change request cancelled');
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setCancelLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await userAPI.changePassword({ currentPassword, newPassword });
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  const handleResendVerification = async () => {
    try {
      await authAPI.resendVerification();
      toast.success('Verification email sent');
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div>
      <DashboardPageHeader icon="fa-user" title="Profile" subtitle="Manage your account information and password" />

      <div className="profile-header-card">
        <div className="profile-avatar-lg">{initials}</div>
        <div>
          <h4 className="fw-bold mb-1">{user?.name || 'User'}</h4>
          <p className="text-muted mb-0">{user?.email}</p>
          {user?.emailVerified ? (
            <span className="dash-badge success mt-2"><i className="fas fa-check-circle" />Verified</span>
          ) : (
            <span className="dash-badge warning mt-2"><i className="fas fa-exclamation-circle" />Not verified</span>
          )}
        </div>
      </div>

      {!user?.emailVerified && !user?.pendingEmail && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
          <span><i className="fas fa-envelope me-2" />Please verify your email address for full account security.</span>
          <button type="button" className="btn btn-sm btn-warning" onClick={handleResendVerification}>Resend Email</button>
        </div>
      )}

      {user?.pendingEmail && (
        <div className="alert alert-info d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
          <span>
            <i className="fas fa-envelope me-2" />
            Email change pending. Check <strong>{user.pendingEmail}</strong> for a confirmation link.
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={handleCancelEmailChange}
            disabled={cancelLoading}
          >
            {cancelLoading ? 'Cancelling...' : 'Cancel Request'}
          </button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-md-6">
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon"><i className="fas fa-id-card" /></div>
              <div>
                <h5 className="fw-bold mb-0">Personal Info</h5>
                <small className="text-muted">Update your display name</small>
              </div>
            </div>
            <form onSubmit={handleProfileUpdate} className="settings-card-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control form-control-modern" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control form-control-modern" value={user?.email || ''} disabled />
              </div>
              <button type="submit" className="btn btn-primary btn-modern" disabled={loading}>Update Profile</button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon"><i className="fas fa-envelope" /></div>
              <div>
                <h5 className="fw-bold mb-0">Change Email</h5>
                <small className="text-muted">Update your registered email address</small>
              </div>
            </div>
            <form onSubmit={handleEmailChange} className="settings-card-body">
              <p className="text-muted small">
                A confirmation link will be sent to your new email. Your current email stays active until you confirm the change.
              </p>
              <div className="mb-3">
                <label className="form-label">New Email</label>
                <input
                  type="email"
                  className="form-control form-control-modern"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={!!user?.pendingEmail}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Account Password</label>
                <PasswordInput
                  className="form-control form-control-modern"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="Confirm with your password"
                  disabled={!!user?.pendingEmail}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-modern" disabled={emailLoading || !!user?.pendingEmail}>
                {emailLoading ? 'Sending...' : 'Send Verification Link'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-icon"><i className="fas fa-lock" /></div>
              <div>
                <h5 className="fw-bold mb-0">Change Password</h5>
                <small className="text-muted">Update your account login password</small>
              </div>
            </div>
            <form onSubmit={handlePasswordChange} className="settings-card-body">
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <PasswordInput className="form-control form-control-modern" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder={"Enter your current password"} />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <PasswordInput className="form-control form-control-modern" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={"Enter your new password"} />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <PasswordInput className="form-control form-control-modern" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={"Confirm your new password"} />
              </div>
              <button type="submit" className="btn btn-primary btn-modern" disabled={loading}>Change Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
