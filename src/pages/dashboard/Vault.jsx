import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { vaultAPI, folderAPI } from '../../api';
import { showApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';
import MoveToFolderModal from '../../components/MoveToFolderModal';
import PasswordReveal from '../../components/PasswordReveal';
import { useConfirm } from '../../hooks/useConfirm';

const Vault = () => {
  const { confirm, ConfirmDialog } = useConfirm();
  const { vaultUnlocked } = useOutletContext();
  const [credentials, setCredentials] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('');
  const [sort, setSort] = useState('updatedAt');
  const [moveItem, setMoveItem] = useState(null);

  const load = async () => {
    if (!vaultUnlocked) { setLoading(false); return; }
    try {
      const [credRes, folderRes] = await Promise.all([
        vaultAPI.getAll({ search, folderId: folderFilter, sort, order: 'desc' }),
        folderAPI.getAll(),
      ]);
      setCredentials(credRes.data.data);
      setFolders(folderRes.data.data);
    } catch (err) {
      showApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [vaultUnlocked, search, folderFilter, sort]);

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Move to Trash',
      message: 'This credential will be moved to trash. You can restore it later.',
      confirmLabel: 'Move to trash',
      icon: 'fa-trash',
    });
    if (!ok) return;
    try {
      await vaultAPI.delete(id);
      toast.success('Moved to trash');
      load();
    } catch (err) { showApiError(err); }
  };

  const handleFavorite = async (id) => {
    try {
      await vaultAPI.toggleFavorite(id);
      load();
    } catch (err) { showApiError(err); }
  };

  const handleMove = async (folderId) => {
    if (!moveItem) return;
    await vaultAPI.moveToFolder(moveItem.id, folderId);
    toast.success(folderId ? 'Moved to folder' : 'Removed from folder');
    load();
  };

  const folderName = (folderId) => folders.find((f) => String(f.id) === String(folderId))?.name || 'Unknown';

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

  const renderPasswordCell = (cred) => (
    <PasswordReveal value={cred.password} onCopy={copyToClipboard} />
  );

  if (!vaultUnlocked) return <VaultLockedState />;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {ConfirmDialog}
      <MoveToFolderModal
        show={!!moveItem}
        itemType="credential"
        itemName={moveItem?.name}
        currentFolderId={moveItem?.folderId}
        onClose={() => setMoveItem(null)}
        onMove={handleMove}
      />
      <DashboardPageHeader
        icon="fa-vault"
        title="Vault"
        subtitle={`${credentials.length} credential${credentials.length !== 1 ? 's' : ''} stored securely`}
        actions={
          <Link to="/vault/add" className="btn btn-primary btn-modern">
            <i className="fas fa-plus me-1" />Add Credential
          </Link>
        }
      />

      <div className="dash-filter-bar">
        <div className="dash-search-wrap">
          <i className="fas fa-search" />
          <input className="form-control" placeholder="Search credentials..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ maxWidth: 200 }} value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)}>
          <option value="">All Folders</option>
          {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth: 200 }} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="updatedAt">Recently Updated</option>
          <option value="serviceName">Service Name</option>
          <option value="createdAt">Date Created</option>
        </select>
      </div>

      {credentials.length === 0 ? (
        <EmptyState
          icon="fa-vault"
          title="No credentials yet"
          description="Start building your secure vault by adding your first login."
          action={<Link to="/vault/add" className="btn btn-primary btn-modern">Add Credential</Link>}
        />
      ) : (
        <div className="modern-table-wrap">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ width: 40 }} />
                <th>Service</th>
                <th>Folder</th>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Updated</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map((c) => (
                <tr key={c.id}>
                  <td>
                    <button type="button" className="btn btn-link btn-sm p-0" onClick={() => handleFavorite(c.id)}>
                      <i className={`fas fa-star ${c.isFavorite ? 'text-warning' : 'text-muted'}`} />
                    </button>
                  </td>
                  <td><Link to={`/vault/${c.id}`} className="fw-semibold text-decoration-none">{c.serviceName}</Link></td>
                  <td>
                    {c.folderId ? (
                      <Link to={`/folders/${c.folderId}`} className="dash-badge primary text-decoration-none">{folderName(c.folderId)}</Link>
                    ) : <span className="text-muted small">Unassigned</span>}
                  </td>
                  <td>{renderFieldCell(c.username, 'No Username', 'Username')}</td>
                  <td>{renderFieldCell(c.email, 'No Email', 'Email')}</td>
                  <td>{renderPasswordCell(c)}</td>
                  <td className="text-muted small">{new Date(c.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button type="button" className="dash-action-btn" title="Move to folder" onClick={() => setMoveItem({ id: c.id, name: c.serviceName, folderId: c.folderId })}>
                        <i className="fas fa-folder-open" />
                      </button>
                      <Link to={`/vault/${c.id}/edit`} className="dash-action-btn" title="Edit"><i className="fas fa-pen" /></Link>
                      <button type="button" className="dash-action-btn danger" title="Delete" onClick={() => handleDelete(c.id)}><i className="fas fa-trash" /></button>
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

export default Vault;
