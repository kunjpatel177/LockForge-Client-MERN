import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config/api.js';
import { notifySessionEnded } from '../utils/sessionEvents.js';
import { isVaultLockedMessage, notifyVaultLocked } from '../utils/vaultEvents.js';

const TOKEN_KEY = 'lockforge_access_token';
const REFRESH_TOKEN_KEY = 'lockforge_refresh_token';

export const getStoredToken = () => sessionStorage.getItem(TOKEN_KEY);
export const getStoredRefreshToken = () => sessionStorage.getItem(REFRESH_TOKEN_KEY);

const hadStoredAuth = () => !!getStoredToken() || !!getStoredRefreshToken();

export const clearStoredTokens = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  delete api.defaults.headers.common.Authorization;
};

export const setStoredToken = (accessToken, refreshToken) => {
  if (!accessToken) {
    clearStoredTokens();
    return;
  }
  sessionStorage.setItem(TOKEN_KEY, accessToken);
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const stored = getStoredToken();
if (stored) {
  api.defaults.headers.common.Authorization = `Bearer ${stored}`;
}

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const AUTH_SKIP_REFRESH = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/users/account',
  '/users/change-password',
  '/users/change-master-password',
  '/auth/unlock-vault',
];

const endStoredSession = () => {
  const hadAuth = hadStoredAuth();
  clearStoredTokens();
  if (hadAuth) notifySessionEnded();
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const shouldSkip = AUTH_SKIP_REFRESH.some((path) => originalRequest.url?.includes(path));

    if (error.response?.status === 401 && !shouldSkip) {
      if (!hadStoredAuth()) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        endStoredSession();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      const storedRefreshToken = getStoredRefreshToken();
      if (!storedRefreshToken) {
        endStoredSession();
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post('/auth/refresh', { refreshToken: storedRefreshToken });
        const newAccess = res.data.data?.accessToken;
        const newRefresh = res.data.data?.refreshToken;
        if (newAccess) setStoredToken(newAccess, newRefresh);
        processQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        endStoredSession();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403 && isVaultLockedMessage(error.response?.data?.message)) {
      notifyVaultLocked();
    }

    return Promise.reject(error);
  }
);

export const handleApiError = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message
    || (error.code === 'ERR_NETWORK' ? 'Network error. Please check your connection and try again.' : null)
    || error.message
    || 'Something went wrong';
  const isVaultLocked = status === 403 && isVaultLockedMessage(message);
  if (isVaultLocked) notifyVaultLocked();
  return { status, message: isVaultLocked ? null : message, isVaultLocked };
};

export const showApiError = (error) => {
  const result = handleApiError(error);
  if (result.message) toast.error(result.message);
  return result;
};

export default api;
