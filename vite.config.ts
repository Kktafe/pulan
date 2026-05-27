import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({ base: './', plugins: [react(), VitePWA({ registerType: 'autoUpdate', includeAssets: ['favicon.svg'], manifest: { name: 'Pulan Local Agent', short_name: 'Pulan', theme_color: '#e7ff52', background_color: '#050505', display: 'standalone', start_url: './', icons: [] }, workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'], maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 } })], test: { environment: 'jsdom', globals: true, setupFiles: './src/test.setup.ts' }});
