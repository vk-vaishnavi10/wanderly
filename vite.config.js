// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 🚫 PWA removed completely because it breaks Docker build

export default defineConfig({
  plugins: [
    react(),
  ],

  server: {
    host: true,
    port: 5173,
    open: true,
    fs: { strict: false },
    historyApiFallback: {
      index: "/index.html",
    },
  },

  build: {
    outDir: "dist",
    sourcemap: false,
  },

  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },
});
