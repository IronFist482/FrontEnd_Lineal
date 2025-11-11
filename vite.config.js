import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: true, // 
    allowedHosts: [
      'mia-tips-intention-differential.trycloudflare.com',
      'comic-south-intention-chronicles.trycloudflare.com'
    ]
  }
})
2