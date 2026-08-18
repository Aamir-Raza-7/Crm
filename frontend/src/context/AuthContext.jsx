import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

const TOKEN_KEY = 'crm_token';
const USER_KEY = 'crm_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // loading while hydrating from localStorage

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        // Verify token is still valid with the server
        verifyToken(storedToken);
      } catch {
        clearAuth();
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (tkn) => {
    try {
      const res = await authAPI.me();
      if (res.data?.success) {
        setUser(res.data.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.data.user));
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthState = useCallback((newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authAPI.login(credentials);
    const { token: newToken, user: newUser } = res.data.data;
    setAuthState(newToken, newUser);
    return res.data;
  }, [setAuthState]);

  const register = useCallback(async (formData) => {
    const res = await authAPI.register(formData);
    const { token: newToken, user: newUser } = res.data.data;
    setAuthState(newToken, newUser);
    return res.data;
  }, [setAuthState]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Even if the API call fails, clear local auth state
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
