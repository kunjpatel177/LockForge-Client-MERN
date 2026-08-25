const PageHero = ({ badge, title, highlight, subtitle, children }) => (
  <section className="page-hero">
    <div className="page-hero-bg" />
    <div className="container position-relative">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          {badge && <span className="section-badge mb-3">{badge}</span>}
          <h1 className="page-hero-title">
            {title}
            {highlight && <span className="gradient-text"> {highlight}</span>}
          </h1>
          {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  </section>
);

export default PageHero;
