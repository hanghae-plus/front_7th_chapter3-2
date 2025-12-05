import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/front_7th_chapter3-2/basic/' : '/',
  build: {
    outDir: 'dist/basic',
    rollupOptions: {
      input: './index.basic.html',
    },
  },
}));
