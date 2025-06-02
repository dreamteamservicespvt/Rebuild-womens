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
            <meta property="og:title" content="REBUILD WOMEN'S - Kakinada's Premier Fitness Studio for Women" />
            <meta property="og:description" content="Join Kakinada's exclusive fitness programs for women. Strength Training (₹1800/₹1500), Weight Loss (₹4000/₹3000), and Zumba (₹2000/₹1500) with flexible morning and evening timings." />
            <meta name="description" content="REBUILD WOMEN'S offers exclusive fitness programs in Kakinada: Strength Training (5:30AM-10:30AM, 4PM-8PM), Weight Loss Program (6AM-10AM, 4PM-8PM), and Zumba (4PM-8PM)." />
            <meta name="keywords" content="women fitness, Kakinada gym, weight loss, fitness for women, rebuild women's" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">`
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
