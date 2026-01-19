import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  // Copy data files to dist for runtime loading
  publicDir: "public",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom"],
          // Component chunks for better code splitting
          "components": [
            "./src/components/SkillInventory",
            "./src/components/QuestLog",
            "./src/components/SettingsPanel"
          ]
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging (optional)
    sourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom"]
  }
});



