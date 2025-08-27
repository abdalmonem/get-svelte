import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [
        svelte({
            compilerOptions: {
                runes: true
            },
            hot: false
        })
    ],
    build: {
        rollupOptions: {
            input: 'index.html'
        }
    },
    test: {
        environment: 'jsdom',
        globals: true,
        deps: {
            inline: [/svelte/]
        },
        include: ['tests/**/*.{test,spec}.{js,ts}'],
        setupFiles: ['./tests/setup.js']
    },
    resolve: process.env.VITEST
        ? {
            conditions: ['browser']
        }
        : undefined
});
