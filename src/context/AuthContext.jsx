import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, userAPI } from '../api';
import {
  clearStoredTokens,
  getStoredToken,
  handleApiError,
  setStoredToken,
} from '../api/axios';
import { notifySessionEnded, registerSessionEndedHandler } from '../utils/sessionEvents';
import { registerVaultLockedHandler } from '../utils/vaultEvents';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const authCheckRef = useRef(0);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  const endSession = useCallback((message) => {
    navigate('/', { replace: true });
    clearStoredTokens();
    setUser(null);
    setStats(null);
    setVaultUnlocked(false);
    if (message) toast.info(message);
  }, [navigate]);

  useEffect(() => {
    registerSessionEndedHandler(endSession);
    return () => registerSessionEndedHandler(null);
  }, [endSession]);

  const handleVaultLocked = useCallback(() => {
    setVaultUnlocked(false);
  }, []);

  useEffect(() => {
    registerVaultLockedHandler(handleVaultLocked);
    return () => registerVaultLockedHandler(null);
  }, [handleVaultLocked]);

  const loadSessionData = useCallback(async (checkId) => {
    const [profileRes, vaultRes] = await Promise.all([
      userAPI.getProfile(),
      authAPI.vaultStatus(),
    ]);
    if (checkId !== authCheckRef.current) return false;

    setUser(profileRes.data.data.user);
    setStats(profileRes.data.data.stats);
    setVaultUnlocked(vaultRes.data.data.unlocked);
    return true;
  }, []);

  const checkAuth = useCallback(async () => {
    const checkId = ++authCheckRef.current;

    if (!getStoredToken()) {
      setUser(null);
      setStats(null);
      setVaultUnlocked(false);
      setLoading(false);
      return;
    }

    try {
      await loadSessionData(checkId);
    } catch {
      if (checkId !== authCheckRef.current) return;

      clearStoredTokens();
      setUser(null);
      setStats(null);
      setVaultUnlocked(false);
      notifySessionEnded();
    } finally {
      if (checkId === authCheckRef.current) {
        setLoading(false);
      }
    }
  }, [loadSessionData]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email, password) => {
    authCheckRef.current += 1;
    const res = await authAPI.login({ email, password });
    const data = res.data.data;

    if (data.requiresTwoFactor) {
      return {
        requiresTwoFactor: true,
        twoFactorToken: data.twoFactorToken,
        twoFactorMethods: data.twoFactorMethods || [],
        maskedEmail: data.maskedEmail,
      };
    }

    setStoredToken(data.accessToken, data.refreshToken);
    setUser(data.user);

    try {
      await loadSessionData(authCheckRef.current);
    } catch {
      setVaultUnlocked(false);
    }

    setLoading(false);
    return res.data;
  };

  const resendTwoFactor = async (twoFactorToken) => {
    const res = await authAPI.resendTwoFactor({ twoFactorToken });
    return res.data.data;
  };

  const verifyTwoFactor = async (twoFactorToken, token) => {
    authCheckRef.current += 1;
    const res = await authAPI.verifyTwoFactor({ twoFactorToken, token });
    const data = res.data.data;
    setStoredToken(data.accessToken, data.refreshToken);
    setUser(data.user);

    try {
      await loadSessionData(authCheckRef.current);
    } catch {
      setVaultUnlocked(false);
    }

    setLoading(false);
    return res.data;
  };

  const register = async (data) => {
    authCheckRef.current += 1;
    const res = await authAPI.register(data);
    const payload = res.data?.data;

    if (!payload?.accessToken || !payload?.user) {
      const err = new Error('Invalid registration response');
      err.response = { data: { message: res.data?.message || 'Registration failed' } };
      throw err;
    }

    setStoredToken(payload.accessToken, payload.refreshToken);
    setUser(payload.user);

    try {
      await loadSessionData(authCheckRef.current);
    } catch {
      setVaultUnlocked(false);
    }

    setLoading(false);
    return res.data;
  };

  const logout = async () => {
    authCheckRef.current += 1;
    try { await authAPI.logout(); } catch { /* ignore */ }
    clearStoredTokens();
    setUser(null);
    setStats(null);
    setVaultUnlocked(false);
  };

  const destroyAuth = useCallback(() => {
    authCheckRef.current += 1;
    navigate('/', { replace: true });
    clearStoredTokens();
    setUser(null);
    setStats(null);
    setVaultUnlocked(false);
  }, [navigate]);

  const unlockVault = async (masterPassword) => {
    await authAPI.unlockVault(masterPassword);
    setVaultUnlocked(true);
  };

  const lockVault = async () => {
    await authAPI.lockVault();
    setVaultUnlocked(false);
  };

  const syncVaultStatus = useCallback(async () => {
    try {
      const vaultRes = await authAPI.vaultStatus();
      setVaultUnlocked(!!vaultRes.data.data.unlocked);
    } catch {
      setVaultUnlocked(false);
    }
  }, []);

  const refreshProfile = async () => {
    const res = await userAPI.getProfile();
    setUser(res.data.data.user);
    setStats(res.data.data.stats);
  };

  return (
    <AuthContext.Provider value={{
      user, stats, loading, vaultUnlocked, login, verifyTwoFactor, resendTwoFactor, register, logout, endSession, destroyAuth,
      unlockVault, lockVault, syncVaultStatus, refreshProfile, checkAuth, isAuthenticated: !!user,
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
