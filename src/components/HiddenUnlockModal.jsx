import { useState } from 'react';
import { hiddenAPI } from '../api';
import { showApiError } from '../api/axios';
import { toast } from 'react-toastify';
import PasswordInput from './PasswordInput';

const HiddenUnlockModal = ({
  show,
  onClose,
  onUnlocked,
  title = 'Unlock Hidden Items',
  description = 'Enter your Master Password to access your hidden credentials, folders, and notes.',
}) => {
  const [masterPassword, setMasterPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!masterPassword.trim()) {
      toast.error('Master password is required');
      return;
    }

    setLoading(true);
    try {
      await hiddenAPI.unlock(masterPassword);
      toast.success('Hidden vault unlocked');
      setMasterPassword('');
      onUnlocked?.();
      onClose?.();
    } catch (err) {
      showApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setMasterPassword('');
    onClose?.();
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block confirm-modal-backdrop"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 'var(--radius)' }}>
          <div className="modal-header border-bottom">
            <h5 className="modal-title d-flex align-items-center gap-2 fw-bold">
              <span
                className="d-inline-flex align-items-center justify-content-center"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                }}
              >
                <i className="fas fa-eye-slash" />
              </span>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body py-4">
              <p className="text-muted small mb-3">{description}</p>
              <div className="mb-0">
                <label className="form-label fw-semibold small" htmlFor="hidden-master-password">
                  Master Password
                </label>
                <PasswordInput
                  id="hidden-master-password"
                  className="form-control form-control-modern"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter your master password"
                  required
                  autoFocus
                  disabled={loading}
                />
              </div>
            </div>

            <div className="modal-footer border-top bg-light-subtle">
              <button
                type="button"
                className="btn btn-ghost btn-modern"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-modern"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock-open me-2" />
                    Unlock Hidden Items
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HiddenUnlockModal;
