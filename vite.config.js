import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    allowedHosts: [
      'circle-simulations-abilities-small.trycloudflare.com'
    ],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
        ws: true // mengizinkan websocket biar gak tabrakan
      }
    }
  }
})