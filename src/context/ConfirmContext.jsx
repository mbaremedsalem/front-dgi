import { createContext, useCallback, useContext, useRef, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);
  const resolverRef = useRef(null);

  const confirmAction = useCallback((options) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setRequest(options);
    });
  }, []);

  const close = useCallback((result) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setRequest(null);
  }, []);

  return (
    <ConfirmContext.Provider value={confirmAction}>
      {children}
      <ConfirmModal
        open={!!request}
        title={request?.title}
        message={request?.message}
        confirmLabel={request?.confirmLabel}
        cancelLabel={request?.cancelLabel}
        danger={request?.danger}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm doit être utilisé dans un <ConfirmProvider>');
  return ctx;
}
