import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  // Base URL - voor GitHub Pages moet dit de repo naam zijn
  base: '/purrse/',

  // Plugins
  plugins: [
    basicSsl(), // HTTPS voor camera toegang op iOS
  ],

  // Build configuratie
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },

  // Development server
  server: {
    port: 5173,
    host: true, // Toegankelijk vanaf andere devices (iPhone testen)
    https: true, // Activeer HTTPS
  },

  // Preview server (voor productie build testen)
  preview: {
    port: 4173,
  },
});
