const variantClass = {
  danger: 'btn-danger',
  warning: 'btn-warning',
  primary: 'btn-primary',
};

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  icon,
  children,
}) => {
  if (!show) return null;

  const btnClass = variantClass[variant] || variantClass.danger;

  const footer = (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </button>
      <button
        type={children ? 'submit' : 'button'}
        className={`btn ${btnClass}`}
        disabled={loading}
        onClick={children ? undefined : onConfirm}
      >
        {loading ? 'Please wait...' : confirmLabel}
      </button>
    </div>
  );

  return (
    <div className="modal show d-block confirm-modal-backdrop" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {icon && <i className={`fas ${icon} me-2`} />}
              {title}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading} aria-label="Close" />
          </div>
          {children ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onConfirm?.(e);
              }}
            >
              <div className="modal-body">
                {message && <p className="text-muted mb-3">{message}</p>}
                {children}
              </div>
              {footer}
            </form>
          ) : (
            <>
              <div className="modal-body">
                {message && <p className="mb-0">{message}</p>}
              </div>
              {footer}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
