import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // reachable from other devices on the same Wi-Fi
    proxy: { '/api': 'http://localhost:3000' }, // browser calls /api, Vite forwards to the Express server
  },
})
