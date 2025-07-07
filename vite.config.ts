import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react(), tsconfigPaths()],
  define: {
    global: "globalThis",
  },
  server: {
    port: 53000,
  },
});
