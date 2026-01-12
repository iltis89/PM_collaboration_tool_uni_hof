import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'node',
        globals: true,
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        exclude: ['node_modules', '.next'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/lib/**', 'src/app/actions/**'],
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    }
})
