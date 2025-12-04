import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// GitHub Pages 배포를 위한 base 경로 설정
// 환경 변수로 base path를 설정할 수 있음 (기본값: '/')
const base = process.env.VITE_BASE_PATH || '/';

// 빌드 타입: 'basic' | 'advanced'
const buildType = process.env.BUILD_TYPE;
// 출력 디렉토리 (환경 변수로 설정 가능, 기본값: 'dist')
const outDir = process.env.VITE_OUT_DIR || 'dist';

// 공통 빌드 설정
const commonBuildConfig = {
  assetsDir: 'assets',
  sourcemap: false,
  minify: 'esbuild' as const,
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
      },
    },
  },
};

// Basic 빌드 설정
const basicConfig = defineConfig({
  plugins: [react()],
  base,
  build: {
    ...commonBuildConfig,
    outDir,
    rollupOptions: {
      ...commonBuildConfig.rollupOptions,
      input: './index.basic.html',
    },
  },
});

// Advanced 빌드 설정
const advancedConfig = defineConfig({
  plugins: [react()],
  base,
  build: {
    ...commonBuildConfig,
    outDir,
    rollupOptions: {
      ...commonBuildConfig.rollupOptions,
      input: './index.advanced.html',
    },
  },
});

// 기본 설정 (테스트용)
const defaultConfig = defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    ...commonBuildConfig,
  },
});

// 빌드 타입에 따라 다른 설정 반환
const getBuildConfig = () => {
  if (buildType === 'basic') {
    return basicConfig;
  }
  if (buildType === 'advanced') {
    return advancedConfig;
  }
  // 기본값: 테스트 설정 사용
  return defaultConfig;
};

export default mergeConfig(
  getBuildConfig(),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    },
  })
)
