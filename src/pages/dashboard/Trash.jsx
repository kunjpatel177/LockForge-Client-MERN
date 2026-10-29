import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { vaultAPI, noteAPI, folderAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';
import { useConfirm } from '../../hooks/useConfirm';

const Trash = () => {
  const { confirm, ConfirmDialog } = useConfirm();
  const { vaultUnlocked } = useOutletContext();
  const [credentials, setCredentials] = useState([]);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!vaultUnlocked) { setLoading(false); return; }
    try {
      const [cRes, nRes, fRes] = await Promise.all([
        vaultAPI.getTrash(),
        noteAPI.getTrash(),
        folderAPI.getTrash(),
      ]);
      setCredentials(cRes.data.data || []);
      setNotes(nRes.data.data || []);
      setFolders(fRes.data.data || []);
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [vaultUnlocked]);

  // Credentials actions
  const handleRestoreCredential = async (id) => {
    try {
      await vaultAPI.restore(id);
      toast.success('Credential restored');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handlePermanentDeleteCredential = async (id, name) => {
    const ok = await confirm({
      title: 'Permanently Delete Credential',
      message: `"${name}" will be permanently deleted. This action cannot be undone.`,
      confirmLabel: 'Delete forever',
      variant: 'danger',
      icon: 'fa-trash',
    });
    if (!ok) return;
    try {
      await vaultAPI.permanentDelete(id);
      toast.success('Credential permanently deleted');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  // Notes actions
  const handleRestoreNote = async (id) => {
    try {
      await noteAPI.restore(id);
      toast.success('Note restored');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handlePermanentDeleteNote = async (id, title) => {
    const ok = await confirm({
      title: 'Permanently Delete Note',
      message: `"${title}" will be permanently deleted. This action cannot be undone.`,
      confirmLabel: 'Delete forever',
      variant: 'danger',
      icon: 'fa-trash',
    });
    if (!ok) return;
    try {
      await noteAPI.permanentDelete(id);
      toast.success('Note permanently deleted');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  // Folders actions
  const handleRestoreFolder = async (id) => {
    try {
      await folderAPI.restore(id);
      toast.success('Folder restored');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handlePermanentDeleteFolder = async (id, name) => {
    const ok = await confirm({
      title: 'Permanently Delete Folder',
      message: `Delete folder "${name}" permanently? Any remaining credentials and notes inside will become unassigned.`,
      confirmLabel: 'Delete forever',
      variant: 'danger',
      icon: 'fa-trash',
    });
    if (!ok) return;
    try {
      await folderAPI.permanentDelete(id);
      toast.success('Folder permanently deleted');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  // Empty entire trash
  const handleEmptyTrash = async () => {
    const ok = await confirm({
      title: 'Empty Entire Trash',
      message: 'All credentials, secure notes, and folders in trash will be permanently removed. This action cannot be undone.',
      confirmLabel: 'Empty All Trash',
      variant: 'danger',
      icon: 'fa-trash-can',
    });
    if (!ok) return;
    try {
      await vaultAPI.emptyTrash();
      toast.success('Trash emptied');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  if (!vaultUnlocked) return <VaultLockedState />;
  if (loading) return <LoadingSpinner />;

  const totalCount = credentials.length + notes.length + folders.length;

  // Build unified items list
  const allItems = [
    ...credentials.map((c) => ({
      id: c.id,
      rawType: 'credential',
      title: c.serviceName,
      subtitle: c.username || c.email || '',
      icon: 'fa-key',
      badgeClass: 'bg-primary-subtle text-primary border-primary-subtle',
      badgeText: 'Credential',
      deletedAt: c.deletedAt,
      onRestore: () => handleRestoreCredential(c.id),
      onDelete: () => handlePermanentDeleteCredential(c.id, c.serviceName),
    })),
    ...notes.map((n) => ({
      id: n.id,
      rawType: 'note',
      title: n.title,
      subtitle: n.content ? (n.content.length > 50 ? `${n.content.slice(0, 50)}...` : n.content) : '',
      icon: 'fa-sticky-note',
      badgeClass: 'bg-info-subtle text-info border-info-subtle',
      badgeText: 'Secure Note',
      deletedAt: n.deletedAt,
      onRestore: () => handleRestoreNote(n.id),
      onDelete: () => handlePermanentDeleteNote(n.id, n.title),
    })),
    ...folders.map((f) => ({
      id: f.id,
      rawType: 'folder',
      title: f.name,
      subtitle: `${f.credentialCount || 0} creds · ${f.noteCount || 0} notes`,
      icon: 'fa-folder',
      badgeClass: 'bg-warning-subtle text-warning border-warning-subtle',
      badgeText: 'Folder',
      deletedAt: f.deletedAt,
      onRestore: () => handleRestoreFolder(f.id),
      onDelete: () => handlePermanentDeleteFolder(f.id, f.name),
    })),
  ].sort((a, b) => new Date(b.deletedAt || 0) - new Date(a.deletedAt || 0));

  const filteredItems = activeTab === 'all'
    ? allItems
    : allItems.filter((item) => {
        if (activeTab === 'credentials') return item.rawType === 'credential';
        if (activeTab === 'notes') return item.rawType === 'note';
        if (activeTab === 'folders') return item.rawType === 'folder';
        return true;
      });

  return (
    <div>
      {ConfirmDialog}
      <DashboardPageHeader
        icon="fa-trash"
        title="Trash"
        subtitle="Deleted credentials, notes, and folders can be restored or permanently removed"
        actions={
          totalCount > 0 && (
            <button type="button" className="btn btn-outline-danger btn-modern btn-sm" onClick={handleEmptyTrash}>
              <i className="fas fa-trash-can me-1" />Empty Trash
            </button>
          )
        }
      />

      {/* Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'} btn-modern`}
          onClick={() => setActiveTab('all')}
        >
          All Items <span className="badge bg-white text-dark ms-1">{totalCount}</span>
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'credentials' ? 'btn-primary' : 'btn-outline-secondary'} btn-modern`}
          onClick={() => setActiveTab('credentials')}
        >
          <i className="fas fa-key me-1" />Credentials <span className="badge bg-white text-dark ms-1">{credentials.length}</span>
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'notes' ? 'btn-primary' : 'btn-outline-secondary'} btn-modern`}
          onClick={() => setActiveTab('notes')}
        >
          <i className="fas fa-sticky-note me-1" />Secure Notes <span className="badge bg-white text-dark ms-1">{notes.length}</span>
        </button>
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'folders' ? 'btn-primary' : 'btn-outline-secondary'} btn-modern`}
          onClick={() => setActiveTab('folders')}
        >
          <i className="fas fa-folder me-1" />Folders <span className="badge bg-white text-dark ms-1">{folders.length}</span>
        </button>
      </div>

      {totalCount === 0 ? (
        <EmptyState
          icon="fa-trash-can"
          title="Trash is empty"
          description="Deleted credentials, secure notes, and folders will appear here before permanent removal."
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon="fa-filter"
          title={`No ${activeTab} in trash`}
          description={`There are currently no ${activeTab} moved to trash.`}
        />
      ) : (
        <div className="modern-table-wrap">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Deleted</th>
                <th style={{ width: 200 }} className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={`${item.rawType}-${item.id}`}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="text-muted" style={{ width: 22, textAlign: 'center' }}>
                        <i className={`fas ${item.icon}`} />
                      </div>
                      <div>
                        <div className="fw-semibold text-break">{item.title}</div>
                        {item.subtitle && <div className="text-muted small text-break">{item.subtitle}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge border ${item.badgeClass}`}>
                      {item.badgeText}
                    </span>
                  </td>
                  <td className="text-muted small">
                    {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Recently'}
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={item.onRestore}
                        title="Restore item"
                      >
                        <i className="fas fa-rotate-left me-1" />Restore
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={item.onDelete}
                        title="Delete permanently"
                      >
                        <i className="fas fa-trash me-1" />Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Trash;
