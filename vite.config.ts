import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    base: "/front_7th_chapter3-2/", // GitHub Pages 배포 경로
    build: {
      rollupOptions: {
        input: "index.advanced.html", // advanced HTML을 entry point로 지정
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  })
);
