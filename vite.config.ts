import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default mergeConfig(
  defineConfig({
    base: '/front_7th_chapter3-2/',
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          advanced: path.resolve(rootDir, 'index.advanced.html'),
          basic: path.resolve(rootDir, 'index.basic.html')
        }
      }
    }
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    },
  })
)
