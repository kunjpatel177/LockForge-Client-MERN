import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { noteAPI, folderAPI } from '../../api';
import { showApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';
import MoveToFolderModal from '../../components/MoveToFolderModal';
import NoteViewModal from '../../components/NoteViewModal';
import { useConfirm } from '../../hooks/useConfirm';
import { LIMITS } from '../../config/limits';

const SecureNotes = () => {
  const { confirm, ConfirmDialog } = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();
  const { vaultUnlocked } = useOutletContext();
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', folderId: '', isFavorite: false });
  const [moveItem, setMoveItem] = useState(null);
  const [viewNote, setViewNote] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 280);
    return () => clearTimeout(timer);
  }, [search]);

  const load = async () => {
    if (!vaultUnlocked) { setLoading(false); return; }
    try {
      const [noteRes, folderRes] = await Promise.all([
        noteAPI.getAll({ search: debouncedSearch }),
        folderAPI.getAll(),
      ]);
      setNotes(noteRes.data.data);
      setFolders(folderRes.data.data);
    } catch (err) { showApiError(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [vaultUnlocked, debouncedSearch]);

  const startEdit = (note) => {
    setEditing(note.id);
    setForm({ title: note.title, content: note.content, folderId: note.folderId || '', isFavorite: note.isFavorite });
    setShowForm(true);
  };

  useEffect(() => {
    const folderId = searchParams.get('folderId') || '';
    const shouldOpen = searchParams.get('new') === '1';
    const editId = searchParams.get('edit');
    if (shouldOpen) {
      setShowForm(true);
      setEditing(null);
      setForm({ title: '', content: '', folderId, isFavorite: false });
      setSearchParams({}, { replace: true });
    } else if (editId && notes.length) {
      const note = notes.find((n) => String(n.id) === editId);
      if (note) {
        startEdit(note);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, setSearchParams, notes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await noteAPI.update(editing, form);
        toast.success('Note updated');
      } else {
        await noteAPI.create(form);
        toast.success('Note created');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', content: '', folderId: '', isFavorite: false });
      load();
    } catch (err) { showApiError(err); }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Move Note to Trash',
      message: 'This secure note will be moved to trash. You can restore it anytime from Trash.',
      confirmLabel: 'Move to trash',
      icon: 'fa-trash',
    });
    if (!ok) return;
    try {
      await noteAPI.delete(id);
      toast.success('Note moved to trash');
      load();
    } catch (err) { showApiError(err); }
  };

  const handleDeleteAll = async () => {
    const ok = await confirm({
      title: 'Delete All Secure Notes',
      message: `Move all ${notes.length} secure notes to trash? You can restore them anytime from Trash.`,
      confirmLabel: 'Move all to trash',
      variant: 'danger',
      icon: 'fa-trash',
    });
    if (!ok) return;
    try {
      await noteAPI.deleteAll({ permanent: false });
      toast.success('All secure notes moved to trash');
      load();
    } catch (err) { showApiError(err); }
  };

  const handleHide = async (id, title) => {
    const ok = await confirm({
      title: 'Hide Secure Note',
      message: `Hide note "${title}"? It will be removed from your standard notes and will require your Master Password to access in Hidden Items.`,
      confirmLabel: 'Hide Note',
      variant: 'primary',
      icon: 'fa-eye-slash',
    });
    if (!ok) return;

    try {
      await noteAPI.toggleHide(id);
      toast.success(`Note "${title}" is now hidden`);
      load();
    } catch (err) {
      showApiError(err);
    }
  };

  const handleMove = async (folderId) => {
    if (!moveItem) return;
    await noteAPI.moveToFolder(moveItem.id, folderId);
    toast.success(folderId ? 'Moved to folder' : 'Removed from folder');
    load();
  };

  const folderName = (folderId) => folders.find((f) => String(f.id) === String(folderId))?.name || 'Unknown';

  if (!vaultUnlocked) return <VaultLockedState />;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {ConfirmDialog}
      <MoveToFolderModal
        show={!!moveItem}
        itemType="note"
        itemName={moveItem?.name}
        currentFolderId={moveItem?.folderId}
        onClose={() => setMoveItem(null)}
        onMove={handleMove}
      />
      <NoteViewModal
        show={!!viewNote}
        note={viewNote}
        folderName={viewNote?.folderId ? folderName(viewNote.folderId) : null}
        onClose={() => setViewNote(null)}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
      <DashboardPageHeader
        icon="fa-sticky-note"
        title="Secure Notes"
        subtitle="Store encrypted text for sensitive information"
        actions={
          <div className="d-flex gap-2">
            {notes.length > 0 && (
              <button
                type="button"
                className="btn btn-outline-danger btn-modern"
                onClick={handleDeleteAll}
              >
                <i className="fas fa-trash me-1" />Delete All
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary btn-modern"
              onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', content: '', folderId: '', isFavorite: false }); }}
            >
              <i className="fas fa-plus me-1" />New Note
            </button>
          </div>
        }
      />

      <div className="dash-filter-bar mb-4">
        <div className="dash-search-wrap">
          <i className="fas fa-search" />
          <input
            className="form-control"
            placeholder="Search notes by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {showForm && (
        <div className="dash-panel mb-4">
          <div className="dash-panel-header">
            <h5 className="dash-panel-title"><i className="fas fa-pen" />{editing ? 'Edit Note' : 'Create Note'}</h5>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => { setShowForm(false); setEditing(null); }}>
              <i className="fas fa-times" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="dash-panel-body">
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Title</label>
                <input className="form-control form-control-modern" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={LIMITS.MAX_NOTE_TITLE_LENGTH} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Folder</label>
                <select className="form-select form-control-modern" value={form.folderId} onChange={(e) => setForm({ ...form, folderId: e.target.value })}>
                  <option value="">No Folder</option>
                  {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Content</label>
                <textarea className="form-control form-control-modern" rows="6" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} maxLength={LIMITS.MAX_NOTE_CONTENT_LENGTH} />
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="noteFavorite" checked={form.isFavorite} onChange={(e) => setForm({ ...form, isFavorite: e.target.checked })} />
                  <label className="form-check-label" htmlFor="noteFavorite">Mark as favorite</label>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary btn-modern">{editing ? 'Update Note' : 'Create Note'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {notes.length === 0 ? (
        <EmptyState
          icon="fa-sticky-note"
          title={search ? 'No matching notes' : 'No secure notes yet'}
          description={search ? 'Try a different search term.' : 'Create encrypted notes for Wi-Fi passwords, recovery codes, and more.'}
          action={!search && (
            <button type="button" className="btn btn-primary btn-modern" onClick={() => setShowForm(true)}>
              Create Note
            </button>
          )}
        />
      ) : (
        <div className="row g-3">
          {notes.map((n) => (
            <div key={n.id} className="col-md-6">
              <div
                className="note-card note-card-clickable"
                onClick={() => setViewNote(n)}
                onKeyDown={(e) => e.key === 'Enter' && setViewNote(n)}
                role="button"
                tabIndex={0}
              >
                <div className="note-card-header">
                  <h5 className="note-card-title">
                    {n.title}
                    {n.isFavorite && <i className="fas fa-star text-warning ms-2" style={{ fontSize: '0.85rem' }} />}
                  </h5>
                  <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="dash-action-btn"
                      title="Hide note (protect with Master Password)"
                      onClick={() => handleHide(n.id, n.title)}
                    >
                      <i className="fas fa-eye-slash" />
                    </button>
                    <button type="button" className="dash-action-btn" title="Move to folder" onClick={() => setMoveItem({ id: n.id, name: n.title, folderId: n.folderId })}>
                      <i className="fas fa-folder-open" />
                    </button>
                    <button type="button" className="dash-action-btn" onClick={() => startEdit(n)}><i className="fas fa-pen" /></button>
                    <button type="button" className="dash-action-btn danger" onClick={() => handleDelete(n.id)}><i className="fas fa-trash" /></button>
                  </div>
                </div>
                <p className="text-muted small mb-2 note-card-preview">
                  {n.content || 'Empty note'}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted"><i className="fas fa-clock me-1" />{new Date(n.updatedAt).toLocaleDateString()}</small>
                  {n.folderId ? (
                    <span className="dash-badge primary">{folderName(n.folderId)}</span>
                  ) : (
                    <span className="text-muted small">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecureNotes;
