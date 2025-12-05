import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    base: '/front_7th_chapter3-2/',
    build: {
      rollupOptions: {
        input: {
          // 각 HTML 파일의 진입점을 정의합니다.
          basic: resolve(__dirname, 'index.basic.html'),
          advanced: resolve(__dirname, 'index.advanced.html'),
          origin: resolve(__dirname, 'index.origin.html'), // 필요하면 포함
        },
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    },
  })
)
