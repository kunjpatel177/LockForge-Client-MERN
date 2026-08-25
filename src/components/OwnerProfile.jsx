import { useState } from 'react';
import { ownerInfo } from '../config/owner';

const OwnerProfile = () => {
  const [photoError, setPhotoError] = useState(false);
  const showPhoto = ownerInfo.photo && !photoError;

  const initials = ownerInfo.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  const detailFields = [
    // { key: 'role', icon: 'fa-briefcase', label: 'Role' },
    { key: 'email', icon: 'fa-envelope', label: 'Email', href: ownerInfo.email ? `mailto:${ownerInfo.email}` : null },
    // { key: 'location', icon: 'fa-location-dot', label: 'Location' },
    // { key: 'website', icon: 'fa-globe', label: 'Website', href: ownerInfo.website || null },
    // { key: 'linkedin', icon: 'fa-linkedin-in', label: 'LinkedIn', href: ownerInfo.linkedin || null },
    // { key: 'github', icon: 'fa-github', label: 'GitHub', href: ownerInfo.github || null },
  ];

  return (
    <section className="section-modern section-alt py-5">
      <div className="container">
        <div className="text-center mb-5">
          <span className="section-badge">Founder</span>
          <h2 className="section-title mt-3">Meet the owner</h2>
          <p className="section-subtitle mx-auto">
            LockForge is built and maintained with a focus on real-world security and usability.
          </p>
        </div>

        <div className="owner-profile-card">
          <div className="row g-4 align-items-center">
            <div className="col-md-4 col-lg-3 text-center">
              <div className="owner-photo-wrap">
                {showPhoto ? (
                  <img
                    src={ownerInfo.photo}
                    alt={ownerInfo.name}
                    className="owner-photo"
                    onError={() => setPhotoError(true)}
                  />
                ) : (
                  <div className="owner-photo-placeholder">
                    <span>{initials}</span>
                    {!ownerInfo.photo && (
                      <small className="owner-photo-hint">Add photo in client/public/</small>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-8 col-lg-9">
              <h3 className="owner-name">{ownerInfo.name || 'Your Name'}</h3>
              {ownerInfo.tagline ? (
                <p className="owner-tagline">{ownerInfo.tagline}</p>
              ) : (
                <p className="owner-tagline owner-placeholder-text">Add a short tagline in src/config/owner.js</p>
              )}

              {ownerInfo.bio ? (
                <p className="owner-bio">{ownerInfo.bio}</p>
              ) : (
                <p className="owner-bio owner-placeholder-text">
                  Add your bio in <code>src/config/owner.js</code> — share your story, vision for LockForge, or background.
                </p>
              )}

              <div className="owner-details-grid">
                {detailFields.map((field) => {
                  const value = ownerInfo[field.key];
                  return (
                    <div key={field.key} className="owner-detail-item">
                      <div className="owner-detail-icon"><i className={`fas ${field.icon}`} /></div>
                      <div>
                        <div className="owner-detail-label">{field.label}</div>
                        {value ? (
                          field.href ? (
                            <a href={field.href} target="_blank" rel="noreferrer" className="owner-detail-value">
                              {value}
                            </a>
                          ) : (
                            <div className="owner-detail-value">{value}</div>
                          )
                        ) : (
                          <div className="owner-detail-value owner-placeholder-text">—</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnerProfile;
