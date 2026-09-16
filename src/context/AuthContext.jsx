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
  const [profileLoading, setProfileLoading] = useState(!!session);

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

  useEffect(() => {
    if (!session?.token) {
      setProfileLoading(false);
      return undefined;
    }

    let cancelled = false;
    api
      .getProfile(session.token)
      .then((profile) => {
        if (cancelled) return;
        setSession((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, profile };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      })
      .catch((err) => {
        if (err.status === 401) {
          localStorage.removeItem(STORAGE_KEY);
          setSession(null);
        }
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.token]);

  const login = useCallback(async (username, password) => {
    const data = await api.sttLogin(username, password);
    const newSession = {
      username: data.profile?.username || username,
      token: data.access_token,
      tokenType: data.token_type || 'Bearer',
      expiresAt: Date.now() + (data.expires_in ? data.expires_in * 1000 : 5 * 60 * 1000),
      profile: data.profile || null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
    return newSession;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const changePassword = useCallback(
    async (oldPassword, newPassword) => {
      const data = await api.changePassword(session?.token, oldPassword, newPassword);
      if (data?.token) {
        setSession((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, token: data.token };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
      return data;
    },
    [session?.token]
  );

  const value = {
    isAuthenticated: !!session,
    username: session?.username || null,
    token: session?.token || null,
    expiresAt: session?.expiresAt || null,
    profile: session?.profile || null,
    role: session?.profile?.role || null,
    roleDisplay: session?.profile?.roleDisplay || null,
    firstName: session?.profile?.firstName || null,
    lastName: session?.profile?.lastName || null,
    email: session?.profile?.email || null,
    profileLoading,
    login,
    logout,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un <AuthProvider>');
  return ctx;
}
