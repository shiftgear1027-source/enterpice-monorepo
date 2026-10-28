import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Alert, type AlertTone } from './Alert';

interface ToastItem {
  id: number;
  tone: AlertTone;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);
let nextId = 1;

export function ToastProvider({
  children,
  durationMs = 4000,
}: {
  children: ReactNode;
  durationMs?: number;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback(
    (id: number) => setToasts((items) => items.filter((t) => t.id !== id)),
    [],
  );

  const push = useCallback(
    (tone: AlertTone, message: string) => {
      const id = nextId++;
      setToasts((items) => [...items, { id, tone, message }]);
      setTimeout(() => dismiss(id), durationMs);
    },
    [dismiss, durationMs],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push('success', m),
      error: (m) => push('danger', m),
      info: (m) => push('info', m),
      warning: (m) => push('warning', m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-end gap-2 p-4"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full max-w-sm shadow-lg">
            <Alert tone={toast.tone} onClose={() => dismiss(toast.id)}>
              {toast.message}
            </Alert>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}
