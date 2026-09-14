import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const STORAGE_KEY = 'dgi_auth_session';
const AuthContext = createContext(null);

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session.expiresAt || Date.now() >= session.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  useEffect(() => {
    if (!session) return undefined;
    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) {
      setSession(null);
      return undefined;
    }
    const timer = setTimeout(() => setSession(null), remaining);
    return () => clearTimeout(timer);
  }, [session]);

  const login = useCallback(async (username, password) => {
    const data = await api.sttLogin(username, password);
    const newSession = {
      username,
      token: data.access_token,
      tokenType: data.token_type || 'Bearer',
      expiresAt: Date.now() + (data.expires_in ? data.expires_in * 1000 : 5 * 60 * 1000),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
    return newSession;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const value = {
    isAuthenticated: !!session,
    username: session?.username || null,
    token: session?.token || null,
    expiresAt: session?.expiresAt || null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un <AuthProvider>');
  return ctx;
}
