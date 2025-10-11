// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    open: true,
    historyApiFallback: true, // ✅ crucial for React Router routes
  },
  build: {
    outDir: "dist",
  },
  esbuild: {
    loader: "jsx", // treat .js as JSX
    include: /src\/.*\.[jt]sx?$/, // only src folder
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
});
