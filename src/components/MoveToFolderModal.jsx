import { useEffect, useState } from 'react';
import { folderAPI } from '../api';
import { showApiError } from '../api/axios';
import { toast } from 'react-toastify';

const MoveToFolderModal = ({
  show,
  itemType,
  itemName,
  currentFolderId,
  onClose,
  onMove,
}) => {
  const [folders, setFolders] = useState([]);
  const [targetFolderId, setTargetFolderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!show) return;
    const load = async () => {
      setLoading(true);
      setTargetFolderId('');
      try {
        const res = await folderAPI.getAll();
        setFolders(res.data.data.filter((f) => f.id !== currentFolderId));
      } catch (err) {
        showApiError(err);
        onClose?.();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [show, currentFolderId, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onMove?.(targetFolderId || null);
      onClose?.();
    } catch (err) {
      showApiError(err);
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  const typeLabel = itemType === 'note' ? 'note' : 'credential';

  return (
    <div className="modal show d-block confirm-modal-backdrop" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-folder-open me-2" />
              Move {typeLabel}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={saving} aria-label="Close" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p className="text-muted mb-3">
                Move <strong>{itemName}</strong> to another folder. Each item can only be in one folder at a time.
              </p>
              <label className="form-label" htmlFor="move-folder-select">Destination folder</label>
              <select
                id="move-folder-select"
                className="form-select form-control-modern"
                value={targetFolderId}
                onChange={(e) => setTargetFolderId(e.target.value)}
                disabled={loading}
              >
                <option value="">No folder (unassigned)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving || loading}>
                {saving ? 'Moving...' : 'Move'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MoveToFolderModal;
