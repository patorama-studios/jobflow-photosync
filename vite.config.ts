import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    port: 5173,
    host: "127.0.0.1",
    strictPort: true,
    hmr: {
      port: 5173,
      host: "127.0.0.1"
    },
    watch: {
      usePolling: true,
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});