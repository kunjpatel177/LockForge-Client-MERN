// Vite only exposes env vars prefixed with VITE_
export const API_BASE_URL = import.meta.env.API_URL || "https://lockforgepwmserver.vercel.app/api/v1";
console.log('API_BASE_URL:', API_BASE_URL);
// export const API_BASE_URL = import.meta.env.API_URL || 'http://localhost:5000/api/v1';
