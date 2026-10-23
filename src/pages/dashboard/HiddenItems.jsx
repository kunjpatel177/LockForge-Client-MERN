import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { hiddenAPI, vaultAPI, folderAPI, noteAPI } from '../../api';
import { showApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';
import PasswordReveal from '../../components/PasswordReveal';
import NoteViewModal from '../../components/NoteViewModal';
import HiddenUnlockModal from '../../components/HiddenUnlockModal';
import { useConfirm } from '../../hooks/useConfirm';

const HiddenItems = () => {
  const navigate = useNavigate();
  const { vaultUnlocked } = useOutletContext();
  const { confirm, ConfirmDialog } = useConfirm();

  const [loading, setLoading] = useState(true);
  const [hiddenUnlocked, setHiddenUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [activeTab, setActiveTab] = useState('credentials');

  const [credentials, setCredentials] = useState([]);
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [counts, setCounts] = useState({ credentials: 0, folders: 0, notes: 0, total: 0 });

  const [viewNote, setViewNote] = useState(null);

  const checkStatusAndLoad = useCallback(async () => {
    if (!vaultUnlocked) {
      setLoading(false);
      return;
    }

    try {
      const statusRes = await hiddenAPI.status();
      const isUnlocked = !!statusRes.data?.data?.unlocked;
      setHiddenUnlocked(isUnlocked);

      if (isUnlocked) {
        const itemsRes = await hiddenAPI.getItems();
        const data = itemsRes.data?.data || {};
        setCredentials(data.credentials || []);
        setFolders(data.folders || []);
        setNotes(data.notes || []);
        setCounts(data.counts || { credentials: 0, folders: 0, notes: 0, total: 0 });
      }
    } catch (err) {
      showApiError(err);
    } finally {
      setLoading(false);
    }
  }, [vaultUnlocked]);

  useEffect(() => {
    checkStatusAndLoad();
  }, [checkStatusAndLoad]);

  const handleLockHidden = async () => {
    try {
      await hiddenAPI.lock();
      setHiddenUnlocked(false);
      setCredentials([]);
      setFolders([]);
      setNotes([]);
      setCounts({ credentials: 0, folders: 0, notes: 0, total: 0 });
      toast.info('Hidden vault locked');
    } catch (err) {
      showApiError(err);
    }
  };

  const handleUnhideCred = async (id, name) => {
    const ok = await confirm({
      title: 'Unhide Credential',
      message: `Unhide "${name}"? It will reappear in your standard vault and folder.`,
      confirmLabel: 'Unhide',
      variant: 'primary',
      icon: 'fa-eye',
    });
    if (!ok) return;

    try {
      await vaultAPI.toggleHide(id);
      toast.success(`"${name}" unhidden`);
      checkStatusAndLoad();
    } catch (err) {
      showApiError(err);
    }
  };

  const handleDeleteCred = async (id) => {
    const ok = await confirm({
      title: 'Move to Trash',
      message: 'Move this hidden credential to trash?',
      confirmLabel: 'Move to trash',
      variant: 'danger',
      icon: 'fa-trash',
    });
    if (!ok) return;

    try {
      await vaultAPI.delete(id);
      toast.success('Moved to trash');
      checkStatusAndLoad();
    } catch (err) {
      showApiError(err);
    }
  };

  const handleUnhideFolder = async (id, name) => {
    const ok = await confirm({
      title: 'Unhide Folder',
      message: `Unhide folder "${name}"? It and all associated credentials and notes will reappear in your folders list.`,
      confirmLabel: 'Unhide',
      variant: 'primary',
      icon: 'fa-eye',
    });
    if (!ok) return;

    try {
      await folderAPI.toggleHide(id);
      toast.success(`Folder "${name}" unhidden`);
      checkStatusAndLoad();
    } catch (err) {
      showApiError(err);
    }
  };

  const handleDeleteFolder = async (id, name) => {
    const ok = await confirm({
      title: 'Delete Folder',
      message: `Delete hidden folder "${name}"? Contained credentials will become unassigned.`,
      confirmLabel: 'Delete folder',
      variant: 'danger',
      icon: 'fa-trash',
    });
    if (!ok) return;

    try {
      await folderAPI.delete(id);
      toast.success('Folder deleted');
      checkStatusAndLoad();
    } catch (err) {
      showApiError(err);
    }
  };

  const openFolder = (folderId) => navigate(`/folders/${folderId}`);

  const handleUnhideNote = async (id, title) => {
    const ok = await confirm({
      title: 'Unhide Secure Note',
      message: `Unhide note "${title}"? It will reappear in your Secure Notes and folder.`,
      confirmLabel: 'Unhide',
      variant: 'primary',
      icon: 'fa-eye',
    });
    if (!ok) return;

    try {
      await noteAPI.toggleHide(id);
      toast.success(`Note "${title}" unhidden`);
      checkStatusAndLoad();
    } catch (err) {
      showApiError(err);
    }
  };

  const handleDeleteNote = async (id) => {
    const ok = await confirm({
      title: 'Delete Secure Note',
      message: 'Permanently delete this hidden note?',
      confirmLabel: 'Delete note',
      variant: 'danger',
      icon: 'fa-trash',
    });
    if (!ok) return;

    try {
      await noteAPI.delete(id);
      toast.success('Note deleted');
      checkStatusAndLoad();
    } catch (err) {
      showApiError(err);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const renderFieldCell = (value, emptyLabel, copyLabel) => {
    if (!value) return <span className="text-muted">{emptyLabel}</span>;
    return (
      <>
        {value}
        <button
          type="button"
          className="btn btn-link btn-sm p-0 ms-1"
          onClick={() => copyToClipboard(value, copyLabel)}
          title={`Copy ${copyLabel}`}
        >
          <i className="fas fa-copy" />
        </button>
      </>
    );
  };

  if (!vaultUnlocked) return <VaultLockedState />;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {ConfirmDialog}
      <NoteViewModal show={!!viewNote} note={viewNote} onClose={() => setViewNote(null)} />
      <HiddenUnlockModal
        show={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onUnlocked={() => {
          setShowUnlockModal(false);
          checkStatusAndLoad();
        }}
      />

      <DashboardPageHeader
        icon="fa-eye-slash"
        title="Hidden Items"
        subtitle={
          hiddenUnlocked
            ? `${counts.total} hidden item${counts.total !== 1 ? 's' : ''} accessible · Master Password verified`
            : 'Protected vault enclave requiring Master Password authentication'
        }
        actions={
          hiddenUnlocked ? (
            <button
              type="button"
              className="btn btn-outline-danger btn-modern"
              onClick={handleLockHidden}
            >
              <i className="fas fa-lock me-2" />
              Lock Hidden Vault
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-modern"
              onClick={() => setShowUnlockModal(true)}
            >
              <i className="fas fa-key me-2" />
              Unlock with Master Password
            </button>
          )
        }
      />

      {!hiddenUnlocked ? (
        <div className="modern-card text-center py-5 px-3">
          <div
            className="d-inline-flex align-items-center justify-content-center mb-4"
            style={{
              width: 72,
              height: 72,
              borderRadius: '20px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '2rem',
            }}
          >
            <i className="fas fa-user-shield" />
          </div>
          <h3 className="fw-bold mb-2">Hidden Content is Locked</h3>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: 520 }}>
            Credentials, folders, and secure notes that you hide are kept in this protected enclave.
            Enter your Master Password to decrypt and view them.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-modern px-4"
            onClick={() => setShowUnlockModal(true)}
          >
            <i className="fas fa-key me-2" />
            Enter Master Password
          </button>
        </div>
      ) : (
        <>
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs folder-tabs mb-4">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'credentials' ? 'active' : ''}`}
                onClick={() => setActiveTab('credentials')}
              >
                <i className="fas fa-key me-2" />
                Credentials ({counts.credentials})
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'folders' ? 'active' : ''}`}
                onClick={() => setActiveTab('folders')}
              >
                <i className="fas fa-folder me-2" />
                Folders ({counts.folders})
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <i className="fas fa-sticky-note me-2" />
                Secure Notes ({counts.notes})
              </button>
            </li>
          </ul>

          {/* TAB 1: Credentials */}
          {activeTab === 'credentials' && (
            <>
              {credentials.length === 0 ? (
                <EmptyState
                  icon="fa-key"
                  title="No hidden credentials"
                  description="When you hide credentials from your Vault, they will securely appear here."
                  action={
                    <Link to="/vault" className="btn btn-ghost btn-modern">
                      Go to Vault
                    </Link>
                  }
                />
              ) : (
                <div className="modern-table-wrap vault-table-wrap table-responsive">
                  <table className="table table-hover mb-0 vault-table">
                    <thead>
                      <tr>
                        <th className="vault-col-service">Service</th>
                        <th>Original Folder</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Updated</th>
                        <th style={{ width: 140 }} className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {credentials.map((c) => (
                        <tr key={c.id}>
                          <td className="vault-col-service">
                            <span className="fw-semibold text-body vault-service-link">
                              {c.serviceName}
                            </span>
                            <span className="dash-badge secondary ms-2" style={{ fontSize: '0.72rem' }}>
                              <i className="fas fa-eye-slash me-1" />Hidden
                            </span>
                          </td>
                          <td>
                            {c.folderId ? (
                              <span className="dash-badge primary">
                                <i className="fas fa-folder me-1" />
                                {c.folderName || 'Assigned Folder'}
                              </span>
                            ) : (
                              <span className="text-muted small">Unassigned</span>
                            )}
                          </td>
                          <td>{renderFieldCell(c.username, 'No Username', 'Username')}</td>
                          <td>{renderFieldCell(c.email, 'No Email', 'Email')}</td>
                          <td>
                            <PasswordReveal value={c.password} onCopy={copyToClipboard} />
                          </td>
                          <td className="text-muted small">
                            {new Date(c.updatedAt).toLocaleDateString()}
                          </td>
                          <td style={{ width: 140 }}>
                            <div className="d-flex gap-1 justify-content-end">
                              <button
                                type="button"
                                className="dash-action-btn"
                                title="Unhide credential (restores to original folder)"
                                onClick={() => handleUnhideCred(c.id, c.serviceName)}
                              >
                                <i className="fas fa-eye text-primary" />
                              </button>
                              <Link
                                to={`/vault/${c.id}`}
                                className="dash-action-btn"
                                title="View details"
                              >
                                <i className="fas fa-info-circle" />
                              </Link>
                              <button
                                type="button"
                                className="dash-action-btn danger"
                                title="Move to trash"
                                onClick={() => handleDeleteCred(c.id)}
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* TAB 2: Folders */}
          {activeTab === 'folders' && (
            <>
              {folders.length === 0 ? (
                <EmptyState
                  icon="fa-folder"
                  title="No hidden folders"
                  description="When you hide a folder, it and its contents are safely hidden from the standard folders view."
                  action={
                    <Link to="/folders" className="btn btn-ghost btn-modern">
                      Go to Folders
                    </Link>
                  }
                />
              ) : (
                <div className="row g-3">
                  {folders.map((f) => (
                    <div key={f.id} className="col-md-6 col-lg-4">
                      <div
                        className="folder-card"
                        onClick={() => openFolder(f.id)}
                        onKeyDown={(e) => e.key === 'Enter' && openFolder(f.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="folder-card-top">
                          <div className="folder-card-icon hidden-icon">
                            <i className="fas fa-folder" />
                          </div>
                          <div className="folder-card-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="dash-action-btn"
                              title="Unhide folder (restores folder to main view)"
                              onClick={() => handleUnhideFolder(f.id, f.name)}
                            >
                              <i className="fas fa-eye text-primary" />
                            </button>
                            <Link
                              to={`/folders/${f.id}`}
                              className="dash-action-btn"
                              title="Open folder"
                            >
                              <i className="fas fa-arrow-right" />
                            </Link>
                            <button
                              type="button"
                              className="dash-action-btn danger"
                              title="Delete folder"
                              onClick={() => handleDeleteFolder(f.id, f.name)}
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </div>
                        </div>

                        <div className="folder-card-main">
                          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                            <h5 className="folder-card-title mb-0">{f.name}</h5>
                            <span className="dash-badge secondary" style={{ fontSize: '0.72rem' }}>
                              <i className="fas fa-eye-slash me-1" />Hidden
                            </span>
                          </div>
                        </div>

                        <div className="folder-card-footer">
                          <div className="folder-card-meta">
                            <span className="folder-meta-item">
                              <i className="fas fa-key me-1 text-primary" />
                              {f.credentialCount} {f.credentialCount === 1 ? 'credential' : 'credentials'}
                            </span>
                            <span className="folder-meta-item">
                              <i className="fas fa-sticky-note me-1 text-warning" />
                              {f.noteCount || 0} {f.noteCount === 1 ? 'note' : 'notes'}
                            </span>
                          </div>
                          <div className="folder-card-arrow" title="Open folder">
                            <i className="fas fa-arrow-right" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB 3: Secure Notes */}
          {activeTab === 'notes' && (
            <>
              {notes.length === 0 ? (
                <EmptyState
                  icon="fa-sticky-note"
                  title="No hidden secure notes"
                  description="When you hide secure notes, they will safely appear here."
                  action={
                    <Link to="/notes" className="btn btn-ghost btn-modern">
                      Go to Secure Notes
                    </Link>
                  }
                />
              ) : (
                <div className="row g-3">
                  {notes.map((n) => (
                    <div key={n.id} className="col-md-6 col-lg-4">
                      <div
                        className="note-card note-card-clickable h-100 d-flex flex-column justify-content-between p-3"
                        onClick={() => setViewNote(n)}
                        onKeyDown={(e) => e.key === 'Enter' && setViewNote(n)}
                        role="button"
                        tabIndex={0}
                      >
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="note-card-title mb-0">{n.title}</h5>
                            <span className="dash-badge secondary" style={{ fontSize: '0.72rem' }}>
                              <i className="fas fa-eye-slash me-1" />Hidden
                            </span>
                          </div>
                          {n.folderId && (
                            <span className="dash-badge primary mb-2 d-inline-block" style={{ fontSize: '0.75rem' }}>
                              <i className="fas fa-folder me-1" />
                              {n.folderName || 'Folder'}
                            </span>
                          )}
                          <p className="text-muted small mb-3 note-card-preview">
                            {n.content || 'Empty note'}
                          </p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                          <small className="text-muted">{new Date(n.updatedAt).toLocaleDateString()}</small>
                          <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              className="dash-action-btn"
                              title="View Note"
                              onClick={() => setViewNote(n)}
                            >
                              <i className="fas fa-file-lines" />
                            </button>
                            <button
                              type="button"
                              className="dash-action-btn"
                              title="Unhide note"
                              onClick={() => handleUnhideNote(n.id, n.title)}
                            >
                              <i className="fas fa-eye text-primary" />
                            </button>
                            <button
                              type="button"
                              className="dash-action-btn danger"
                              title="Delete note"
                              onClick={() => handleDeleteNote(n.id)}
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HiddenItems;
