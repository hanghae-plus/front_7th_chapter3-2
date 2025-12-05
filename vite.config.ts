import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// 환경 변수 타입 선언
declare const process: {
  env: {
    VITE_BASE_PATH?: string;
  };
};

const basePath =
  (typeof process !== "undefined" && process.env?.VITE_BASE_PATH) || "/";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    build: {
      rollupOptions: {
        input: "./index.advanced.html",
      },
    },
    base: basePath,
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  })
);
