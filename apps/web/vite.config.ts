import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: "http://localhost:3000",
    proxy: {
      "/api": {
        target: "http://localhost:5001/buildtray/us-central1",
        changeOrigin: true,
      },
    },
  },
});
