import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { folderAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import EmptyState from '../../components/EmptyState';

const Folders = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');

  const load = async () => {
    try {
      const res = await folderAPI.getAll();
      setFolders(res.data.data);
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await folderAPI.create(newName.trim());
      setNewName('');
      toast.success('Folder created');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handleRename = async (folderId) => {
    if (!editName.trim()) return;
    try {
      await folderAPI.update(folderId, editName.trim());
      setEditing(null);
      toast.success('Folder renamed');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handleDelete = async (folderId, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete folder "${name}"? Items will be unassigned.`)) return;
    try {
      await folderAPI.delete(folderId);
      toast.success('Folder deleted');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const openFolder = (folderId) => navigate(`/folders/${folderId}`);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <DashboardPageHeader
        icon="fa-folder"
        title="Folders"
        subtitle="Organize credentials and notes into collections"
      />

      <form onSubmit={handleCreate} className="folder-create-bar mb-4">
        <i className="fas fa-folder-plus text-primary" />
        <input className="form-control border-0 bg-transparent" placeholder="New folder name..." value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button type="submit" className="btn btn-primary btn-modern btn-sm folder-btn">Create Folder</button>
      </form>

      {folders.length === 0 ? (
        <EmptyState
          icon="fa-folder-open"
          title="No folders yet"
          description="Create your first folder to organize credentials and notes."
        />
      ) : (
        <div className="row g-3">
          {folders.map((f) => (
            <div key={f.id} className="col-md-6 col-lg-4">
              <div
                className="folder-card"
                onClick={() => editing !== f.id && openFolder(f.id)}
                onKeyDown={(e) => e.key === 'Enter' && editing !== f.id && openFolder(f.id)}
                role="button"
                tabIndex={0}
              >
                {editing === f.id ? (
                  <div className="d-flex gap-2 w-100" onClick={(e) => e.stopPropagation()}>
                    <input className="form-control form-control-sm" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => handleRename(f.id)}>Save</button>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="folder-card-icon"><i className="fas fa-folder" /></div>
                    <div className="folder-card-body">
                      <h5 className="folder-card-title">{f.name}</h5>
                      <div className="folder-card-meta">
                        <span><i className="fas fa-key me-1" />{f.credentialCount} credentials</span>
                        <span><i className="fas fa-sticky-note me-1" />{f.noteCount || 0} notes</span>
                      </div>
                    </div>
                    <div className="folder-card-actions" onClick={(e) => e.stopPropagation()}>
                      <button type="button" className="dash-action-btn" title="Rename" onClick={() => { setEditing(f.id); setEditName(f.name); }}>
                        <i className="fas fa-pen" />
                      </button>
                      {!f.isDefault && (
                        <button type="button" className="dash-action-btn danger" title="Delete" onClick={(e) => handleDelete(f.id, f.name, e)}>
                          <i className="fas fa-trash" />
                        </button>
                      )}
                    </div>
                    <div className="folder-card-arrow"><i className="fas fa-chevron-right" /></div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Folders;
