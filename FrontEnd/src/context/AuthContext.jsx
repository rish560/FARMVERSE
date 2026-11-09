import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/authApi';
import { setAuthToken } from '../api/axiosInstance';
import { normalizeRole } from '../config/roleRoutes';

const STORAGE_KEY = 'farmverse-auth';

const fallbackAuthValue = {
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  login: async () => ({ success: false, message: 'Authentication unavailable' }),
  register: async () => ({ success: false, message: 'Authentication unavailable' }),
  updateProfile: () => {},
  logout: () => {},
};

const AuthContext = createContext(fallbackAuthValue);

const getStoredAuth = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

const saveAuth = (payload) => {
  if (typeof window === 'undefined') return;
  if (payload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredAuth()?.user ?? null);
  const [role, setRole] = useState(() => normalizeRole(getStoredAuth()?.role));
  const [token, setToken] = useState(() => getStoredAuth()?.token ?? null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getStoredAuth()?.token));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      setAuthToken(null);
    }
  }, [token]);

  useEffect(() => {
    saveAuth({ user, role, token });
  }, [user, role, token]);

  const login = async (email, password) => {
    setLoading(true);
    const response = await apiLogin({ email, password });

    if (response.success) {
      const session = {
        token: response.token ?? response.user?.token ?? null,
        user: response.user,
        role: normalizeRole(response.user?.role ?? response.role),
      };
      setUser(session.user);
      setRole(session.role);
      setToken(session.token);
      setIsAuthenticated(Boolean(response.success));
    } else {
      setUser(null);
      setRole(null);
      setToken(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
    return response;
  };

  const register = async (payload) => {
    setLoading(true);
    const response = await apiRegister(payload);
    setLoading(false);
    return response;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    setIsAuthenticated(false);
    saveAuth(null);
  };

  const updateProfile = (updates) => {
    setUser((current) => ({ ...current, ...updates }));
  };

  const value = useMemo(
    () => ({ user, role, token, isAuthenticated, loading, login, register, updateProfile, logout }),
    [user, role, token, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

