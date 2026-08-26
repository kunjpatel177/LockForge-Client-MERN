import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { handleApiError } from '../api/axios';
import { toast } from 'react-toastify';
import PasswordInput from './PasswordInput';

const VaultUnlockModal = ({ show, onClose, onUnlock }) => {
  const { unlockVault } = useAuth();
  const [masterPassword, setMasterPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await unlockVault(masterPassword);
      toast.success('Vault unlocked');
      setMasterPassword('');
      onUnlock?.();
      onClose?.();
    } catch (err) {
      const { message } = handleApiError(err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><i className="fas fa-lock me-2" />Unlock Vault</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p className="text-muted">Enter your master password to access your vault.</p>
              <div className="mb-3">
                <label className="form-label">Master Password</label>
                <PasswordInput
                  className="form-control"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Unlocking...' : 'Unlock'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VaultUnlockModal;
