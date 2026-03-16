/**
 * build-static.mjs — 純 HTML 靜態構建腳本
 *
 * 跳過 React/Vite 構建，直接將 client/public/ 下的靜態文件
 * 複製到 dist/public/，供 Express 服務器托管。
 */
import { cpSync, mkdirSync, rmSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const SRC = resolve(PROJECT_ROOT, "client/public");
const DEST = resolve(PROJECT_ROOT, "dist/public");

// Clean and recreate dist/public
if (existsSync(DEST)) {
  rmSync(DEST, { recursive: true });
}
mkdirSync(DEST, { recursive: true });

// Copy all files from client/public to dist/public
cpSync(SRC, DEST, { recursive: true });

console.log("✅ Static build complete: client/public → dist/public");
