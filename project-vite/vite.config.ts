import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // Source map generation must be turned on
  },
  plugins: [
    react(),
    sentryVitePlugin({
      org: "your-org",
      project: "your-project",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
