import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
     host: true,
      port: 5173,
    allowedHosts: [
      "gap-senator-ultra.ngrok-free.dev",
      "localhost",
      "http://192.168.20.76:5173/",
    ]
  }
})
