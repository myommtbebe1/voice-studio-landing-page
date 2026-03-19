import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],

  server: {
    port: 4200,
    strictPort: true,
    proxy: {
      // Avoid CORS in dev: browser calls same-origin, Vite forwards to staging API
      '/api-voice-proxy': {
        target: 'https://api-voice.ibotnoi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-voice-proxy/, ''),
      },
    },
  },

})
