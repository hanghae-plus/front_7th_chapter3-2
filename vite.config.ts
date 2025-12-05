import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    base: process.env.VITE_BASE_PATH || '/',
    build: {
      rollupOptions: {
        input: ['./index.advanced.html', './index.basic.html']
      },
      outDir: 'dist'
    }
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    }
  })
);
