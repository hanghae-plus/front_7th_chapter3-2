import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/front_7th_chapter3-2/advanced/",
  build: {
    outDir: "dist/advanced",
    emptyOutDir: false,
    rollupOptions: {
      input: "./index.advanced.html",
    },
  },
});
