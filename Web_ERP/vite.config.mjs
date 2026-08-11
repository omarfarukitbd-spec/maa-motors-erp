import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        VitePWA({
            selfDestroying: true,
            manifest: {
                name: 'Maa Motors ERP',
                short_name: 'Maa ERP',
                description: 'Maa Motors ERP System',
                theme_color: '#0f172a',
                background_color: '#0f172a',
                display: 'standalone',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    build: {
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('firebase')) {
                            return 'vendor-firebase';
                        }
                        if (id.includes('sweetalert2') || id.includes('flatpickr')) {
                            return 'vendor-ui';
                        }
                        if (id.includes('xlsx')) {
                            return 'vendor-excel';
                        }
                        return 'vendor';
                    }
                }
            }
        }
    }
});
