import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { noteAPI, folderAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';

const SecureNotes = () => {
  const { vaultUnlocked } = useOutletContext();
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', folderId: '', isFavorite: false });

  const load = async () => {
    if (!vaultUnlocked) { setLoading(false); return; }
    try {
      const [noteRes, folderRes] = await Promise.all([noteAPI.getAll(), folderAPI.getAll()]);
      setNotes(noteRes.data.data);
      setFolders(folderRes.data.data);
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [vaultUnlocked]);

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
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await noteAPI.delete(id);
      toast.success('Note deleted');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const startEdit = (note) => {
    setEditing(note.id);
    setForm({ title: note.title, content: note.content, folderId: note.folderId || '', isFavorite: note.isFavorite });
    setShowForm(true);
  };

  if (!vaultUnlocked) return <VaultLockedState />;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <DashboardPageHeader
        icon="fa-sticky-note"
        title="Secure Notes"
        subtitle="Store encrypted text for sensitive information"
        actions={
          <button
            type="button"
            className="btn btn-primary btn-modern"
            onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', content: '', folderId: '', isFavorite: false }); }}
          >
            <i className="fas fa-plus me-1" />New Note
          </button>
        }
      />

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
                <input className="form-control form-control-modern" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
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
                <textarea className="form-control form-control-modern" rows="6" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
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
          title="No secure notes yet"
          description="Create encrypted notes for Wi-Fi passwords, recovery codes, and more."
          action={
            <button type="button" className="btn btn-primary btn-modern" onClick={() => setShowForm(true)}>
              Create Note
            </button>
          }
        />
      ) : (
        <div className="row g-3">
          {notes.map((n) => (
            <div key={n.id} className="col-md-6">
              <div className="note-card">
                <div className="note-card-header">
                  <h5 className="note-card-title">
                    {n.title}
                    {n.isFavorite && <i className="fas fa-star text-warning ms-2" style={{ fontSize: '0.85rem' }} />}
                  </h5>
                  <div className="d-flex gap-1">
                    <button type="button" className="dash-action-btn" onClick={() => startEdit(n)}><i className="fas fa-pen" /></button>
                    <button type="button" className="dash-action-btn danger" onClick={() => handleDelete(n.id)}><i className="fas fa-trash" /></button>
                  </div>
                </div>
                <p className="text-muted small mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                  {n.content?.substring(0, 200)}{n.content?.length > 200 ? '...' : ''}
                </p>
                <small className="text-muted"><i className="fas fa-clock me-1" />{new Date(n.updatedAt).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecureNotes;
