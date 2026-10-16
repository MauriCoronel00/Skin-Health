import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ??
    env.VITE_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    env.SUPABASE_URL ??
    '';
  const supabaseAnonKey =
    process.env.VITE_SUPABASE_ANON_KEY ??
    env.VITE_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    env.SUPABASE_PUBLISHABLE_KEY ??
    '';

  return {
    // Keep Supabase variables available in Vite preview and production bundles,
    // regardless of whether the integration exposes VITE_ or NEXT_PUBLIC_ names.
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'og-image.png'],
        manifest: {
          name: 'Skin Health',
          short_name: 'Skin Health',
          description: 'Catálogo visual de skincare de alta gama con carrito flotante y pedidos directos por WhatsApp en guaraníes.',
          start_url: '/',
          display: 'standalone',
          background_color: '#FAF8F5',
          theme_color: '#102A43',
          orientation: 'portrait-primary',
          scope: '/',
          lang: 'es',
          dir: 'ltr',
          icons: [
            { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png', purpose: 'any maskable' },
            { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png', purpose: 'any maskable' },
            { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png', purpose: 'any maskable' },
            { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png', purpose: 'any maskable' },
            { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png', purpose: 'any maskable' },
            { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
            { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png', purpose: 'any maskable' },
            { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          ],
          shortcuts: [
            { name: 'Mi Pedido', short_name: 'Pedido', description: 'Ver mi carrito y finalizar compra', url: '/?shortcut=cart', icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }] },
            { name: 'Catálogo', short_name: 'Catálogo', description: 'Explorar productos de skincare', url: '/?shortcut=catalog', icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }] },
          ],
          categories: ['shopping', 'health', 'lifestyle'],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
            },
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-api-v2',
                fetchOptions: { cache: 'no-store' },
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 6 },
              },
            },
          ],
        },
        devOptions: { enabled: false },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Aumentamos el limite (con manualChunks los chunks bajan naturalmente)
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor: React + ecosistema
            'vendor-react': ['react', 'react-dom'],
            // Motion (Framer) — libreria pesada de animaciones
            'vendor-motion': ['motion/react'],
            // Supabase — cliente + auth
            'vendor-supabase': ['@supabase/supabase-js'],
            // Lucide icons — tree-shaking parcial, agrupar reduce fragmentacion
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
