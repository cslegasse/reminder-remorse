import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      // add this to cache all the imports
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*"],
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      manifest: {
        theme_color: "#232e58",
        background_color: "#232e58",
        display: "standalone",
        scope: "/",
        start_url: "/",
        short_name: "Remorse Reminder",
        description: "A todo app to remind you of your remorse.",
        name: "Remorse Reminder",
        icons: [
          {
            src: "mstile-150x150.png",
            sizes: "270x270",
            type: "image/png",
          },
          {
            src: "favicon-16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            src: "favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "android-chrome-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "apple-touch-icon.png",
            sizes: "120x120",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  base: "/",
});
