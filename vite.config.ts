import {resolve} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const buildApp = process.env.BUILD_APP === 'true';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        (!buildApp && dts({tsconfigPath: 'tsconfig.lib.json'})),
    ],
    build: (buildApp ? {
        outDir: 'build',
    } : {
        lib: {
            entry: resolve(__dirname, 'lib/index.tsx'),
            formats: ['es'],
        },
        rolldownOptions: {
            external: [
                'react', 'react-dom', 'react-dom/client', 'react/jsx-runtime',
                '@tanstack/react-query', '@tanstack/react-router'
            ],
            output: {
                entryFileNames: '[name].js',
                assetFileNames: 'assets/[name][extname]',
                minify: {
                    compress: true,
                    mangle: false
                }
            }
        }
    }),
    resolve: {
        tsconfigPaths: true
    }
});
