import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/front_7th_chapter3-2/advanced/' : '/',
  build: {
    outDir: 'dist/advanced',
    rollupOptions: {
      input: './index.advanced.html',
    },
  },
}));
