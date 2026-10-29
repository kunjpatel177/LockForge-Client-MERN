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
  const [searchScope, setSearchScope] = useState('all');
  const [folderFilter, setFolderFilter] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');
  const [sort, setSort] = useState('updatedAt');
  const [totalCount, setTotalCount] = useState(0);
  const [counts, setCounts] = useState({ all: 0, favorites: 0, inFolder: 0, unassigned: 0 });
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
      const params = {
        search: debouncedSearch,
        scope: searchScope,
        sort: sort === 'titleDesc' ? 'title' : sort,
        order: sort === 'title' ? 'asc' : 'desc',
      };
      if (folderFilter === 'unassigned') {
        params.unassigned = 'true';
      } else if (folderFilter) {
        params.folderId = folderFilter;
      }
      if (quickFilter === 'favorites') params.favorite = 'true';
      if (quickFilter === 'inFolder') params.hasFolder = 'true';
      if (quickFilter === 'unassigned') params.unassigned = 'true';

      const [noteRes, folderRes, baselineRes] = await Promise.all([
        noteAPI.getAll(params),
        folderAPI.getAll(),
        noteAPI.getAll({}),
      ]);
      setNotes(noteRes.data.data);
      setFolders(folderRes.data.data);
      const allNotes = baselineRes.data.data || [];
      setTotalCount(allNotes.length);
      setCounts({
        all: allNotes.length,
        favorites: allNotes.filter((n) => n.isFavorite).length,
        inFolder: allNotes.filter((n) => !!n.folderId).length,
        unassigned: allNotes.filter((n) => !n.folderId).length,
      });
    } catch (err) { showApiError(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    load();
  }, [vaultUnlocked, debouncedSearch, searchScope, folderFilter, quickFilter, sort]);

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSearchScope('all');
    setFolderFilter('');
    setQuickFilter('all');
    setSort('updatedAt');
  };

  const isFiltered = Boolean(search || searchScope !== 'all' || folderFilter || quickFilter !== 'all' || sort !== 'updatedAt');

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
        {/* Main Search Input */}
        <div className="dash-search-wrap">
          <i className="fas fa-search" />
          <input
            className="form-control"
            placeholder={
              searchScope === 'title'
                ? 'Search note titles...'
                : searchScope === 'content'
                ? 'Search note content...'
                : 'Search notes by title or content...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="dash-search-clear"
              onClick={() => setSearch('')}
              title="Clear search"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        {/* Search Scope */}
        <select
          className="form-select"
          style={{ maxWidth: 180 }}
          value={searchScope}
          onChange={(e) => setSearchScope(e.target.value)}
        >
          <option value="all">🔍 Title &amp; Content</option>
          <option value="title">🏷️ Title Only</option>
          <option value="content">📄 Content Only</option>
        </select>

        {/* Folder Filter */}
        <select
          className="form-select"
          style={{ maxWidth: 165 }}
          value={folderFilter}
          onChange={(e) => setFolderFilter(e.target.value)}
        >
          <option value="">📁 All Folders</option>
          <option value="unassigned">📂 Unassigned</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Sorting */}
        <select
          className="form-select"
          style={{ maxWidth: 175 }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="updatedAt">⚡ Recently Updated</option>
          <option value="title">🔤 Title (A-Z)</option>
          <option value="titleDesc">🔤 Title (Z-A)</option>
          <option value="createdAt">🕒 Date Created</option>
          <option value="favoriteFirst">⭐ Favorites First</option>
        </select>

        {/* Quick Filter Pills */}
        <div className="search-filter-pills">
          <button
            type="button"
            className={`search-filter-pill ${quickFilter === 'all' ? 'active' : ''}`}
            onClick={() => setQuickFilter('all')}
          >
            All <span className="opacity-75">({counts.all})</span>
          </button>
          <button
            type="button"
            className={`search-filter-pill ${quickFilter === 'favorites' ? 'active' : ''}`}
            onClick={() => setQuickFilter('favorites')}
          >
            <i className="fas fa-star text-warning" /> Favorites <span className="opacity-75">({counts.favorites})</span>
          </button>
          <button
            type="button"
            className={`search-filter-pill ${quickFilter === 'inFolder' ? 'active' : ''}`}
            onClick={() => setQuickFilter('inFolder')}
          >
            <i className="fas fa-folder" /> In Folder <span className="opacity-75">({counts.inFolder})</span>
          </button>
          <button
            type="button"
            className={`search-filter-pill ${quickFilter === 'unassigned' ? 'active' : ''}`}
            onClick={() => setQuickFilter('unassigned')}
          >
            <i className="fas fa-file" /> Unassigned <span className="opacity-75">({counts.unassigned})</span>
          </button>
        </div>

        {/* Result Counter & Reset */}
        {isFiltered && (
          <div className="search-result-info">
            <span>
              Showing <strong>{notes.length}</strong> of <strong>{totalCount}</strong> secure note{totalCount !== 1 ? 's' : ''}
              {search && <span> matching &quot;{search}&quot;</span>}
            </span>
            <button type="button" className="btn btn-link" onClick={clearFilters}>
              <i className="fas fa-rotate-left me-1" />Reset Filters
            </button>
          </div>
        )}
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
        isFiltered ? (
          <EmptyState
            icon="fa-magnifying-glass"
            title="No notes found"
            description="No notes match your active search and filter criteria. Try adjusting your query or resetting filters."
            action={
              <button type="button" className="btn btn-outline-primary btn-modern" onClick={clearFilters}>
                <i className="fas fa-rotate-left me-1" />Clear All Filters
              </button>
            }
          />
        ) : (
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
        )
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
