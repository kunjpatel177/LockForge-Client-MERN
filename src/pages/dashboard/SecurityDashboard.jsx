import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { securityAPI } from '../../api';
import { showApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';

const SecurityDashboard = () => {
  const { vaultUnlocked } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vaultUnlocked) { setLoading(false); return; }
    securityAPI.getDashboard()
      .then((r) => setData(r.data.data))
      .catch((err) => showApiError(err))
      .finally(() => setLoading(false));
  }, [vaultUnlocked]);

  if (!vaultUnlocked) return <VaultLockedState />;
  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  const scoreClass = data.securityScore >= 70 ? 'good' : data.securityScore >= 40 ? 'mid' : 'bad';
  const hasIssues = data.weakPasswords.length > 0 || data.reusedPasswords.length > 0 || data.oldPasswords.length > 0;

  return (
    <div>
      <DashboardPageHeader
        icon="fa-shield-halved"
        title="Security Dashboard"
        subtitle="Monitor password health across your vault"
      />

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="security-score-card">
            <div className={`security-score-ring ${scoreClass}`}>{data.securityScore}%</div>
            <h5 className="fw-bold mb-1">Security Score</h5>
            <p className="text-muted small mb-0">Based on strength, reuse, and age</p>
          </div>
        </div>
        <div className="col-md-8">
          <div className="row g-3 h-100">
            {[
              { label: 'Total Credentials', value: data.totalCredentials, icon: 'fa-key', color: 'indigo' },
              { label: 'Weak', value: data.weakCount, icon: 'fa-triangle-exclamation', color: 'warning' },
              { label: 'Reused', value: data.reusedCount, icon: 'fa-clone', color: 'red' },
              { label: 'Old (6+ mo)', value: data.oldCount, icon: 'fa-clock', color: 'violet' },
            ].map((s) => (
              <div key={s.label} className="col-6">
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
        </div>
      </div>

      {!hasIssues ? (
        <EmptyState
          icon="fa-shield-halved"
          title="Your vault looks great!"
          description="No weak, reused, or outdated passwords detected."
        />
      ) : (
        <>
          {data.weakPasswords.length > 0 && (
            <div className="security-issue-panel">
              <div className="security-issue-header warning">
                <i className="fas fa-triangle-exclamation" />Weak Passwords ({data.weakCount})
              </div>
              <ul className="security-issue-list">
                {data.weakPasswords.map((w) => (
                  <li key={w.id}>
                    <Link to={`/vault/${w.id}`} className="text-decoration-none fw-semibold">{w.serviceName}</Link>
                    <Link to={`/vault/${w.id}/edit`} className="btn btn-sm btn-ghost">Update</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.reusedPasswords.length > 0 && (
            <div className="security-issue-panel">
              <div className="security-issue-header danger">
                <i className="fas fa-clone" />Reused Passwords ({data.reusedCount})
              </div>
              <ul className="security-issue-list">
                {data.reusedPasswords.map((group, i) => (
                  <li key={i}>
                    <div className="d-flex flex-wrap gap-2">
                      {group.credentials.map((c) => (
                        <Link key={c.id} to={`/vault/${c.id}`} className="dash-badge danger text-decoration-none">{c.serviceName}</Link>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.oldPasswords.length > 0 && (
            <div className="security-issue-panel">
              <div className="security-issue-header info">
                <i className="fas fa-clock" />Old Passwords ({data.oldCount})
              </div>
              <ul className="security-issue-list">
                {data.oldPasswords.map((o) => (
                  <li key={o.id}>
                    <Link to={`/vault/${o.id}`} className="text-decoration-none fw-semibold">{o.serviceName}</Link>
                    <small className="text-muted">{new Date(o.updatedAt).toLocaleDateString()}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SecurityDashboard;
