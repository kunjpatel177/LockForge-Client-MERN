// Vite only exposes env vars prefixed with VITE_
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
