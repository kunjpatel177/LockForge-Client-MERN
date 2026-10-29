import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { backupAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';
import { useConfirm } from '../../hooks/useConfirm';
import PasswordInput from '../../components/PasswordInput';

const BackupRestore = () => {
  const { confirm, ConfirmDialog } = useConfirm();
  const { vaultUnlocked } = useOutletContext();
  const [masterPassword, setMasterPassword] = useState('');
  const [backupFile, setBackupFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMode, setImportMode] = useState('smart_merge');

  const handleExport = async () => {
    if (!masterPassword) return toast.error('Enter master password');
    setLoading(true);
    try {
      const res = await backupAPI.exportBackup(masterPassword);
      const blob = new Blob([JSON.stringify(res.data.data.backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lockforge-backup-${new Date().toISOString().split('T')[0]}-${new Date().toLocaleTimeString()}.json`;
      // a.download = `lockforge-backup-${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Backup exported');
      setMasterPassword('');
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  const handleImport = () => {
    if (!masterPassword) return toast.error('Enter your master password first');
    if (!backupFile) return toast.error('Select a backup JSON file first');
    setShowImportModal(true);
  };

  const executeImport = async () => {
    if (!masterPassword || !backupFile) {
      return toast.error('Enter master password and select backup file');
    }
    setLoading(true);
    try {
      const text = await backupFile.text();
      const backup = JSON.parse(text);
      const res = await backupAPI.importBackup({
        masterPassword,
        backup,
        mode: importMode,
      });

      const summary = res.data?.data?.summary;
      if (summary) {
        if (importMode === 'replace_all') {
          toast.success(
            `Vault restored! Replaced with ${summary.credentialsCreated} credentials, ${summary.notesCreated} notes, and ${summary.foldersCreated} folders.`
          );
        } else {
          toast.success(
            `Backup merged! Updated: ${summary.credentialsUpdated} creds, ${summary.notesUpdated} notes. Added: ${summary.credentialsCreated} creds, ${summary.notesCreated} notes.`
          );
        }
      } else {
        toast.success(res.data?.message || 'Backup restored successfully');
      }

      setShowImportModal(false);
      setMasterPassword('');
      setBackupFile(null);
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePDF = async () => {
    if (!masterPassword) return toast.error('Enter master password');
    const ok = await confirm({
      title: 'Password-Protected PDF Export',
      message: 'Your exported PDF will be encrypted and password-protected. You will need to enter your Master Password whenever you open this PDF file.',
      confirmLabel: 'Export Protected PDF',
      variant: 'primary',
      icon: 'fa-file-shield',
    });
    if (!ok) return;
    setLoading(true);
    try {
      const res = await backupAPI.exportPDF(masterPassword);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lockforge-export-${new Date().toISOString().split('T')[0]}-${new Date().toLocaleTimeString()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported! Use your Master Password to open it.');
      setMasterPassword('');
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  if (!vaultUnlocked) return <VaultLockedState />;

  return (
    <div>
      {ConfirmDialog}

      {showImportModal && (
        <div
          className="modal show d-block confirm-modal-backdrop"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) setShowImportModal(false);
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable backup-import-modal-dialog">
            <div className="modal-content border-0 shadow backup-import-modal-content">
              <div className="modal-header border-0 pb-0 flex-shrink-0">
                <div className="d-flex align-items-center gap-2">
                  <div className="backup-import-icon-badge">
                    <i className="fas fa-file-import" />
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0" style={{ fontSize: '1.05rem' }}>Select Import Option</h5>
                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>Choose how you want to restore your vault data</small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowImportModal(false)}
                  disabled={loading}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body py-3 py-sm-4 backup-import-modal-body">
                <div className="d-flex flex-column gap-3">
                  {/* Option 1: Smart Merge */}
                  <div
                    className={`rounded-3 backup-import-option ${
                      importMode === 'smart_merge' ? 'active-smart' : ''
                    }`}
                    onClick={() => setImportMode('smart_merge')}
                  >
                    <div className="d-flex align-items-start gap-2 gap-sm-3">
                      <input
                        type="radio"
                        name="importMode"
                        id="modeSmartMerge"
                        className="form-check-input mt-1 flex-shrink-0"
                        checked={importMode === 'smart_merge'}
                        onChange={() => setImportMode('smart_merge')}
                      />
                      <div className="flex-grow-1">
                        <label htmlFor="modeSmartMerge" className="fw-bold mb-1 d-block text-body" style={{ cursor: 'pointer' }}>
                          <i className="fas fa-arrows-rotate text-primary me-2" />
                          Option 1: Smart Merge &amp; Replace Matching (Recommended)
                        </label>
                        <p className="text-muted small mb-0">
                          Replaces only credentials with the <strong>same service name</strong>, notes with the <strong>same title</strong>, and folders with the <strong>same folder name</strong>. Also imports missing items. All your other existing vault items remain safe and untouched, and <strong>hidden items stay hidden</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Replace All Data */}
                  <div
                    className={`rounded-3 backup-import-option ${
                      importMode === 'replace_all' ? 'active-replace' : ''
                    }`}
                    onClick={() => setImportMode('replace_all')}
                  >
                    <div className="d-flex align-items-start gap-2 gap-sm-3">
                      <input
                        type="radio"
                        name="importMode"
                        id="modeReplaceAll"
                        className="form-check-input mt-1 flex-shrink-0"
                        checked={importMode === 'replace_all'}
                        onChange={() => setImportMode('replace_all')}
                      />
                      <div className="flex-grow-1">
                        <label htmlFor="modeReplaceAll" className="fw-bold mb-1 d-block text-danger" style={{ cursor: 'pointer' }}>
                          <i className="fas fa-triangle-exclamation text-danger me-2" />
                          Option 2: Replace All Vault Data (Full Wipe &amp; Restore)
                        </label>
                        <p className="text-muted small mb-0">
                          Permanently wipes <strong>all existing credentials, folders, and secure notes</strong> in your vault and replaces them exclusively with the items from this backup file. <strong>Hidden items are restored to their hidden state</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 pt-2 flex-shrink-0">
                <div className="backup-import-footer-btns d-flex w-100 justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-modern"
                    onClick={() => setShowImportModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn ${importMode === 'replace_all' ? 'btn-danger' : 'btn-primary'} btn-modern`}
                    onClick={executeImport}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Restoring...
                      </>
                    ) : importMode === 'replace_all' ? (
                      <>
                        <i className="fas fa-triangle-exclamation me-1" />Replace All &amp; Restore
                      </>
                    ) : (
                      <>
                        <i className="fas fa-arrows-rotate me-1" />Smart Merge &amp; Restore
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DashboardPageHeader
        icon="fa-cloud-arrow-up"
        title="Backup & Restore"
        subtitle="Export, import, or print your vault data"
      />

      <div className="dash-panel mb-4">
        <div className="dash-panel-body">
          <label className="form-label fw-semibold"><i className="fas fa-lock me-1 text-primary" />Master Password</label>
          <p className="text-muted small mb-2">Required for all backup and restore operations.</p>
          <div style={{ maxWidth: 400 }}>
            <PasswordInput
              className="form-control form-control-modern"
              placeholder="Enter your master password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="backup-card">
            <div className="backup-card-icon export"><i className="fas fa-download" /></div>
            <h5 className="fw-bold mb-2">Export Backup</h5>
            <p className="text-muted small flex-grow-1">Download an encrypted JSON backup of your entire vault (including hidden items) for safekeeping.</p>
            <button type="button" className="btn btn-primary btn-modern" onClick={handleExport} disabled={loading}>
              <i className="fas fa-download me-1" />Export
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="backup-card">
            <div className="backup-card-icon import"><i className="fas fa-upload" /></div>
            <h5 className="fw-bold mb-2">Import Backup</h5>
            <p className="text-muted small">Restore your vault from a previously exported backup file (hidden items stay hidden).</p>
            <input type="file" className="form-control form-control-modern mb-3" accept=".json" onChange={(e) => setBackupFile(e.target.files[0])} />
            <button type="button" className="btn btn-primary btn-modern" onClick={handleImport} disabled={loading}>
              <i className="fas fa-upload me-1" />Import
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="backup-card">
            <div className="backup-card-icon pdf"><i className="fas fa-file-pdf" /></div>
            <h5 className="fw-bold mb-1">PDF Export</h5>
            <div className="mb-2">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                <i className="fas fa-lock me-1" />Password Protected
              </span>
            </div>
            <p className="text-muted small flex-grow-1">
              Encrypted folder-wise export of credentials and secure notes (with hidden badges). Protected by your Master Password.
            </p>
            <button type="button" className="btn btn-outline-primary btn-modern" onClick={handlePDF} disabled={loading}>
              <i className="fas fa-file-pdf me-1" />Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
