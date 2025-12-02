import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 동적 경로 해석을 위한 커스텀 플러그인
function dynamicAliasPlugin(): Plugin {
  return {
    name: 'dynamic-alias',
    enforce: 'pre',
    resolveId(source, importer) {
      // @/로 시작하는 import만 처리
      if (!source.startsWith('@/') || !importer) {
        return null;
      }

      // importer의 위치에서 basic, advanced, origin 중 어디인지 판단
      const importerPath = importer.replace(/\\/g, '/');
      let baseFolder = 'basic'; // 기본값

      if (importerPath.includes('/src/basic/')) {
        baseFolder = 'basic';
      } else if (importerPath.includes('/src/advanced/')) {
        baseFolder = 'advanced';
      } else if (importerPath.includes('/src/origin/')) {
        baseFolder = 'origin';
      }

      // @/ 제거하고 나머지 경로 추출
      const relativePath = source.substring(2); // '@/' 제거

      // components, hooks, models, utils, constants인 경우 해당 폴더로 매핑
      const localFolders = ['components', 'hooks', 'models', 'utils', 'constants', 'types', 'pages'];
      const firstSegment = relativePath.split('/')[0];

      if (localFolders.includes(firstSegment)) {
        // src/{baseFolder}/{relativePath}로 해석
        const resolved = path.resolve(__dirname, `./src/${baseFolder}/${relativePath}`);
        return resolved;
      } else {
        // 그 외에는 src/{relativePath}로 해석 (types 등 공통 파일)
        const resolved = path.resolve(__dirname, `./src/${relativePath}`);
        return resolved;
      }
    },
  };
}

export default mergeConfig(
  defineConfig({
    plugins: [react(), dynamicAliasPlugin()],
    resolve: {
      alias: {
        // 폴백용 기본 매핑
        '@': path.resolve(__dirname, './src'),
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
