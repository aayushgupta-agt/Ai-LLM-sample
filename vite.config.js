<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
     host: true,
      port: 5173,
=======
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
>>>>>>> 019f623f733322a5a76badff3c5f9288c0cfae19
    allowedHosts: [
      "gap-senator-ultra.ngrok-free.dev",
      "localhost",
      "http://192.168.20.76:5173/",
    ],
  },
});
