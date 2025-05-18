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
            <link rel="icon" href="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747488784/ukxacg9kkjcewvwgml2u.png" />
            <meta property="og:image" content="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747488784/ukxacg9kkjcewvwgml2u.png" />
            <meta name="twitter:image" content="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747488784/ukxacg9kkjcewvwgml2u.png" />
            <meta property="og:title" content="Rebuild Fitness - Kakinada's Exclusive Weight Loss Program for Women" />
            <meta property="og:description" content="Rebuild Your Body. Redefine Your Confidence. Kakinada's premier fitness center designed exclusively for women." />
            <meta name="description" content="Rebuild Fitness offers exclusive weight loss programs for women in Kakinada. Transform your body and boost your confidence with our specialized sessions." />
            <meta name="keywords" content="women fitness, Kakinada gym, weight loss, fitness for women, rebuild fitness" />`
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
