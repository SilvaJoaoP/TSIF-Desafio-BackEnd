import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // Adiciona proxy para API se necessário
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src' // Caminho absoluto simplificado
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Sem necessidade de especificar o caminho do index.html
    // O Vite encontra automaticamente o index.html na raiz do projeto
  }
});