import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { vaultAPI } from '../../api';
import { showApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import VaultLockedState from '../../components/VaultLockedState';
import PasswordReveal from '../../components/PasswordReveal';
import { useConfirm } from '../../hooks/useConfirm';

const CredentialDetails = () => {
  const { confirm, ConfirmDialog } = useConfirm();
  const { id } = useParams();
  const navigate = useNavigate();
  const { vaultUnlocked } = useOutletContext();
  const [cred, setCred] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vaultUnlocked) { setLoading(false); return; }
    vaultAPI.getOne(id)
      .then((r) => setCred(r.data.data))
      .catch((err) => showApiError(err))
      .finally(() => setLoading(false));
  }, [id, vaultUnlocked]);

  const copy = (text, label) => { navigator.clipboard.writeText(text); toast.success(`${label} copied!`); };

  const handleDelete = async () => {
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
      navigate('/vault');
    } catch (err) { showApiError(err); }
  };

  if (!vaultUnlocked) return <VaultLockedState />;
  if (loading) return <LoadingSpinner />;
  if (!cred) return <p>Credential not found</p>;

  const CopyBtn = ({ text, label }) => (
    <button type="button" className="dash-action-btn" onClick={() => copy(text, label)} title={`Copy ${label}`}>
      <i className="fas fa-copy" />
    </button>
  );

  return (
    <div>
      {ConfirmDialog}
      <div className="dash-breadcrumb mb-3">
        <Link to="/vault"><i className="fas fa-arrow-left me-1" />Back to Vault</Link>
        {/* <Link to="/vault" className="btn btn-primary btn-sm"><i className="fas fa-arrow-left me-1" />Back to Vault</Link> */}
      </div>

      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="dash-page-icon"><i className="fas fa-key" /></div>
          <div>
            <h1 className="dash-page-title mb-1">{cred.serviceName}</h1>
            {cred.isFavorite && <span className="dash-badge warning mt-1"><i className="fas fa-star" />Favorite</span>}
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/vault/${id}/edit`} className="btn btn-primary btn-modern btn-sm">
            <i className="fas fa-pen me-1" />Edit
          </Link>
          <button type="button" className="btn btn-outline-danger btn-modern btn-sm" onClick={handleDelete}>
            <i className="fas fa-trash me-1" />Delete
          </button>
        </div>
      </div>

      <div className="credential-detail-card">
        <div className="credential-detail-section">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="credential-field">
                <div className="credential-field-label">Username</div>
                <div className="credential-field-value">
                  <span>{cred.username || <span className="text-muted">No Username</span>}</span>
                  {cred.username && <CopyBtn text={cred.username} label="Username" />}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="credential-field">
                <div className="credential-field-label">Email</div>
                <div className="credential-field-value">
                  <span>{cred.email || <span className="text-muted">No Email</span>}</span>
                  {cred.email && <CopyBtn text={cred.email} label="Email" />}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="credential-field">
                <div className="credential-field-label">Password</div>
                <div className="credential-field-value">
                  <PasswordReveal
                    value={cred.password}
                    buttonClassName="dash-action-btn"
                    onCopy={copy}
                  />
                </div>
              </div>
            </div>
            {cred.url && (
              <div className="col-md-6">
                <div className="credential-field">
                  <div className="credential-field-label">Website URL</div>
                  <div className="credential-field-value">
                    <a href={cred.url} target="_blank" rel="noreferrer" className="text-primary">{cred.url}</a>
                    <CopyBtn text={cred.url} label="URL" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {cred.notes && (
          <div className="credential-detail-section">
            <div className="credential-field">
              <div className="credential-field-label">Notes</div>
              <p className="credential-notes-content mb-0">{cred.notes}</p>
            </div>
          </div>
        )}

        {cred.tags?.length > 0 && (
          <div className="credential-detail-section">
            <div className="credential-field">
              <div className="credential-field-label">Tags</div>
              <div className="d-flex flex-wrap gap-1">
                {cred.tags.map((t) => <span key={t} className="dash-badge primary">{t}</span>)}
              </div>
            </div>
          </div>
        )}

        {cred.customFields?.length > 0 && (
          <div className="credential-detail-section">
            <div className="credential-field-label mb-3">Custom Fields</div>
            <div className="row g-3">
              {cred.customFields.map((cf, i) => {
                const isPasswordField = /password|pin|passcode|secret/i.test(cf.label || '');
                return (
                <div key={i} className="col-md-6">
                  <div className="credential-field">
                    <div className="credential-field-label">{cf.label}</div>
                    <div className="credential-field-value">
                      {isPasswordField ? (
                        <PasswordReveal value={cf.value} buttonClassName="dash-action-btn" onCopy={copy} copyLabel={cf.label} />
                      ) : (
                        <>
                          <span>{cf.value}</span>
                          <CopyBtn text={cf.value} label={cf.label} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );})}
            </div>
          </div>
        )}

        <div className="credential-detail-section bg-alt" style={{ background: 'var(--bg-alt)' }}>
          <small className="text-muted">
            <i className="fas fa-clock me-1" />
            Created {new Date(cred.createdAt).toLocaleString()} · Updated {new Date(cred.updatedAt).toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default CredentialDetails;
