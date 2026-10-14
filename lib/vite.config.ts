import {defineConfig, esmExternalRequirePlugin} from 'vite';
import react, {reactCompilerPreset} from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import dts from 'unplugin-dts/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        babel({presets: [reactCompilerPreset({target: '19'})]}),
        esmExternalRequirePlugin({external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime']}),
        dts({tsconfigPath: 'tsconfig.lib.json'}),
    ],
    build: {
        lib: {
            entry: 'src/index.tsx',
            formats: ['es'],
        },
        rolldownOptions: {
            external: ['@knaw-huc/faceted-search-react', '@tanstack/react-query', '@tanstack/react-router'],
            output: {
                entryFileNames: '[name].js',
                assetFileNames: 'assets/[name][extname]',
                minify: {
                    compress: true,
                    mangle: false
                }
            }
        }
    },
    resolve: {
        tsconfigPaths: true
    }
});
