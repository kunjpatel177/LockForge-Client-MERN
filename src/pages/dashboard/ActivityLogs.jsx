import { useEffect, useState } from 'react';
import { activityAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import EmptyState from '../../components/EmptyState';

const actionLabels = {
  login: 'Login',
  logout: 'Logout',
  failed_login: 'Failed login',
  credential_created: 'Credential created',
  credential_updated: 'Credential updated',
  credential_deleted: 'Credential deleted',
  credential_restored: 'Credential restored',
  credential_permanently_deleted: 'Credential deleted permanently',
  export: 'Export',
  backup: 'Backup',
  restore: 'Restore',
  password_changed: 'Password changed',
  master_password_changed: 'Master password changed',
  session_revoked: 'Session revoked',
  note_created: 'Note created',
  note_updated: 'Note updated',
  note_deleted: 'Note deleted',
  folder_created: 'Folder created',
  folder_updated: 'Folder updated',
  folder_deleted: 'Folder deleted',
  trash_emptied: 'Trash emptied',
  settings_updated: 'Settings updated',
  email_changed: 'Email changed',
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 20 });
  const [loading, setLoading] = useState(true);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await activityAPI.getAll({ page, limit: 20 });
      setLogs(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <DashboardPageHeader
        icon="fa-clock-rotate-left"
        title="Activity Logs"
        subtitle="Review account actions, IP addresses, and approximate locations"
      />

      {logs.length === 0 ? (
        <EmptyState icon="fa-clock-rotate-left" title="No activity yet" description="Your account activity will be recorded here." />
      ) : (
        <>
          <div className="modern-table-wrap">
            <table className="table table-hover mb-0 activity-history-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Details</th>
                  <th>IP Address</th>
                  <th>Location</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <span className="activity-action text-capitalize">
                        {actionLabels[log.action] || log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="text-muted small">{log.description || '—'}</td>
                    <td><code className="small">{log.ipAddress || 'Unknown'}</code></td>
                    <td className="text-muted small">
                      <i className="fas fa-location-dot me-1 text-primary" />
                      {log.location || 'Unknown location'}
                    </td>
                    <td className="text-muted small text-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.total > pagination.limit && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button type="button" className="btn btn-sm btn-ghost" disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)}>
                <i className="fas fa-chevron-left me-1" />Previous
              </button>
              <span className="text-muted small">Page {pagination.page}</span>
              <button type="button" className="btn btn-sm btn-ghost" disabled={pagination.page * pagination.limit >= pagination.total} onClick={() => load(pagination.page + 1)}>
                Next<i className="fas fa-chevron-right ms-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityLogs;
