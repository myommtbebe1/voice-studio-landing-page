import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const VOICE_PICS_S3_TARGET = 'https://bn-voice-pics.s3.ap-southeast-1.amazonaws.com'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const voicePicsReferer =
    env.DEV_S3_VOICE_PICS_REFERER || 'https://voice.botnoi.com/'

  return {
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
        '/voice-pics-proxy': {
          target: VOICE_PICS_S3_TARGET,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/voice-pics-proxy/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('referer')
              proxyReq.setHeader('Referer', voicePicsReferer)
            })
          },
        },
      },
    },
  }
})
