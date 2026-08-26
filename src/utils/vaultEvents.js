let onVaultLocked = null;
let isNotifying = false;

export const registerVaultLockedHandler = (handler) => {
  onVaultLocked = handler;
};

export const notifyVaultLocked = () => {
  if (isNotifying || !onVaultLocked) return;
  isNotifying = true;
  onVaultLocked();
  window.setTimeout(() => {
    isNotifying = false;
  }, 2000);
};

export const isVaultLockedMessage = (message = '') => (
  typeof message === 'string' && message.includes('Vault is locked')
);
