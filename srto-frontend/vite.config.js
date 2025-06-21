import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
            '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
            '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
            '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
            '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
            '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
            '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
            '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        }
    },
    optimizeDeps: {
        include: ['@googlemaps/js-api-loader', 'antd']
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'google-maps': ['@googlemaps/js-api-loader', '@react-google-maps/api'],
                    'vendor-ui': ['antd', '@ant-design/icons'],
                    'vendor-state': ['@reduxjs/toolkit', 'react-redux'],
                    'vendor-charts': ['recharts']
                }
            }
        }
    }
});
