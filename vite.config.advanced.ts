import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default mergeConfig(
  defineConfig({
    plugins: [react(), tsconfigPaths()],
    base: '/front_7th_chapter3-2/advanced/',
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.advanced.html'),
        },
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  })
);
