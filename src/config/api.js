// Vite only exposes env vars prefixed with VITE_
// Production (Vercel client): use /api/v1 — client/vercel.json proxies to the API server
// Production (direct API): use https://your-api-server.vercel.app/api/v1
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
