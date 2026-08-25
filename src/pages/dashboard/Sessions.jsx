import { useEffect, useState } from 'react';
import { sessionAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import EmptyState from '../../components/EmptyState';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await sessionAPI.getAll();
      setSessions(res.data.data);
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRevoke = async (id) => {
    if (!window.confirm('Revoke this session?')) return;
    try {
      await sessionAPI.revoke(id);
      toast.success('Session revoked');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  const handleRevokeAll = async () => {
    if (!window.confirm('Revoke all other sessions?')) return;
    try {
      await sessionAPI.revokeAll();
      toast.success('All other sessions revoked');
      load();
    } catch (err) { toast.error(handleApiError(err).message); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <DashboardPageHeader
        icon="fa-desktop"
        title="Active Sessions"
        subtitle="Manage devices where your account is signed in"
        actions={
          sessions.length > 1 && (
            <button type="button" className="btn btn-outline-danger btn-modern btn-sm" onClick={handleRevokeAll}>
              <i className="fas fa-right-from-bracket me-1" />Logout All Devices
            </button>
          )
        }
      />

      {sessions.length === 0 ? (
        <EmptyState icon="fa-desktop" title="No active sessions" description="Your session information will appear here." />
      ) : (
        <div className="modern-table-wrap">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Device</th>
                <th>Browser</th>
                <th>IP Address</th>
                <th>Last Active</th>
                <th>Login</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="activity-dot"><i className="fas fa-laptop" /></div>
                      <span>{s.deviceInfo}</span>
                      {s.isCurrent && <span className="dash-badge primary">Current</span>}
                    </div>
                  </td>
                  <td className="text-muted">{s.browser}</td>
                  <td><code className="small">{s.ipAddress}</code></td>
                  <td className="text-muted small">{new Date(s.lastActive).toLocaleString()}</td>
                  <td className="text-muted small">{new Date(s.createdAt).toLocaleString()}</td>
                  <td className="text-end">
                    {!s.isCurrent && (
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRevoke(s.id)}>Revoke</button>
                    )}
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

export default Sessions;
