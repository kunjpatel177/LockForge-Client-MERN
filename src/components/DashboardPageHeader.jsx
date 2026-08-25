const DashboardPageHeader = ({ icon, title, subtitle, actions, breadcrumb }) => (
  <div className="dash-page-header mb-4">
    {breadcrumb && <div className="dash-breadcrumb mb-2">{breadcrumb}</div>}
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
      <div className="d-flex align-items-start gap-3">
        {icon && (
          <div className="dash-page-icon">
            <i className={`fas ${icon}`} />
          </div>
        )}
        <div>
          <h1 className="dash-page-title">{title}</h1>
          {subtitle && <p className="dash-page-subtitle mb-0">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="dash-page-actions d-flex flex-wrap gap-2">{actions}</div>}
    </div>
  </div>
);

export default DashboardPageHeader;
