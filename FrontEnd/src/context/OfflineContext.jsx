import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const OfflineContext = createContext({
  isOffline: false,
  pendingSync: false,
  saveSnapshot: () => {},
  loadSnapshot: () => {},
});

export const OfflineProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.navigator.onLine;
  });
  const [pendingSync, setPendingSync] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStatus = () => {
      const offline = !window.navigator.onLine;
      setIsOffline(offline);
      if (!offline) {
        setPendingSync(false);
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  const saveSnapshot = (key, value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
    setPendingSync(true);
  };

  const loadSnapshot = (key, fallback) => {
    if (typeof window === 'undefined') return fallback;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const value = useMemo(() => ({ isOffline, pendingSync, saveSnapshot, loadSnapshot }), [isOffline, pendingSync]);

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
};

export const useOffline = () => useContext(OfflineContext);
