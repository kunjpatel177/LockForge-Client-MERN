import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { folderAPI, vaultAPI, noteAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';

const FolderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vaultUnlocked } = useOutletContext();
  const [folder, setFolder] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('credentials');
  const [showPasswords, setShowPasswords] = useState({});

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
          <Link to={`/vault/add?folderId=${id}`} className="btn btn-primary btn-modern btn-sm">
            <i className="fas fa-plus me-1" />Add Credential
          </Link>
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
            description="Add credentials to keep this folder organized."
            action={<Link to={`/vault/add?folderId=${id}`} className="btn btn-primary btn-modern btn-sm">Add Credential</Link>}
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
                      {c.password ? (
                        <>
                          <code>{showPasswords[c.id] ? c.password : '••••••••'}</code>
                          <button type="button" className="btn btn-link btn-sm p-0 ms-1" onClick={() => setShowPasswords({ ...showPasswords, [c.id]: !showPasswords[c.id] })}>
                            <i className={`fas ${showPasswords[c.id] ? 'fa-eye-slash' : 'fa-eye'}`} />
                          </button>
                        </>
                      ) : <span className="text-muted">No Password</span>}
                    </td>
                    <td className="text-muted small">{new Date(c.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/vault/${c.id}/edit`} className="dash-action-btn"><i className="fas fa-pen" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {activeTab === 'notes' && (
        notes.length === 0 ? (
          <EmptyState
            icon="fa-sticky-note"
            title="No notes in this folder"
            description="Create secure notes and assign them to this folder."
            action={<Link to="/notes" className="btn btn-primary btn-modern btn-sm">Go to Secure Notes</Link>}
          />
        ) : (
          <div className="row g-3">
            {notes.map((n) => (
              <div key={n.id} className="col-md-6">
                <div className="note-card">
                  <div className="note-card-header">
                    <h5 className="note-card-title">{n.title}</h5>
                    {n.isFavorite && <i className="fas fa-star text-warning" />}
                  </div>
                  <p className="text-muted small mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                    {n.content?.substring(0, 200)}{n.content?.length > 200 ? '...' : ''}
                  </p>
                  <small className="text-muted">{new Date(n.updatedAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default FolderDetail;
