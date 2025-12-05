import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default mergeConfig(
  defineConfig({
    plugins: [react(), tsconfigPaths()],
    base: process.env.NODE_ENV === "production" ? "/front_7th_chapter3-2/" : "/",
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  })
);
