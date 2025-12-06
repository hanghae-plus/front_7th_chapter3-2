import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  // .env 파일에서 환경변수 로드
  const env = loadEnv(mode, process.cwd(), "");

  // process.env 우선, 없으면 .env 파일, 없으면 기본값
  const buildTarget = process.env.BUILD_TARGET || env.BUILD_TARGET || "basic";
  const baseUrl = process.env.BASE_URL || env.BASE_URL || "/";

  console.log(`🎯 Build Target: ${buildTarget}`);
  console.log(`🌐 Base URL: ${baseUrl}`);

  return {
    base: baseUrl,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, `index.${buildTarget}.html`),
        },
        output: {
          // 출력 파일명을 index.html로 변경
          entryFileNames: "assets/[name]-[hash].js",
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  };
});
