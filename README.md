# mangaimmersivettt — 沉浸式翻譯漫畫翻譯介紹頁

> 繁體中文版本 | 部署於 Manus，透過 Reverse Proxy 映射至 `immersivetranslate.com/ja/mangaimmersive/`

---

## 技術架構

```
用戶瀏覽器
    ↓
https://immersivetranslate.com/ja/mangaimmersive/
    ↓ (Reverse Proxy)
https://mangaimmersive-jwpqkybx.manus.space/
```

## 目錄結構

```
mangaimmersivettt/
├── index.html              # 主頁（繁中版，含完整 SEO 標籤）
├── sitemap.xml             # Sitemap（僅含 immersivetranslate.com URL）
├── robots.txt              # 搜尋引擎爬蟲設定
├── README.md               # 本說明文件
└── assets/
    ├── css/
    │   └── style.css       # 主樣式表
    ├── js/
    │   └── main.js         # 主腳本（含 GTM 事件追蹤）
    └── images/
        ├── immersive_logo.png
        ├── manga_translation_demo.png
        └── manga_floating_ball.webp
```

## SEO 設計

### Canonical URL
所有頁面均設定 canonical 指向主域：
```html
<link rel="canonical" href="https://immersivetranslate.com/ja/mangaimmersive/">
```

### hreflang 多語言
```html
<link rel="alternate" hreflang="zh-TW" href="https://immersivetranslate.com/ja/mangaimmersive/">
<link rel="alternate" hreflang="zh"    href="https://immersivetranslate.com/zh/mangaimmersive/">
<link rel="alternate" hreflang="en"    href="https://immersivetranslate.com/en/mangaimmersive/">
<link rel="alternate" hreflang="ja"    href="https://immersivetranslate.com/ja/mangaimmersive/">
<link rel="alternate" hreflang="ko"    href="https://immersivetranslate.com/ko/mangaimmersive/">
```

### Google Tag Manager
GTM ID: `GTM-WM8H9758`
- `<head>` 頂部插入 GTM script
- `<body>` 開始後插入 GTM noscript iframe

## 資源路徑規範

所有靜態資源使用**相對路徑**，確保 Reverse Proxy 子路徑部署兼容：

```html
<!-- 正確 ✓ -->
<link rel="stylesheet" href="./assets/css/style.css">
<script src="./assets/js/main.js"></script>
<img src="./assets/images/logo.png">

<!-- 錯誤 ✗ -->
<link rel="stylesheet" href="/assets/css/style.css">
```

## URL 結構

```
immersivetranslate.com/{language}/{product}/

範例：
immersivetranslate.com/ja/mangaimmersive/   ← 本站（繁中）
immersivetranslate.com/en/mangaimmersive/   ← 英文版
immersivetranslate.com/ko/mangaimmersive/   ← 韓文版
immersivetranslate.com/zh/mangaimmersive/   ← 簡中版
```

## Reverse Proxy 設定範例（Nginx）

```nginx
location /ja/mangaimmersive/ {
    proxy_pass https://mangaimmersive-jwpqkybx.manus.space/;
    proxy_set_header Host mangaimmersive-jwpqkybx.manus.space;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 部署說明

### 部署至 Manus
1. 將整個目錄上傳至 Manus
2. 設定 Manus 公開 URL
3. 在主域 Nginx 設定 Reverse Proxy

### 部署至 GitHub Pages
1. 建立 GitHub Repository
2. 將目錄推送至 `gh-pages` 分支
3. 在主域 Nginx 設定 Reverse Proxy

## 注意事項

- **絕對不能**在頁面中出現 `github.io` 或 `manus.space` 的連結
- 所有內部連結使用相對路徑或 `immersivetranslate.com` 主域
- Sitemap 只包含 `immersivetranslate.com` 的 URL
