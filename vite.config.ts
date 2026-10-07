import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // "/" locally; CI sets BASE_PATH for a GitHub Pages project site
  // (e.g. "/altsik.github.io/").
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
