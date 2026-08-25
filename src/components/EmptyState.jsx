const EmptyState = ({ icon = 'fa-inbox', title, description, action }) => (
  <div className="empty-state">
    <div className="empty-state-icon"><i className={`fas ${icon}`} /></div>
    {title && <h5 className="fw-bold mb-2">{title}</h5>}
    {description && <p>{description}</p>}
    {action}
  </div>
);

export default EmptyState;
