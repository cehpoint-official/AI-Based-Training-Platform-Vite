import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const API_URL = `${env.VITE_API_URL ?? "http://localhost:5000"}`;
  
  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin']
        }
      }),
      VitePWA({
        manifest: {
          short_name: "CehpointE-LearningSolutions",
          name: "Ai Course Generator",
          icons: [
            {
              src: "favicon.ico",
              sizes: "64x64 32x32 24x24 16x16",
              type: "image/x-icon",
            },
            {
              src: "logo192.png",
              type: "image/png",
              sizes: "192x192",
            },
            {
              src: "logo512.png",
              type: "image/png",
              sizes: "512x512",
            },
          ],
          start_url: ".",
          display: "standalone",
          theme_color: "#000000",
          background_color: "#ffffff",
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // Set to 3 MiB or higher
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
    optimizeDeps: {
      exclude: ['pdfjs-dist']
    },
    build: {
      chunkSizeWarningLimit: 600, // Optionally increase the chunk size warning limit
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString(); // Create a chunk for each npm package
            }
          },
        },
      },
    },
  };
});