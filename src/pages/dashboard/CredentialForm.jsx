import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { vaultAPI, folderAPI, securityAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const FormSection = ({ icon, title, children }) => (
  <div className="form-section">
    <div className="form-section-header">
      <div className="form-section-icon"><i className={`fas ${icon}`} /></div>
      <h5 className="form-section-title">{title}</h5>
    </div>
    <div className="form-section-body">{children}</div>
  </div>
);

const CredentialForm = ({ initial = {}, isEdit = false }) => {
  const { vaultUnlocked } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(null);
  const [form, setForm] = useState({
    serviceName: '', username: '', email: '', password: '', url: '', notes: '',
    folderId: searchParams.get('folderId') || '', isFavorite: false, customFields: [],
    ...initial,
    tags: initial.tags?.join(', ') || '',
    folderId: initial.folderId || searchParams.get('folderId') || '',
  });

  useEffect(() => {
    if (vaultUnlocked) folderAPI.getAll().then((r) => setFolders(r.data.data)).catch(() => {});
  }, [vaultUnlocked]);

  useEffect(() => {
    if (form.password) {
      securityAPI.checkStrength(form.password).then((r) => setStrength(r.data.data)).catch(() => {});
    } else {
      setStrength(null);
    }
  }, [form.password]);

  const handleGenerate = async () => {
    try {
      const res = await securityAPI.generatePassword({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true });
      setForm({ ...form, password: res.data.data.password });
      setStrength(res.data.data.strength);
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const addCustomField = () => {
    setForm({ ...form, customFields: [...form.customFields, { label: '', value: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      folderId: form.folderId || null,
    };
    try {
      if (isEdit) {
        await vaultAPI.update(initial.id, data);
        toast.success('Credential updated');
        navigate(`/vault/${initial.id}`);
      } else {
        const res = await vaultAPI.create(data);
        toast.success('Credential created');
        navigate(`/vault/${res.data.data.id}`);
      }
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  if (!vaultUnlocked) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-lock fa-3x text-muted mb-3" />
        <p>Unlock your vault to add credentials.</p>
      </div>
    );
  }

  return (
    <div className="credential-form-page">
      <div className="d-flex align-items-center gap-2 mb-4">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left me-1" />Back
        </button>
      </div>

      <div className="credential-form-header mb-4">
        <div className="credential-form-header-icon">
          <i className={`fas ${isEdit ? 'fa-pen-to-square' : 'fa-plus'}`} />
        </div>
        <div>
          <h2 className="fw-bold mb-1">{isEdit ? 'Edit Credential' : 'Add New Credential'}</h2>
          <p className="text-muted mb-0">Securely store your login details with encrypted protection.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <FormSection icon="fa-globe" title="Service Details">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Service Name <span className="text-danger">*</span></label>
                  <input className="form-control form-control-modern" placeholder="e.g. Google, GitHub, Netflix" value={form.serviceName} onChange={(e) => setForm({ ...form, serviceName: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Folder</label>
                  <select className="form-select form-control-modern" value={form.folderId} onChange={(e) => setForm({ ...form, folderId: e.target.value })}>
                    <option value="">No Folder</option>
                    {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Website URL</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-link" /></span>
                    <input type="url" className="form-control form-control-modern" placeholder="https://example.com" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection icon="fa-user-lock" title="Login Credentials">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Username</label>
                  <input className="form-control form-control-modern" placeholder="Username or login ID" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control form-control-modern" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input type={showPassword ? 'text' : 'password'} className="form-control form-control-modern" placeholder="Enter or generate a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button type="button" className="btn btn-ghost" onClick={() => setShowPassword(!showPassword)} title="Toggle visibility">
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                    </button>
                    <button type="button" className="btn btn-primary btn-modern" onClick={handleGenerate}>
                      <i className="fas fa-wand-magic-sparkles me-1" />Generate
                    </button>
                  </div>
                  {strength && (
                    <div className="password-strength-bar mt-2">
                      <div className="progress" style={{ height: 4 }}>
                        <div className={`progress-bar bg-${strength.score >= 3 ? 'success' : 'warning'}`} style={{ width: `${(strength.score / 5) * 100}%` }} />
                      </div>
                      <small className="text-muted">Strength: {strength.label}</small>
                    </div>
                  )}
                </div>
              </div>
            </FormSection>

            <FormSection icon="fa-note-sticky" title="Additional Info">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control form-control-modern" rows="3" placeholder="Any additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Tags</label>
                  <input className="form-control form-control-modern" placeholder="work, personal, banking (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                </div>
              </div>
            </FormSection>

            <FormSection icon="fa-puzzle-piece" title="Custom Fields">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted small mb-0">Add extra fields like security questions, PINs, or recovery codes.</p>
                <button type="button" className="btn btn-sm btn-ghost" onClick={addCustomField}>
                  <i className="fas fa-plus me-1" />Add Field
                </button>
              </div>
              {form.customFields.length === 0 ? (
                <p className="text-muted small text-center py-3">No custom fields added yet.</p>
              ) : (
                form.customFields.map((cf, i) => (
                  <div key={i} className="row g-2 mb-2">
                    <div className="col-5">
                      <input className="form-control form-control-modern" placeholder="Label" value={cf.label} onChange={(e) => { const cfs = [...form.customFields]; cfs[i].label = e.target.value; setForm({ ...form, customFields: cfs }); }} />
                    </div>
                    <div className="col-5">
                      <input className="form-control form-control-modern" placeholder="Value" value={cf.value} onChange={(e) => { const cfs = [...form.customFields]; cfs[i].value = e.target.value; setForm({ ...form, customFields: cfs }); }} />
                    </div>
                    <div className="col-2">
                      <button type="button" className="btn btn-ghost text-danger w-100" onClick={() => setForm({ ...form, customFields: form.customFields.filter((_, j) => j !== i) })}>
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </FormSection>
          </div>

          <div className="col-lg-4">
            <div className="form-sidebar-card">
              <h6 className="fw-bold mb-3">Options</h6>
              <div className="form-check form-switch mb-4">
                <input type="checkbox" className="form-check-input" id="favorite" checked={form.isFavorite} onChange={(e) => setForm({ ...form, isFavorite: e.target.checked })} />
                <label className="form-check-label" htmlFor="favorite">
                  <i className="fas fa-star text-warning me-1" />Mark as Favorite
                </label>
              </div>
              <div className="form-sidebar-info">
                <i className="fas fa-shield-halved text-primary me-2" />
                <small className="text-muted">This credential will be encrypted with AES-256-GCM before storage.</small>
              </div>
              <hr />
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-modern" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin me-1" />Saving...</> : <><i className="fas fa-save me-1" />{isEdit ? 'Update Credential' : 'Save Credential'}</>}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export const AddCredential = () => <CredentialForm />;

export const EditCredential = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { vaultUnlocked } = useOutletContext();

  useEffect(() => {
    if (!vaultUnlocked) { setLoading(false); return; }
    vaultAPI.getOne(id).then((r) => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id, vaultUnlocked]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <p>Credential not found</p>;
  return <CredentialForm initial={data} isEdit />;
};

export default AddCredential;
