import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// GitHub Pages base path 설정
// 사용자 페이지: '/' (grappe96.github.io)
// 프로젝트 페이지: '/repository-name/' (grappe96.github.io/repository-name)
const getBasePath = (): string => {
  // @ts-ignore - process.env는 Node.js 환경에서 사용 가능
  const repo = process.env.GITHUB_REPOSITORY || '';
  if (repo) {
    const repoName = repo.split('/')[1];
    // 사용자 페이지인지 확인 (repository 이름이 username.github.io인 경우)
    if (repoName === 'grappe96.github.io' || !repoName) {
      return '/';
    }
    return `/${repoName}/`;
  }
  return '/';
};

export default mergeConfig(
  defineConfig({
    base: getBasePath(),
    plugins: [react()],
    build: {
      rollupOptions: {
        input: './index.basic.html',
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
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
