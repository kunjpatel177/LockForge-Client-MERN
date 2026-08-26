import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: () => api.post('/auth/resend-verification'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  unlockVault: (masterPassword) => api.post('/auth/unlock-vault', { masterPassword }),
  lockVault: () => api.post('/auth/lock-vault'),
  vaultStatus: () => api.get('/auth/vault-status'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  changeMasterPassword: (data) => api.put('/users/change-master-password', data),
  deleteAccount: (password) => api.delete('/users/account', { data: { password } }),
};

export const vaultAPI = {
  getAll: (params) => api.get('/vault', { params }),
  getTrash: () => api.get('/vault/trash'),
  getOne: (id) => api.get(`/vault/${id}`),
  create: (data) => api.post('/vault', data),
  update: (id, data) => api.put(`/vault/${id}`, data),
  moveToFolder: (id, folderId) => api.patch(`/vault/${id}/folder`, { folderId }),
  delete: (id) => api.delete(`/vault/${id}`),
  restore: (id) => api.post(`/vault/${id}/restore`),
  permanentDelete: (id) => api.delete(`/vault/${id}/permanent`),
  emptyTrash: () => api.delete('/vault/trash/empty'),
  toggleFavorite: (id) => api.patch(`/vault/${id}/favorite`),
};

export const folderAPI = {
  getAll: () => api.get('/folders'),
  getOne: (id) => api.get(`/folders/${id}`),
  create: (name) => api.post('/folders', { name }),
  update: (id, name) => api.put(`/folders/${id}`, { name }),
  assignItems: (id, data) => api.post(`/folders/${id}/assign`, data),
  delete: (id) => api.delete(`/folders/${id}`),
};

export const noteAPI = {
  getAll: (params) => api.get('/notes', { params }),
  getOne: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  moveToFolder: (id, folderId) => api.patch(`/notes/${id}/folder`, { folderId }),
  delete: (id) => api.delete(`/notes/${id}`),
};

export const sessionAPI = {
  getAll: () => api.get('/sessions'),
  revoke: (id) => api.delete(`/sessions/${id}`),
  revokeAll: () => api.delete('/sessions'),
};

export const activityAPI = {
  getAll: (params) => api.get('/activity', { params }),
  getRecent: () => api.get('/activity/recent'),
};

export const securityAPI = {
  getDashboard: () => api.get('/security/dashboard'),
  checkStrength: (password) => api.post('/public/check-strength', { password }),
  generatePassword: (options) => api.post('/public/generate-password', options),
};

export const backupAPI = {
  exportBackup: (masterPassword) => api.post('/backup/export', { masterPassword }),
  importBackup: (data) => api.post('/backup/import', data),
  exportPDF: (masterPassword) => api.post('/backup/export-pdf', { masterPassword }, { responseType: 'blob' }),
};
