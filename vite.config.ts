import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// 동적 경로 해석을 위한 커스텀 플러그인
function dynamicAliasPlugin(): Plugin {
  return {
    name: 'dynamic-alias',
    enforce: 'pre',
    configResolved() {
    },
    async resolveId(source, importer) {
      if (!source.startsWith('@/') || !importer) return null;
    
      const importerPath = importer.replace(/\\/g, '/');
      let baseFolder = 'basic';
    
      if (importerPath.includes('/src/basic/')) baseFolder = 'basic';
      else if (importerPath.includes('/src/advanced/')) baseFolder = 'advanced';
      else if (importerPath.includes('/src/origin/')) baseFolder = 'origin';
    
      const relativePath = source.substring(2);
      const localFolders = ['constants', 'features', 'pages', 'shared', 'App'];
      const firstSegment = relativePath.split('/')[0];

      const resolvedPath = localFolders.includes(firstSegment)
        ? path.join(process.cwd(), `src/${baseFolder}/${relativePath}`)
        : path.join(process.cwd(), `src/${relativePath}`);
    
      return await this.resolve(resolvedPath, importer, { skipSelf: true });
    }
    
  };
}

export default mergeConfig(
  defineConfig({
    plugins: [react(), dynamicAliasPlugin()],
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    },
  })
)
