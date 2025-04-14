import axios from 'axios';

// Add type declaration for Vite's import.meta
declare global {
  interface ImportMeta {
    env: Record<string, any>;
  }
}

// Usar a variável de ambiente para a URL da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Configurar interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;