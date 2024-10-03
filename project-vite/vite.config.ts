import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        build: {
            sourcemap: true, // Source map generation must be turned on
        },
        server: {
            proxy: {
                "/api/v1": {
                    target: env.VITE_API_URL ?? "http://localhost:8000",
                    rewrite: env.VITE_API_URL
                        ? (path) => path.replace(/^\/api\/v1/, "")
                        : undefined,
                },
            },
        },
        plugins: [
            react(),
            sentryVitePlugin({
                org: "your-org",
                project: "your-project",
                authToken: env.SENTRY_AUTH_TOKEN,
            }),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
    };
});
