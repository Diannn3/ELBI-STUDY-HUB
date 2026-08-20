import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/**/*', 'icons/*'],
      manifest: {
        name: 'Elbi Study Hub',
        short_name: 'Elbi Study',
        description: 'An unofficial, local-first study companion inspired by Elbi.',
        theme_color: '#7B1113',
        background_color: '#FFF9F1',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,png,svg,woff2,json,mp3,ogg}'],
        runtimeCaching: []
      }
    })
  ],
  server: { port: 5173, strictPort: true }
});
