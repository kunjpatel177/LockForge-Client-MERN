import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '../api';
import { handleApiError, setStoredToken } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const [profileRes, vaultRes] = await Promise.all([
        userAPI.getProfile(),
        authAPI.vaultStatus(),
      ]);
      setUser(profileRes.data.data.user);
      setStats(profileRes.data.data.stats);
      setVaultUnlocked(vaultRes.data.data.unlocked);
    } catch {
      setStoredToken(null);
      setUser(null);
      setStats(null);
      setVaultUnlocked(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    setStoredToken(res.data.data.accessToken);
    setUser(res.data.data.user);
    await checkAuth();
    return res.data;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    setStoredToken(res.data.data.accessToken);
    setUser(res.data.data.user);
    await checkAuth();
    return res.data;
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    setStoredToken(null);
    setUser(null);
    setStats(null);
    setVaultUnlocked(false);
  };

  const unlockVault = async (masterPassword) => {
    await authAPI.unlockVault(masterPassword);
    setVaultUnlocked(true);
  };

  const lockVault = async () => {
    await authAPI.lockVault();
    setVaultUnlocked(false);
  };

  const refreshProfile = async () => {
    const res = await userAPI.getProfile();
    setUser(res.data.data.user);
    setStats(res.data.data.stats);
  };

  return (
    <AuthContext.Provider value={{
      user, stats, loading, vaultUnlocked, login, register, logout,
      unlockVault, lockVault, refreshProfile, checkAuth, isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const useApiError = () => handleApiError;
