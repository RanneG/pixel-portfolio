import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
import { handleGroqPersonaChatBody, type ChatRequestBody } from "./api/chatStream.js";

/** Serves POST /api/chat during `npm run dev` when GROQ_API_KEY is in .env / .env.local */
function chatApiDevPlugin(): Plugin {
  return {
    name: "browse-chat-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathOnly = (req.url ?? "").split("?")[0];
        if (pathOnly !== "/api/chat") {
          next();
          return;
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        const env = loadEnv(server.config.mode, process.cwd(), "");
        const key = env.GROQ_API_KEY;

        try {
          const raw = await new Promise<string>((resolve, reject) => {
            const chunks: Buffer[] = [];
            req.on("data", (c: Buffer | string) => {
              chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
            });
            req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
            req.on("error", reject);
          });
          const body: ChatRequestBody = raw ? JSON.parse(raw) : {};
          await handleGroqPersonaChatBody(body, key, res);
        } catch (e) {
          console.error("[vite /api/chat]", e);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid JSON or chat handler error" }));
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), chatApiDevPlugin()],
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    alias: {
      react: path.resolve(projectRoot, "node_modules/react"),
      "react-dom": path.resolve(projectRoot, "node_modules/react-dom"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      host: "localhost",
      port: 5173,
    },
  },
  publicDir: "public",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router", "react-router-dom"],
          components: [
            "./src/components/SkillInventory",
            "./src/components/QuestLog",
            "./src/components/SettingsPanel",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "react-router-dom"],
  },
});
