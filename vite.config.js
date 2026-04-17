import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4200,
    strictPort: true,
    proxy: {
      '/api-voice-proxy': {
        target: 'https://api-voice.botnoi.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-voice-proxy/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    css: true,
  },
})