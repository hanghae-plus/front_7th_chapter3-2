import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  // .env 파일에서 환경변수 로드
  const env = loadEnv(mode, process.cwd(), "");

  // BUILD_TARGET: 'basic' | 'advanced' | 'origin' (default: 'basic')
  const buildTarget = env.BUILD_TARGET || "basic";

  return {
    base: env.BASE_URL || "/",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, `index.${buildTarget}.html`),
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
