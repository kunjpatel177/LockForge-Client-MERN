import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { vaultAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';

const Favorites = () => {
  const { vaultUnlocked } = useOutletContext();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vaultUnlocked) { setLoading(false); return; }
    vaultAPI.getAll({ favorite: 'true' })
      .then((r) => setCredentials(r.data.data))
      .catch((err) => toast.error(handleApiError(err).message))
      .finally(() => setLoading(false));
  }, [vaultUnlocked]);

  if (!vaultUnlocked) return <VaultLockedState />;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <DashboardPageHeader
        icon="fa-star"
        title="Favorites"
        subtitle="Quick access to your most-used credentials"
      />

      {credentials.length === 0 ? (
        <EmptyState
          icon="fa-star"
          title="No favorites yet"
          description="Star credentials in your vault to pin them here for quick access."
          action={<Link to="/vault" className="btn btn-primary btn-modern">Go to Vault</Link>}
        />
      ) : (
        <div className="row g-3">
          {credentials.map((c) => (
            <div key={c.id} className="col-md-6 col-lg-4">
              <Link to={`/vault/${c.id}`} className="favorite-card">
                <div className="favorite-card-icon"><i className="fas fa-key" /></div>
                <h5 className="fw-bold mb-1">{c.serviceName}</h5>
                <p className="text-muted small mb-2">{c.username || c.email || 'No username'}</p>
                <span className="dash-badge warning"><i className="fas fa-star" />Favorite</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
