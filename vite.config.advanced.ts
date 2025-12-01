import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/advanced/",
  build: {
    outDir: "dist/advanced",
    emptyOutDir: false,
    rollupOptions: {
      input: "./index.advanced.html",
    },
  },
});
