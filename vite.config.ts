import {resolve} from 'path';
import {defineConfig} from 'vite';
import react, {reactCompilerPreset} from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import {esmExternalRequirePlugin} from 'rolldown/plugins';
import dts from 'vite-plugin-dts';

const buildApp = process.env.BUILD_APP === 'true';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        babel({presets: [reactCompilerPreset()]}),
        ...(!buildApp ? [
            esmExternalRequirePlugin({external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime']}),
            dts({tsconfigPath: 'tsconfig.lib.json'}),
        ] : []),
    ],
    build: (buildApp ? {
        outDir: 'build',
    } : {
        lib: {
            entry: resolve(__dirname, 'lib/datasets.tsx'),
            formats: ['es'],
        },
        rolldownOptions: {
            external: ['@tanstack/react-query', '@tanstack/react-router'],
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
