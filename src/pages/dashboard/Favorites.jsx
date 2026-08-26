import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { vaultAPI, noteAPI } from '../../api';
import { showApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import VaultLockedState from '../../components/VaultLockedState';
import EmptyState from '../../components/EmptyState';
import NoteViewModal from '../../components/NoteViewModal';

const Favorites = () => {
  const navigate = useNavigate();
  const { vaultUnlocked } = useOutletContext();
  const [credentials, setCredentials] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewNote, setViewNote] = useState(null);

  useEffect(() => {
    if (!vaultUnlocked) { setLoading(false); return; }
    Promise.all([
      vaultAPI.getAll({ favorite: 'true' }),
      noteAPI.getAll({ favorite: 'true' }),
    ])
      .then(([credRes, noteRes]) => {
        setCredentials(credRes.data.data);
        setNotes(noteRes.data.data);
      })
      .catch((err) => showApiError(err))
      .finally(() => setLoading(false));
  }, [vaultUnlocked]);

  if (!vaultUnlocked) return <VaultLockedState />;
  if (loading) return <LoadingSpinner />;

  const hasFavorites = credentials.length > 0 || notes.length > 0;

  return (
    <div>
      <NoteViewModal
        show={!!viewNote}
        note={viewNote}
        onClose={() => setViewNote(null)}
        onEdit={(note) => {
          setViewNote(null);
          navigate(`/notes?edit=${note.id}`);
        }}
      />
      <DashboardPageHeader
        icon="fa-star"
        title="Favorites"
        subtitle="Quick access to your starred credentials and notes"
      />

      {!hasFavorites ? (
        <EmptyState
          icon="fa-star"
          title="No favorites yet"
          description="Star credentials in your vault or notes in Secure Notes to pin them here."
          action={(
            <div className="d-flex gap-2 justify-content-center flex-wrap">
              <Link to="/vault" className="btn btn-primary btn-modern">Go to Vault</Link>
              <Link to="/notes" className="btn btn-ghost btn-modern">Go to Notes</Link>
            </div>
          )}
        />
      ) : (
        <>
          <section className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">
                <i className="fas fa-key me-2 text-primary" />
                Credentials
                <span className="text-muted fw-normal ms-2" style={{ fontSize: '0.9rem' }}>({credentials.length})</span>
              </h5>
            </div>
            {credentials.length === 0 ? (
              <p className="text-muted small mb-0">No favorite credentials yet.</p>
            ) : (
              <div className="row g-3">
                {credentials.map((c) => (
                  <div key={c.id} className="col-md-6 col-lg-4">
                    <Link to={`/vault/${c.id}`} className="favorite-card">
                      <div className="fav-card-creds"><div className="favorite-card-icon"><i className="fas fa-key" /></div>
                        <span className="dash-badge warning"><i className="fas fa-star" />Favorite</span></div>

                      <h5 className="fw-bold mb-1">{c.serviceName}</h5>
                      <p className="text-muted small mb-2">{c.username || c.email || 'No username'}</p>

                    </Link>
                    {/* <Link to={`/vault/${c.id}`} className="favorite-card">
                      <div className="favorite-card-icon"><i className="fas fa-key" /></div>
                      <h5 className="fw-bold mb-1">{c.serviceName}</h5>
                      <p className="text-muted small mb-2">{c.username || c.email || 'No username'}</p>
                      <span className="dash-badge warning"><i className="fas fa-star" />Favorite</span>
                    </Link> */}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0">
                <i className="fas fa-sticky-note me-2 text-primary" />
                Secure Notes
                <span className="text-muted fw-normal ms-2" style={{ fontSize: '0.9rem' }}>({notes.length})</span>
              </h5>
            </div>
            {notes.length === 0 ? (
              <p className="text-muted small mb-0">No favorite notes yet.</p>
            ) : (
              <div className="row g-3">
                {notes.map((n) => (
                  <div key={n.id} className="col-md-6 col-lg-4">
                    <div
                      className="note-card note-card-clickable h-100"
                      onClick={() => setViewNote(n)}
                      onKeyDown={(e) => e.key === 'Enter' && setViewNote(n)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="note-card-header">
                        <h5 className="note-card-title">
                          {n.title}
                          {/* <p>{n.title}</p> */}
                          <i className="fas fa-star text-warning ms-2" style={{ fontSize: '0.85rem' }} />
                        </h5>
                      </div>
                      <p className="text-muted small mb-2 note-card-preview">
                        {n.content || 'Empty note'}
                      </p>
                      <small className="text-muted">{new Date(n.updatedAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Favorites;
