import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { vaultAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';

const Trash = () => {
  const { vaultUnlocked } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!vaultUnlocked) { setLoading(false); return; }
    try {
      const res = await vaultAPI.getTrash();
      setItems(res.data.data);
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [vaultUnlocked]);

  const handleRestore = async (id) => {
    try {
      await vaultAPI.restore(id);
      toast.success('Restored');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Permanently delete? This cannot be undone.')) return;
    try {
      await vaultAPI.permanentDelete(id);
      toast.success('Permanently deleted');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm('Empty trash? All items will be permanently deleted.')) return;
    try {
      await vaultAPI.emptyTrash();
      toast.success('Trash emptied');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  if (!vaultUnlocked) return <VaultLockedState />;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <DashboardPageHeader
        icon="fa-trash"
        title="Trash"
        subtitle="Deleted credentials can be restored or permanently removed"
        actions={
          items.length > 0 && (
            <button type="button" className="btn btn-outline-danger btn-modern btn-sm" onClick={handleEmptyTrash}>
              <i className="fas fa-trash-can me-1" />Empty Trash
            </button>
          )
        }
      />

      {items.length === 0 ? (
        <EmptyState icon="fa-trash-can" title="Trash is empty" description="Deleted credentials will appear here before permanent removal." />
      ) : (
        <div className="modern-table-wrap">
          <table className="table table-hover mb-0">
            <thead>
              <tr><th>Service</th><th>Deleted</th><th style={{ width: 200 }}>Actions</th></tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td className="fw-semibold">{c.serviceName}</td>
                  <td className="text-muted small">{new Date(c.deletedAt).toLocaleString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-sm btn-outline-success" onClick={() => handleRestore(c.id)}>
                        <i className="fas fa-rotate-left me-1" />Restore
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handlePermanentDelete(c.id)}>
                        <i className="fas fa-trash me-1" />Delete
                      </button>
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

export default Trash;
