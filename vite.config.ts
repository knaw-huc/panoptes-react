import {resolve} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

const buildApp = process.env.BUILD_APP === 'true';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths(),
        react(),
        (!buildApp && dts({
            rollupTypes: true,
            tsconfigPath: 'tsconfig.lib.json',
        })),
    ],
    build: (buildApp ? {
        outDir: 'dist',
    } : {
        lib: {
            entry: resolve(__dirname, 'lib/index'),
            formats: ['es'],
        },
        rollupOptions: {
            external: ['react', 'react/jsx-runtime'],
            output: {
                entryFileNames: '[name].js',
                assetFileNames: 'assets/[name][extname]',
            }
        }
    })
});
