import { useEffect, useMemo, useState } from 'react';
import { vaultAPI, noteAPI, folderAPI } from '../api';
import { showApiError } from '../api/axios';
import { toast } from 'react-toastify';

const AssignItemsModal = ({ show, folderId, folderName, onClose, onAssigned }) => {
  const [credentials, setCredentials] = useState([]);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedCreds, setSelectedCreds] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('credentials');

  const folderMap = useMemo(
    () => Object.fromEntries(folders.map((f) => [String(f.id), f.name])),
    [folders],
  );

  const getFolderLabel = (itemFolderId) => {
    if (!itemFolderId) return 'Unassigned';
    return folderMap[String(itemFolderId)] || 'Unknown';
  };

  useEffect(() => {
    if (!show) return;
    const load = async () => {
      setLoading(true);
      setSelectedCreds([]);
      setSelectedNotes([]);
      setSearch('');
      try {
        const [credRes, noteRes, folderRes] = await Promise.all([
          vaultAPI.getAll({ sort: 'serviceName', order: 'asc' }),
          noteAPI.getAll(),
          folderAPI.getAll(),
        ]);
        setFolders(folderRes.data.data);
        setCredentials(credRes.data.data.filter((c) => String(c.folderId || '') !== String(folderId)));
        setNotes(noteRes.data.data.filter((n) => String(n.folderId || '') !== String(folderId)));
      } catch (err) {
        showApiError(err);
        onClose?.();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [show, folderId, onClose]);

  const filteredCredentials = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return credentials;
    return credentials.filter((c) => {
      const folder = getFolderLabel(c.folderId).toLowerCase();
      return c.serviceName.toLowerCase().includes(q) || folder.includes(q);
    });
  }, [credentials, search, folderMap]);

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => {
      const folder = getFolderLabel(n.folderId).toLowerCase();
      return n.title.toLowerCase().includes(q) || folder.includes(q);
    });
  }, [notes, search, folderMap]);

  const toggleCred = (id) => {
    setSelectedCreds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleNote = (id) => {
    setSelectedNotes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCreds.length && !selectedNotes.length) {
      toast.error('Select at least one item to add');
      return;
    }
    setSaving(true);
    try {
      await onAssigned?.({ credentialIds: selectedCreds, noteIds: selectedNotes });
      onClose?.();
    } catch (err) {
      showApiError(err);
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block confirm-modal-backdrop" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-folder-plus me-2" />
              Add to &quot;{folderName}&quot;
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={saving} aria-label="Close" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p className="text-muted small mb-3">
                Select credentials and notes to assign to this folder. Each item can belong to only one folder.
              </p>
              <div className="dash-search-wrap mb-3">
                <i className="fas fa-search" />
                <input
                  className="form-control"
                  placeholder="Search items..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <ul className="nav nav-tabs folder-tabs mb-3">
                <li className="nav-item">
                  <button type="button" className={`nav-link ${activeTab === 'credentials' ? 'active' : ''}`} onClick={() => setActiveTab('credentials')}>
                    Credentials ({filteredCredentials.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button type="button" className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                    Notes ({filteredNotes.length})
                  </button>
                </li>
              </ul>
              {loading ? (
                <p className="text-muted text-center py-4">Loading items...</p>
              ) : activeTab === 'credentials' ? (
                filteredCredentials.length === 0 ? (
                  <p className="text-muted text-center py-3">No credentials available to add.</p>
                ) : (
                  <div className="assign-items-list">
                    {filteredCredentials.map((c) => (
                      <label key={c.id} className="assign-item-row">
                        <input type="checkbox" checked={selectedCreds.includes(c.id)} onChange={() => toggleCred(c.id)} />
                        <span className="assign-item-title">
                          {c.serviceName}<span className="assign-item-folder">{getFolderLabel(c.folderId)}</span>
                          
                        </span>
                        <span className="assign-item-meta text-muted small">{c.username || c.email || 'No login info'}</span>
                      </label>
                    ))}
                  </div>
                )
              ) : filteredNotes.length === 0 ? (
                <p className="text-muted text-center py-3">No notes available to add.</p>
              ) : (
                <div className="assign-items-list">
                  {filteredNotes.map((n) => (
                    <label key={n.id} className="assign-item-row">
                      <input type="checkbox" checked={selectedNotes.includes(n.id)} onChange={() => toggleNote(n.id)} />
                      <span className="assign-item-title">
                        {n.title}<span className="assign-item-folder">{getFolderLabel(n.folderId)}</span>
                        
                      </span>
                      <span className="assign-item-meta text-muted small">{n.content?.substring(0, 60) || 'Empty note'}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving || loading}>
                {saving ? 'Adding...' : `Add selected (${selectedCreds.length + selectedNotes.length})`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignItemsModal;
