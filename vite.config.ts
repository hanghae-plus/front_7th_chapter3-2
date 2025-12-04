import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const base = process.env.NODE_ENV === "production" ? "/front_7th_chapter3-2/" : "";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    base,
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.advanced.html"),
        },
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
