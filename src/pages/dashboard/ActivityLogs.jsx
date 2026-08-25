import { useEffect, useState } from 'react';
import { activityAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import EmptyState from '../../components/EmptyState';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });
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

  const actionIcons = {
    login: 'fa-right-to-bracket text-success',
    logout: 'fa-right-from-bracket',
    failed_login: 'fa-triangle-exclamation text-danger',
    credential_created: 'fa-plus text-primary',
    credential_updated: 'fa-pen text-info',
    credential_deleted: 'fa-trash text-warning',
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <DashboardPageHeader
        icon="fa-clock-rotate-left"
        title="Activity Logs"
        subtitle="Review account actions and security events"
      />

      {logs.length === 0 ? (
        <EmptyState icon="fa-clock-rotate-left" title="No activity yet" description="Your account activity will be recorded here." />
      ) : (
        <>
          <div className="dash-panel">
            <div className="dash-panel-body p-0">
              <div className="activity-timeline px-3">
                {logs.map((log) => (
                  <div key={log._id} className="activity-item">
                    <div className="activity-dot">
                      <i className={`fas ${actionIcons[log.action] || 'fa-circle'}`} />
                    </div>
                    <div className="activity-content">
                      <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                        <div>
                          <span className="activity-action">{log.action.replace(/_/g, ' ')}</span>
                          {log.description && <p className="text-muted small mb-0 mt-1">{log.description}</p>}
                          <small className="text-muted">IP: {log.ipAddress}</small>
                        </div>
                        <span className="activity-time">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {pagination.total > 20 && (
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
