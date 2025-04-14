// filepath: c:\Users\joaop\Desktop\TSIF - Desafio_BackEnd\FrontEnd\src\lib\axios.ts
import axios from 'axios';

// Substitua '5000' pela porta real onde seu backend está rodando
const API_URL = 'http://localhost:5000'; // Ajuste a URL base conforme necessário

const api = axios.create({
  baseURL: API_URL,
});

// Opcional: Interceptor para adicionar o token JWT automaticamente nas requisições
api.interceptors.request.use(async (config) => {
  // Lógica para pegar o token (do localStorage, context, etc.)
  const token = localStorage.getItem('authToken'); // Exemplo: pegando do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;