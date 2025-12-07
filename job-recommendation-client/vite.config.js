import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      // Also include this if react-dom/client is imported directly by something
      "react-dom/client": path.resolve(__dirname, "node_modules/react-dom/client")
    }
  },
  // Dev server options — proxy /api to backend running on port 4000
  server: {
    port: 5173, // keep your previous port (change if you prefer)
    proxy: {
      // Proxy requests that start with /api to your backend
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        // rewrite not required because backend path matches (/api/...)
      }
    }
  }
});