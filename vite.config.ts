import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from 'path';

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.advanced.html'),
        },
      },
    },
    base: process.env.VITE_BASE_PATH || "/",
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      environmentOptions: {
        jsdom: {
          resources: "usable",
        },
      },
    },
  })
);