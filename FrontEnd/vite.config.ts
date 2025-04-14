// filepath: c:\Users\joaop\Desktop\TSIF - Desafio_BackEnd\FrontEnd\vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Opcional: Define a porta do servidor de desenvolvimento
    port: 3000,
    // Opcional: Abre o navegador automaticamente
    open: true
  }
})