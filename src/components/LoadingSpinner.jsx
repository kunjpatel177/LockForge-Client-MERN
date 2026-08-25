const LoadingSpinner = ({ fullPage = false, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  const spinner = (
    <div className={`spinner-border text-primary ${sizeClass}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
  if (fullPage) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        {spinner}
      </div>
    );
  }
  return <div className="text-center py-4">{spinner}</div>;
};

export default LoadingSpinner;
