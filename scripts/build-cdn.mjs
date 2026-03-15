/**
 * build-cdn.mjs — 完整 CDN 構建流程
 *
 * 使用方式：node scripts/build-cdn.mjs
 *
 * 流程：
 * 1. 執行 pnpm vite build（不含 CDN 映射，取得真實 hash）
 * 2. 將 dist/public/assets/ 下所有 JS/CSS 上傳至 CloudFront
 * 3. 將 本地文件名 -> CDN URL 映射寫入 cdn-manifest.json
 * 4. 再次執行 pnpm vite build（此時 renderBuiltUrl 讀取 manifest，直接生成 CDN 路徑）
 * 5. 輸出最終 dist/public/index.html（所有資源路徑均為 CloudFront URL）
 *
 * 每次修改代碼後執行此腳本，然後 webdev_save_checkpoint + Publish。
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";

const PROJECT_ROOT = new URL("..", import.meta.url).pathname;
const DIST_ASSETS_DIR = join(PROJECT_ROOT, "dist/public/assets");
const CDN_MANIFEST_PATH = join(PROJECT_ROOT, "cdn-manifest.json");

// ── Step 1: 初次構建（取得 hash 文件名）──────────────────────────────────────
console.log("🔨 Step 1: Initial build to get asset hashes...");
execSync("pnpm vite build", { stdio: "inherit", cwd: PROJECT_ROOT });

// ── Step 2: 上傳所有 assets 至 CloudFront ─────────────────────────────────────
console.log("\n☁️  Step 2: Uploading assets to CloudFront...");
const assetFiles = readdirSync(DIST_ASSETS_DIR).filter((f) =>
  statSync(join(DIST_ASSETS_DIR, f)).isFile()
);

if (assetFiles.length === 0) {
  console.error("❌ No asset files found.");
  process.exit(1);
}

const filePaths = assetFiles.map((f) => join(DIST_ASSETS_DIR, f)).join(" ");
const uploadOutput = execSync(`manus-upload-file --webdev ${filePaths}`, {
  encoding: "utf-8",
  cwd: PROJECT_ROOT,
});
console.log(uploadOutput);

// ── Step 3: 解析 CDN URL，寫入 cdn-manifest.json ─────────────────────────────
const cdnMap = {};
for (const line of uploadOutput.split("\n")) {
  const match = line.match(
    /\[SUCCESS\].*?(\S+\.(?:js|css|woff2?|png|svg|ico))\s+->\s+(https:\/\/\S+)/
  );
  if (match) {
    const localFile = basename(match[1]);
    cdnMap[localFile] = match[2];
    console.log(`  ✅ ${localFile} -> ${match[2]}`);
  }
}

if (Object.keys(cdnMap).length === 0) {
  console.error("❌ Failed to parse CDN URLs.");
  process.exit(1);
}

writeFileSync(CDN_MANIFEST_PATH, JSON.stringify(cdnMap, null, 2) + "\n");
console.log(`\n📋 cdn-manifest.json updated with ${Object.keys(cdnMap).length} entries.`);

// ── Step 4: 再次構建（renderBuiltUrl 讀取 manifest，生成 CDN 路徑）────────────
console.log("\n🔨 Step 4: Final build with CDN URLs baked in...");
execSync("pnpm build", { stdio: "inherit", cwd: PROJECT_ROOT });

// ── Step 5: 驗證 ──────────────────────────────────────────────────────────────
const indexHtml = readFileSync(join(PROJECT_ROOT, "dist/public/index.html"), "utf-8");
const hasCdn = indexHtml.includes("cloudfront.net");
const hasLocal = indexHtml.includes('src="/assets/') || indexHtml.includes('href="/assets/');

console.log("\n✅ Verification:");
console.log(`  CloudFront URLs in index.html: ${hasCdn ? "✅ YES" : "❌ NO"}`);
console.log(`  Local /assets/ paths remaining: ${hasLocal ? "⚠️  YES (check config)" : "✅ NONE"}`);

if (hasCdn && !hasLocal) {
  console.log("\n🎉 Success! All static assets are served from CloudFront.");
  console.log("   Next: webdev_save_checkpoint → Publish");
} else {
  console.warn("\n⚠️  Some assets may still be served locally. Check cdn-manifest.json.");
}
