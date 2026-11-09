import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  dismissToast: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => dismissToast(id), 3200);
  }, [dismissToast]);

  const value = useMemo(() => ({ toasts, addToast, dismissToast }), [toasts, addToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={`rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : toast.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-slate-200 bg-white/90 text-slate-700'}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
