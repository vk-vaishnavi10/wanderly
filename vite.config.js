// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "favicon.svg",
        "apple-touch-icon.png",
        "icon-192x192.png",
        "icon-512x512.png"
      ],
      manifest: {
        name: "Wanderly - Travel & Explore",
        short_name: "Wanderly",
        description: "✨ Find your next destination — Flights, Hotels, Packages & Adventures!",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "maskable any"
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // allow larger bundles
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: ({ url }) => url.origin.includes("openweathermap.org"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
    open: true,
    fs: { strict: false },
    historyApiFallback: {
      index: '/index.html',
    },
  },
  
  build: {
    outDir: "dist"
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
});
