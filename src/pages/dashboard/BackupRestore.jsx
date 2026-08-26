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

  const handleExport = async () => {
    if (!masterPassword) return toast.error('Enter master password');
    setLoading(true);
    try {
      const res = await backupAPI.exportBackup(masterPassword);
      const blob = new Blob([JSON.stringify(res.data.data.backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lockforge-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Backup exported');
      setMasterPassword('');
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  const handleImport = async () => {
    if (!masterPassword || !backupFile) return toast.error('Enter master password and select backup file');
    const replace = await confirm({
      title: 'Replace Vault Data?',
      message: 'Do you want to replace your existing vault data with this backup? Choose Cancel to merge instead.',
      confirmLabel: 'Replace all',
      cancelLabel: 'Merge',
      variant: 'warning',
      icon: 'fa-file-import',
    });
    setLoading(true);
    try {
      const text = await backupFile.text();
      const backup = JSON.parse(text);
      await backupAPI.importBackup({ masterPassword, backup, replace });
      toast.success('Backup restored');
      setMasterPassword('');
      setBackupFile(null);
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  const handlePDF = async () => {
    if (!masterPassword) return toast.error('Enter master password');
    const ok = await confirm({
      title: 'Export PDF Warning',
      message: 'The PDF will contain decrypted credentials and notes organized by folder. Only continue if you understand the security risk.',
      confirmLabel: 'Export PDF',
      variant: 'warning',
      icon: 'fa-file-pdf',
    });
    if (!ok) return;
    setLoading(true);
    try {
      const res = await backupAPI.exportPDF(masterPassword);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lockforge-export-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported');
      setMasterPassword('');
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  if (!vaultUnlocked) return <VaultLockedState />;

  return (
    <div>
      {ConfirmDialog}
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
            <p className="text-muted small flex-grow-1">Download an encrypted JSON backup of your entire vault for safekeeping.</p>
            <button type="button" className="btn btn-primary btn-modern" onClick={handleExport} disabled={loading}>
              <i className="fas fa-download me-1" />Export
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="backup-card">
            <div className="backup-card-icon import"><i className="fas fa-upload" /></div>
            <h5 className="fw-bold mb-2">Import Backup</h5>
            <p className="text-muted small">Restore your vault from a previously exported backup file.</p>
            <input type="file" className="form-control form-control-modern mb-3" accept=".json" onChange={(e) => setBackupFile(e.target.files[0])} />
            <button type="button" className="btn btn-primary btn-modern" onClick={handleImport} disabled={loading}>
              <i className="fas fa-upload me-1" />Import
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="backup-card">
            <div className="backup-card-icon pdf"><i className="fas fa-file-pdf" /></div>
            <h5 className="fw-bold mb-2">PDF Export</h5>
            <p className="text-muted small text-danger">Folder-wise export of credentials and secure notes. Handle with extreme care.</p>
            <button type="button" className="btn btn-outline-danger btn-modern" onClick={handlePDF} disabled={loading}>
              <i className="fas fa-file-pdf me-1" />Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
