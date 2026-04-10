/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  bootstrapDemoSession,
  clearStoredSession,
  getStoredSession,
  loginUser,
  registerUser,
  setStoredSession,
} from '../lib/arenaxApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStoredSession());
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      setSession(getStoredSession());
    };

    window.addEventListener('arenax-session-changed', syncSession);
    return () => window.removeEventListener('arenax-session-changed', syncSession);
  }, []);

  const login = useCallback(async (credentials) => {
    setIsAuthLoading(true);
    try {
      const nextSession = await loginUser(credentials);
      setSession(nextSession);
      return nextSession;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (details) => {
    setIsAuthLoading(true);
    try {
      const nextSession = await registerUser(details);
      setSession(nextSession);
      return nextSession;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const continueWithDemo = useCallback(async () => {
    setIsAuthLoading(true);
    try {
      const nextSession = await bootstrapDemoSession();
      setSession(nextSession);
      return nextSession;
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  const updateSession = useCallback((nextSession) => {
    setStoredSession(nextSession);
    setSession(nextSession);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      isAuthenticated: Boolean(session?.token),
      isAuthLoading,
      login,
      register,
      continueWithDemo,
      logout,
      updateSession,
    }),
    [continueWithDemo, isAuthLoading, login, logout, register, session, updateSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
