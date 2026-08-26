import { useCallback, useRef, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

export function useConfirm() {
  const resolveRef = useRef(null);
  const [config, setConfig] = useState(null);

  const confirm = useCallback((options = {}) => new Promise((resolve) => {
    resolveRef.current = resolve;
    setConfig(options);
  }), []);

  const close = useCallback((result) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setConfig(null);
  }, []);

  const ConfirmDialog = (
    <ConfirmModal
      show={!!config}
      title={config?.title || 'Confirm'}
      message={config?.message}
      confirmLabel={config?.confirmLabel || 'Confirm'}
      cancelLabel={config?.cancelLabel || 'Cancel'}
      variant={config?.variant || 'danger'}
      icon={config?.icon}
      onClose={() => close(false)}
      onConfirm={() => close(true)}
    />
  );

  return { confirm, ConfirmDialog };
}
