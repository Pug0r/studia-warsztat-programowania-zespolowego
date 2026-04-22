import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname);
  const apiProxyTarget =
    process.env.VITE_API_PROXY_TARGET ??
    env.VITE_API_PROXY_TARGET ??
    "http://backend:5000";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // Możesz zostawić alias jeśli chcesz mieć dodatkowe lub inne niż w tsconfig
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      port: 3000,
      watch: {
        usePolling: true,
      },
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
