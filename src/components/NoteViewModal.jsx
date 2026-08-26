const NoteViewModal = ({
  show,
  note,
  folderName,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!show || !note) return null;

  return (
    <div className="modal show d-block confirm-modal-backdrop">
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" >
        <div className="modal-content" style={{maxHeight: '80%'}}>
          <div className="modal-header">
            <div>
              <h5 className="modal-title mb-1">
                {note.isFavorite && <i className="fas fa-star text-warning me-2" />}
                {note.title}
              </h5>
              <div className="d-flex flex-wrap gap-2 align-items-center text-muted small">
                <span><i className="fas fa-clock me-1" />{new Date(note.updatedAt).toLocaleString()}</span>
                {folderName ? (
                  <span className="dash-badge primary">{folderName}</span>
                ) : (
                  <span>Unassigned</span>
                )}
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <div className="modal-body">
            <div className="note-view-content">
              {note.content || '(Empty note)'}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            {onEdit && (
              <button type="button" className="btn btn-primary" onClick={() => { onEdit(note); onClose?.(); }}>
                <i className="fas fa-pen me-1" />Edit
              </button>
            )}
            {onDelete && (
              <button type="button" className="btn btn-outline-danger" onClick={() => { onDelete(note.id); onClose?.(); }}>
                <i className="fas fa-trash me-1" />Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteViewModal;
