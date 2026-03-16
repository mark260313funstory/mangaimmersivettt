/**
 * ssg.mjs — SSG 預渲染腳本
 *
 * 在 pnpm build 之後執行，將 React 組件預渲染為靜態 HTML。
 *
 * 流程：
 * 1. 讀取 dist/public/index.html（Vite 構建產物）
 * 2. 用 Vite SSR 模式構建 entry-server.tsx -> dist/server/entry-server.js
 * 3. 調用 render() 取得 HTML 字符串
 * 4. 將 HTML 注入 index.html 的 <div id="root"> 中
 * 5. 輸出最終靜態 HTML（爬蟲可直接讀取完整內容）
 */

import { build } from "vite";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const DIST_PUBLIC = resolve(PROJECT_ROOT, "dist/public");
const DIST_SERVER = resolve(PROJECT_ROOT, "dist/server");

async function main() {
  console.log("\n🔧 [SSG] Building server-side entry...");

  // Step 1: Build entry-server.tsx in SSR mode
  await build({
    root: resolve(PROJECT_ROOT, "client"),
    resolve: {
      alias: {
        "@": resolve(PROJECT_ROOT, "client/src"),
        "@shared": resolve(PROJECT_ROOT, "shared"),
        "@assets": resolve(PROJECT_ROOT, "attached_assets"),
      },
    },
    envDir: PROJECT_ROOT,
    plugins: [
      (await import("@vitejs/plugin-react")).default({
        jsxRuntime: "automatic",
      }),
    ],
    build: {
      ssr: "src/entry-server.tsx",
      outDir: DIST_SERVER,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          format: "esm",
        },
      },
    },
    logLevel: "warn",
  });

  console.log("✅ [SSG] Server entry built.");

  // Step 2: Load the server entry and render
  const serverEntryPath = resolve(DIST_SERVER, "entry-server.js");
  if (!existsSync(serverEntryPath)) {
    console.error("❌ [SSG] entry-server.js not found at", serverEntryPath);
    process.exit(1);
  }

  const { render } = await import(pathToFileURL(serverEntryPath).href);
  const { html: appHtml } = render();
  console.log(`✅ [SSG] Rendered ${appHtml.length} chars of HTML.`);

  // Step 3: Inject into index.html
  const indexPath = resolve(DIST_PUBLIC, "index.html");
  if (!existsSync(indexPath)) {
    console.error("❌ [SSG] index.html not found at", indexPath);
    process.exit(1);
  }

  let template = readFileSync(indexPath, "utf-8");

  // Replace <div id="root"></div> with pre-rendered content
  const injected = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  if (injected === template) {
    console.warn("⚠️  [SSG] Could not find <div id=\"root\"></div> in index.html. Skipping injection.");
    process.exit(0);
  }

  writeFileSync(indexPath, injected, "utf-8");
  console.log("✅ [SSG] index.html updated with pre-rendered content.");

  // Step 4: Verify
  const finalHtml = readFileSync(indexPath, "utf-8");
  const hasContent = finalHtml.includes("一鍵漫畫翻譯") || finalHtml.includes("沉浸式翻譯");
  console.log(`\n🎉 [SSG] Verification: page content in HTML = ${hasContent ? "✅ YES" : "❌ NO"}`);
  if (hasContent) {
    console.log("   SEO-friendly static HTML generated successfully!\n");
  }
}

main().catch((err) => {
  console.error("❌ [SSG] Error:", err);
  process.exit(1);
});
