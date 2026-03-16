/**
 * vite.config.js — 純 HTML 靜態站點配置
 *
 * 此專案已移除 React/Tailwind/JSX 依賴，僅使用 Vite 作為靜態文件開發服務器。
 * 構建由 scripts/build-static.mjs 處理，直接複製 client/public/ 到 dist/public/。
 */
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const PROJECT_ROOT = import.meta.dirname;

// ─── Manus Debug Collector ────────────────────────────────────────────────────
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) return;
    const content = fs.readFileSync(logPath, "utf-8");
    const lines = content.split("\n");
    let trimmedSize = 0;
    let startIndex = lines.length - 1;
    while (startIndex > 0 && trimmedSize < TRIM_TARGET_BYTES) {
      trimmedSize += Buffer.byteLength(lines[startIndex] + "\n", "utf-8");
      startIndex--;
    }
    fs.writeFileSync(logPath, lines.slice(startIndex + 1).join("\n"), "utf-8");
  } catch {}
}

function appendLog(source, data) {
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
  fs.appendFileSync(logPath, data + "\n", "utf-8");
}

function vitePluginManusDebugCollector() {
  return {
    name: "vite-plugin-manus-debug-collector",
    configureServer(server) {
      server.middlewares.use("/__manus__/log", (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405);
          res.end();
          return;
        }
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", () => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
          try {
            const payload = JSON.parse(body);
            const { source, entries } = payload;
            for (const entry of entries) {
              appendLog(source, JSON.stringify(entry));
            }
          } catch {}
        });
      });
    },
  };
}

// ─── Static HTML Plugin ───────────────────────────────────────────────────────
// Serves client/public/index.html directly in dev mode.
function vitePluginStaticHtml() {
  return {
    name: "vite-plugin-static-html",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "/";
        if (url === "/" || url === "/index.html") {
          const htmlPath = path.resolve(PROJECT_ROOT, "client/public/index.html");
          if (fs.existsSync(htmlPath)) {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(fs.readFileSync(htmlPath, "utf-8"));
            return;
          }
        }
        next();
      });
    },
  };
}

// ─── Config ───────────────────────────────────────────────────────────────────
export default defineConfig({
  plugins: [vitePluginStaticHtml(), vitePluginManusRuntime(), vitePluginManusDebugCollector()],
  root: path.resolve(PROJECT_ROOT, "client"),
  publicDir: path.resolve(PROJECT_ROOT, "client/public"),
  build: {
    outDir: path.resolve(PROJECT_ROOT, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: false,
    },
  },
});
