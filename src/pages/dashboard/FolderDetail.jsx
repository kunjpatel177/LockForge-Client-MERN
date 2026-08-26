import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { folderAPI, vaultAPI, noteAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';
import AssignItemsModal from '../../components/AssignItemsModal';
import MoveToFolderModal from '../../components/MoveToFolderModal';
import NoteViewModal from '../../components/NoteViewModal';
import PasswordReveal from '../../components/PasswordReveal';
import { useConfirm } from '../../hooks/useConfirm';
import { LIMITS } from '../../config/limits';

const FolderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirm, ConfirmDialog } = useConfirm();
  const { vaultUnlocked } = useOutletContext();
  const [folder, setFolder] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('credentials');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [moveItem, setMoveItem] = useState(null);
  const [viewNote, setViewNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', folderId: '', isFavorite: false });

  const load = async () => {
    if (!vaultUnlocked) { setLoading(false); return; }
    try {
      const [folderRes, credRes, noteRes] = await Promise.all([
        folderAPI.getOne(id),
        vaultAPI.getAll({ folderId: id }),
        noteAPI.getAll({ folderId: id }),
      ]);
      setFolder(folderRes.data.data);
      setCredentials(credRes.data.data);
      setNotes(noteRes.data.data);
    } catch (err) {
      toast.error(handleApiError(err).message);
      navigate('/folders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id, vaultUnlocked]);

  const handleAssign = async ({ credentialIds, noteIds }) => {
    await folderAPI.assignItems(id, { credentialIds, noteIds });
    toast.success('Items added to folder');
    load();
  };

  const handleMove = async (folderId) => {
    if (!moveItem) return;
    if (moveItem.type === 'credential') {
      await vaultAPI.moveToFolder(moveItem.id, folderId);
    } else {
      await noteAPI.moveToFolder(moveItem.id, folderId);
    }
    toast.success('Moved successfully');
    load();
  };

  const handleRemove = async (type, itemId, name) => {
    const ok = await confirm({
      title: 'Remove from Folder',
      message: `Remove "${name}" from this folder? The item will become unassigned.`,
      confirmLabel: 'Remove',
      variant: 'warning',
      icon: 'fa-folder-minus',
    });
    if (!ok) return;
    try {
      if (type === 'credential') await vaultAPI.moveToFolder(itemId, null);
      else await noteAPI.moveToFolder(itemId, null);
      toast.success('Removed from folder');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handleNoteDelete = async (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    const ok = await confirm({
      title: 'Delete Note',
      message: `Delete "${note?.title || 'this note'}" permanently?`,
      confirmLabel: 'Delete note',
      icon: 'fa-note-sticky',
    });
    if (!ok) return;
    try {
      await noteAPI.delete(noteId);
      toast.success('Note deleted');
      setViewNote(null);
      setEditingNote(null);
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const startEditNote = (note) => {
    setEditingNote(note.id);
    setNoteForm({
      title: note.title,
      content: note.content,
      folderId: note.folderId || id,
      isFavorite: note.isFavorite,
    });
    setViewNote(null);
    setActiveTab('notes');
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!editingNote) return;
    try {
      await noteAPI.update(editingNote, noteForm);
      toast.success('Note updated');
      setEditingNote(null);
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
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
        <button type="button" className="btn btn-link btn-sm p-0 ms-1" onClick={() => copyToClipboard(value, copyLabel)}>
          <i className="fas fa-copy" />
        </button>
      </>
    );
  };

  if (!vaultUnlocked) return <VaultLockedState message="Unlock your vault to view folder contents." />;
  if (loading) return <LoadingSpinner />;
  if (!folder) return null;

  const totalItems = credentials.length + notes.length;

  return (
    <div>
      {ConfirmDialog}
      <AssignItemsModal
        show={showAssignModal}
        folderId={id}
        folderName={folder.name}
        onClose={() => setShowAssignModal(false)}
        onAssigned={handleAssign}
      />
      <MoveToFolderModal
        show={!!moveItem}
        itemType={moveItem?.type}
        itemName={moveItem?.name}
        currentFolderId={id}
        onClose={() => setMoveItem(null)}
        onMove={handleMove}
      />
      <NoteViewModal
        show={!!viewNote}
        note={viewNote}
        folderName={folder?.name}
        onClose={() => setViewNote(null)}
        onEdit={startEditNote}
        onDelete={handleNoteDelete}
      />

      <div className="dash-breadcrumb mb-3">
        <Link to="/folders"><i className="fas fa-arrow-left me-1" />Back to Folders</Link>
      </div>

      <div className="folder-header-card mb-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="folder-header-icon"><i className="fas fa-folder" /></div>
            <div>
              <h1 className="dash-page-title mb-1">{folder.name}</h1>
              <div className="d-flex gap-3 text-muted small flex-wrap">
                <span><i className="fas fa-key me-1" />{credentials.length} credentials</span>
                <span><i className="fas fa-sticky-note me-1" />{notes.length} notes</span>
                <span><i className="fas fa-layer-group me-1" />{totalItems} total</span>
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline-primary btn-modern btn-sm" onClick={() => setShowAssignModal(true)}>
              <i className="fas fa-list-check me-1" />Add from List
            </button>
            <Link to={`/vault/add?folderId=${id}`} className="btn btn-primary btn-modern btn-sm">
              <i className="fas fa-plus me-1" />New Credential
            </Link>
            <Link to={`/notes?folderId=${id}&new=1`} className="btn btn-ghost btn-modern btn-sm">
              <i className="fas fa-sticky-note me-1" />New Note
            </Link>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs folder-tabs mb-4">
        <li className="nav-item">
          <button type="button" className={`nav-link ${activeTab === 'credentials' ? 'active' : ''}`} onClick={() => setActiveTab('credentials')}>
            <i className="fas fa-key me-1" />Credentials ({credentials.length})
          </button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
            <i className="fas fa-sticky-note me-1" />Notes ({notes.length})
          </button>
        </li>
      </ul>

      {activeTab === 'credentials' && (
        credentials.length === 0 ? (
          <EmptyState
            icon="fa-key"
            title="No credentials in this folder"
            description="Add existing credentials from your vault or create a new one."
            action={(
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <button type="button" className="btn btn-outline-primary btn-modern btn-sm" onClick={() => setShowAssignModal(true)}>Add from List</button>
                <Link to={`/vault/add?folderId=${id}`} className="btn btn-primary btn-modern btn-sm">New Credential</Link>
              </div>
            )}
          />
        ) : (
          <div className="modern-table-wrap">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {credentials.map((c) => (
                  <tr key={c.id}>
                    <td><Link to={`/vault/${c.id}`} className="fw-semibold text-decoration-none">{c.serviceName}</Link></td>
                    <td>{renderFieldCell(c.username, 'No Username', 'Username')}</td>
                    <td>{renderFieldCell(c.email, 'No Email', 'Email')}</td>
                    <td>
                      <PasswordReveal
                        value={c.password}
                        onCopy={(text, label) => copyToClipboard(text, label)}
                      />
                    </td>
                    <td className="text-muted small">{new Date(c.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/vault/${c.id}/edit`} className="dash-action-btn" title="Edit"><i className="fas fa-pen" /></Link>
                        <button type="button" className="dash-action-btn" title="Move to folder" onClick={() => setMoveItem({ type: 'credential', id: c.id, name: c.serviceName })}>
                          <i className="fas fa-folder-open" />
                        </button>
                        <button type="button" className="dash-action-btn danger" title="Remove from folder" onClick={() => handleRemove('credential', c.id, c.serviceName)}>
                          <i className="fas fa-folder-minus" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {activeTab === 'notes' && (
        <>
          {editingNote && (
            <div className="dash-panel mb-4">
              <div className="dash-panel-header">
                <h5 className="dash-panel-title"><i className="fas fa-pen" />Edit Note</h5>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setEditingNote(null)}>
                  <i className="fas fa-times" />
                </button>
              </div>
              <form onSubmit={handleNoteSubmit} className="dash-panel-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Title</label>
                    <input
                      className="form-control form-control-modern"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                      maxLength={LIMITS.MAX_NOTE_TITLE_LENGTH}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-control form-control-modern"
                      rows="6"
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                      maxLength={LIMITS.MAX_NOTE_CONTENT_LENGTH}
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="folderNoteFavorite"
                        checked={noteForm.isFavorite}
                        onChange={(e) => setNoteForm({ ...noteForm, isFavorite: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="folderNoteFavorite">Mark as favorite</label>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn btn-primary btn-modern">Update Note</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditingNote(null)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {notes.length === 0 ? (
          <EmptyState
            icon="fa-sticky-note"
            title="No notes in this folder"
            description="Add existing notes from your vault or create a new one."
            action={(
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <button type="button" className="btn btn-outline-primary btn-modern btn-sm" onClick={() => setShowAssignModal(true)}>Add from List</button>
                <Link to={`/notes?folderId=${id}&new=1`} className="btn btn-primary btn-modern btn-sm">New Note</Link>
              </div>
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
                    <h5 className="note-card-title">{n.title}</h5>
                    <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                      <button type="button" className="dash-action-btn" title="Edit note" onClick={() => startEditNote(n)}>
                        <i className="fas fa-pen" />
                      </button>
                      <button type="button" className="dash-action-btn" title="Move to folder" onClick={() => setMoveItem({ type: 'note', id: n.id, name: n.title })}>
                        <i className="fas fa-folder-open" />
                      </button>
                      <button type="button" className="dash-action-btn danger" title="Remove from folder" onClick={() => handleRemove('note', n.id, n.title)}>
                        <i className="fas fa-folder-minus" />
                      </button>
                    </div>
                  </div>
                  <p className="text-muted small mb-2 note-card-preview">
                    {n.content || 'Empty note'}
                  </p>
                  <small className="text-muted">{new Date(n.updatedAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
      )}
    </div>
  );
};

export default FolderDetail;
