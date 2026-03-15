/**
 * build-cdn.mjs
 *
 * 自動化構建腳本：
 * 1. 執行 pnpm build 生成靜態資源
 * 2. 將 dist/public/assets/ 下的所有 JS/CSS 文件上傳至 CloudFront
 * 3. 將 index.html 中的 /assets/xxx 路徑替換為 CloudFront URL
 * 4. 輸出最終的 index.html（可直接部署）
 *
 * 使用方式：node scripts/build-cdn.mjs
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";

const DIST_ASSETS_DIR = join(process.cwd(), "dist/public/assets");
const INDEX_HTML_PATH = join(process.cwd(), "dist/public/index.html");

console.log("🔨 Step 1: Building project...");
execSync("pnpm build", { stdio: "inherit" });

console.log("\n☁️  Step 2: Uploading assets to CloudFront...");

// 讀取 assets 目錄下所有文件
const assetFiles = readdirSync(DIST_ASSETS_DIR).filter((f) => {
  const fullPath = join(DIST_ASSETS_DIR, f);
  return statSync(fullPath).isFile();
});

if (assetFiles.length === 0) {
  console.error("❌ No asset files found in dist/public/assets/");
  process.exit(1);
}

// 批量上傳所有 asset 文件
const filePaths = assetFiles.map((f) => join(DIST_ASSETS_DIR, f)).join(" ");
const uploadOutput = execSync(
  `manus-upload-file --webdev ${filePaths}`,
  { encoding: "utf-8" }
);

console.log(uploadOutput);

// 解析上傳結果，建立 本地文件名 -> CDN URL 映射
const cdnMap = {};
const lines = uploadOutput.split("\n");
for (const line of lines) {
  // 格式: [SUCCESS] path/to/file -> https://cdn.xxx/file
  const match = line.match(/\[SUCCESS\].*?(\S+\.(?:js|css|woff2?|png|svg|ico))\s+->\s+(https:\/\/\S+)/);
  if (match) {
    const localFile = basename(match[1]);
    const cdnUrl = match[2];
    cdnMap[localFile] = cdnUrl;
    console.log(`  ✅ ${localFile} -> ${cdnUrl}`);
  }
}

if (Object.keys(cdnMap).length === 0) {
  console.error("❌ Failed to parse CDN URLs from upload output");
  process.exit(1);
}

console.log("\n📝 Step 3: Updating index.html with CDN URLs...");

let html = readFileSync(INDEX_HTML_PATH, "utf-8");

// 替換所有 /assets/filename 引用為 CDN URL
for (const [localFile, cdnUrl] of Object.entries(cdnMap)) {
  // 替換 src="/assets/xxx" 和 href="/assets/xxx"
  const escaped = localFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(src|href)="/assets/${escaped}"`, "g");
  html = html.replace(regex, `$1="${cdnUrl}"`);
  console.log(`  🔗 Replaced /assets/${localFile} -> ${cdnUrl}`);
}

writeFileSync(INDEX_HTML_PATH, html, "utf-8");

console.log("\n✅ Done! dist/public/index.html updated with CloudFront URLs.");
console.log("📋 CDN URL Map:");
for (const [file, url] of Object.entries(cdnMap)) {
  console.log(`   ${file}: ${url}`);
}
