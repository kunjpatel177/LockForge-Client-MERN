import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { securityAPI, vaultAPI, activityAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';

const activityIcons = {
  login: 'fa-right-to-bracket text-success',
  logout: 'fa-right-from-bracket',
  failed_login: 'fa-triangle-exclamation text-danger',
  credential_created: 'fa-plus text-primary',
  credential_updated: 'fa-pen text-info',
  credential_deleted: 'fa-trash text-warning',
};

const Dashboard = () => {
  const { user, stats, vaultUnlocked } = useAuth();
  const [security, setSecurity] = useState(null);
  const [recent, setRecent] = useState([]);
  const [recentCreds, setRecentCreds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const actRes = await activityAPI.getRecent();
        setRecent(actRes.data.data);
        if (vaultUnlocked) {
          const [secRes, credRes] = await Promise.all([
            securityAPI.getDashboard(),
            vaultAPI.getAll({ sort: 'updatedAt', order: 'desc' }),
          ]);
          setSecurity(secRes.data.data);
          setRecentCreds(credRes.data.data.slice(0, 5));
        }
      } catch (err) {
        console.error(handleApiError(err).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vaultUnlocked]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <DashboardPageHeader
        icon="fa-gauge-high"
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}`}
        subtitle="Here's an overview of your vault and security status."
      />

      <div className="row g-3 mb-4">
        {[
          { label: 'Credentials', value: stats?.credentialCount || 0, icon: 'fa-key', color: 'indigo' },
          { label: 'Favorites', value: stats?.favoriteCount || 0, icon: 'fa-star', color: 'amber' },
          { label: 'Folders', value: stats?.folderCount || 0, icon: 'fa-folder', color: 'cyan' },
          { label: 'Security Score', value: vaultUnlocked ? `${security?.securityScore || 0}%` : '—', icon: 'fa-shield-halved', color: 'green' },
        ].map((s) => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="dash-stat-card">
              <div className={`dash-stat-icon ${s.color}`}><i className={`fas ${s.icon}`} /></div>
              <div>
                <div className="dash-stat-label">{s.label}</div>
                <div className="dash-stat-value">{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!vaultUnlocked ? (
        <VaultLockedState message="Unlock your vault to view security insights and recent credentials." />
      ) : (
        <>
          {security && (
            <div className="row g-3 mb-4">
              {[
                { label: 'Weak Passwords', value: security.weakCount, color: 'warning', icon: 'fa-triangle-exclamation' },
                { label: 'Reused Passwords', value: security.reusedCount, color: 'red', icon: 'fa-clone' },
                { label: 'Old Passwords', value: security.oldCount, color: 'violet', icon: 'fa-clock' },
              ].map((s) => (
                <div key={s.label} className="col-md-4">
                  <div className="dash-stat-card">
                    <div className={`dash-stat-icon ${s.color}`}><i className={`fas ${s.icon}`} /></div>
                    <div>
                      <div className="dash-stat-label">{s.label}</div>
                      <div className="dash-stat-value">{s.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="dash-panel">
                <div className="dash-panel-header">
                  <h5 className="dash-panel-title"><i className="fas fa-bolt text-warning" />Quick Actions</h5>
                </div>
                <div className="dash-panel-body">
                  <div className="dash-quick-actions">
                    {[
                      { to: '/vault/add', icon: 'fa-plus', label: 'Add Credential' },
                      { to: '/generator', icon: 'fa-wand-magic-sparkles', label: 'Generate' },
                      { to: '/notes', icon: 'fa-sticky-note', label: 'Notes' },
                      { to: '/security-dashboard', icon: 'fa-shield-halved', label: 'Security' },
                      { to: '/backup', icon: 'fa-cloud-arrow-up', label: 'Backup' },
                      { to: '/folders', icon: 'fa-folder', label: 'Folders' },
                    ].map((a) => (
                      <Link key={a.to} to={a.to} className="dash-quick-action">
                        <i className={`fas ${a.icon}`} />
                        <span>{a.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="dash-panel">
                <div className="dash-panel-header">
                  <h5 className="dash-panel-title"><i className="fas fa-clock-rotate-left text-primary" />Recent Activity</h5>
                  <Link to="/activity" className="btn btn-sm btn-ghost">View All</Link>
                </div>
                <div className="dash-panel-body">
                  {recent.length === 0 ? (
                    <p className="text-muted mb-0 small">No recent activity</p>
                  ) : (
                    <div className="activity-timeline">
                      {recent.slice(0, 6).map((a) => (
                        <div key={a._id} className="activity-item">
                          <div className="activity-dot">
                            <i className={`fas ${activityIcons[a.action] || 'fa-circle'}`} />
                          </div>
                          <div className="activity-content">
                            <div className="d-flex justify-content-between gap-2">
                              <span className="activity-action">{a.action.replace(/_/g, ' ')}</span>
                              <span className="activity-time">{new Date(a.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {recentCreds.length > 0 && (
              <div className="col-12">
                <div className="dash-panel">
                  <div className="dash-panel-header">
                    <h5 className="dash-panel-title"><i className="fas fa-vault text-primary" />Recently Updated</h5>
                    <Link to="/vault" className="btn btn-sm btn-ghost">View Vault</Link>
                  </div>
                  <div className="modern-table-wrap border-0 rounded-0">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr><th>Service</th><th>Username</th><th>Updated</th><th /></tr>
                      </thead>
                      <tbody>
                        {recentCreds.map((c) => (
                          <tr key={c.id}>
                            <td className="fw-semibold">{c.serviceName}</td>
                            <td className="text-muted">{c.username || c.email || '—'}</td>
                            <td className="text-muted small">{new Date(c.updatedAt).toLocaleDateString()}</td>
                            <td className="text-end">
                              <Link to={`/vault/${c.id}`} className="btn btn-sm btn-ghost">View</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
