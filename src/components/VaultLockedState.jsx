const VaultLockedState = ({ title = 'Vault Locked', message = 'Unlock your vault to access this content.' }) => (
  <div className="vault-locked-state">
    <div className="vault-locked-icon">
      <i className="fas fa-lock" />
    </div>
    <h4 className="fw-bold mb-2">{title}</h4>
    <p className="text-muted mb-0">{message}</p>
  </div>
);

export default VaultLockedState;
