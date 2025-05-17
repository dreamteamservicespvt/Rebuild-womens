import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<head>/,
          `<head>
            <link rel="icon" href="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747486121/dqyuqvt8l6vb0fzqsxbc.jpg" />`
        );
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
