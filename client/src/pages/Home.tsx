/**
 * 沉浸式翻譯 - 漫畫翻譯介紹頁
 * 設計風格：日式極簡主義 × 科技感 (Japandi Tech)
 * 主色：#6C47FF（品牌紫）| 背景：#FAFAF8（溫暖米白）
 * Canonical: https://immersivetranslate.com/ja/mangaimmersive/
 */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Zap, Search, Globe, Palette, Bot, Smartphone,
  ArrowRight, Star, Check, ChevronDown, Menu, X
} from "lucide-react";

// Image assets (CDN URLs - tied to webdev project lifecycle)
const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663389822136/c2XL3nvJQTebb9Jhwe2mXH/manga-hero-bg-E427Mb7fysoGZeqvaMFzqJ.webp";
const DEMO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663389822136/c2XL3nvJQTebb9Jhwe2mXH/manga-demo-mockup-ThT8QdVuKNbRamzjkKQMtY.webp";

// ---- Data ----
const STATS = [
  { number: "1000萬+", label: "全球用戶" },
  { number: "20+", label: "支援漫畫網站" },
  { number: "100+", label: "支援語言" },
  { number: "4.8★", label: "用戶評分" },
];

const FEATURES = [
  {
    icon: <Zap className="w-7 h-7" />,
    title: "一鍵快速翻譯",
    desc: "進入支援的漫畫網站，啟動浮動球，漫畫翻譯快捷按鈕自動出現，點擊即可翻譯整頁漫畫，操作極為簡便。",
  },
  {
    icon: <Search className="w-7 h-7" />,
    title: "精準識別複雜字體",
    desc: "採用先進的 OCR 技術，能夠精準識別日文漫畫中的複雜手寫字體、特效字體，大幅提升翻譯品質與準確率。",
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: "100+ 語言支援",
    desc: "支援日文、韓文、英文、繁體中文、簡體中文等 100 多種語言互譯，讓你暢讀來自世界各地的漫畫作品。",
  },
  {
    icon: <Palette className="w-7 h-7" />,
    title: "保留原版排版",
    desc: "翻譯後的文字自動填入原有對話框，保留漫畫原始排版與視覺風格，提供最接近原版的閱讀體驗。",
  },
  {
    icon: <Bot className="w-7 h-7" />,
    title: "AI 智慧翻譯引擎",
    desc: "整合 ChatGPT、DeepL、DeepSeek、Gemini 等 20+ 頂尖翻譯引擎，根據漫畫語境智慧選擇最佳翻譯方案。",
  },
  {
    icon: <Smartphone className="w-7 h-7" />,
    title: "多平台支援",
    desc: "支援 Chrome、Firefox、Edge、Safari 瀏覽器擴充功能，以及 iOS 和 Android 行動應用程式，隨時隨地追漫。",
  },
];

const SUPPORTED_SITES = [
  "Pixiv", "MANGA Plus", "MangaDex", "COMIC FUZ", "ShonenJumpPlus",
  "ComicWalker", "Web Ace", "Comic Top", "FANBOX", "MangaZ",
  "PASH UP", "ReadComicOnline", "Copymanga", "動漫之家",
  "Twitter Comic", "Antbyw", "Zerobywzz",
];

const STEPS = [
  {
    num: "01",
    title: "安裝擴充功能",
    desc: "前往 Chrome 線上應用程式商店，免費安裝沉浸式翻譯擴充功能。",
  },
  {
    num: "02",
    title: "前往漫畫網站",
    desc: "打開任意支援的漫畫網站，如 Pixiv、MangaDex 等，找到想看的漫畫。",
  },
  {
    num: "03",
    title: "點擊翻譯按鈕",
    desc: "啟動浮動球，點擊漫畫翻譯按鈕，即可立即看到翻譯後的漫畫內容。",
  },
];

const TESTIMONIALS = [
  {
    emoji: "🎌",
    text: "「終於可以第一時間看到最新話的日漫了！翻譯品質非常好，完全不需要等待官方翻譯。」",
    name: "台灣漫畫愛好者",
    stars: 5,
  },
  {
    emoji: "📚",
    text: "「識別複雜日文字體的能力讓我驚艷，就連手寫效果字也能準確翻譯，真的太厲害了！」",
    name: "資深漫畫讀者",
    stars: 5,
  },
  {
    emoji: "🌟",
    text: "「支援的網站越來越多，現在我追的所有漫畫平台都支援了，強烈推薦給每個漫畫迷！」",
    name: "Chrome 商店用戶",
    stars: 5,
  },
];

// ---- Intersection Observer Hook ----
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ---- Navbar ----
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-background/80 backdrop-blur-sm"
      }`}
      role="navigation"
      aria-label="主導覽"
    >
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center gap-6">
        {/* Logo */}
        <a
          href="https://immersivetranslate.com/"
          className="flex items-center gap-2.5 font-bold text-foreground hover:text-primary transition-colors flex-shrink-0"
          aria-label="沉浸式翻譯首頁"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-black">沉</div>
          <span className="text-base font-semibold">沉浸式翻譯</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          <a href="https://immersivetranslate.com/ja/mangaimmersive/" className="px-3 py-2 rounded-lg text-sm text-primary bg-primary/10 font-medium">漫畫翻譯</a>
          <a href="https://immersivetranslate.com/" className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">官方網站</a>
          <a href="https://immersivetranslate.com/pricing/" className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">定價方案</a>
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <a href="/zh/mangaimmersive/" hrefLang="zh" className="px-2 py-1 rounded hover:bg-muted hover:text-foreground transition-colors">繁中</a>
            <span className="opacity-30">|</span>
            <a href="/en/mangaimmersive/" hrefLang="en" className="px-2 py-1 rounded hover:bg-muted hover:text-foreground transition-colors">EN</a>
            <span className="opacity-30">|</span>
            <a href="/ja/mangaimmersive/" hrefLang="ja" className="px-2 py-1 rounded hover:bg-muted hover:text-foreground transition-colors">日本語</a>
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://immersivetranslate.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-md flex-shrink-0"
        >
          免費下載
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-4 flex flex-col gap-2">
          <a href="https://immersivetranslate.com/ja/mangaimmersive/" className="px-3 py-2 rounded-lg text-sm text-primary bg-primary/10 font-medium">漫畫翻譯</a>
          <a href="https://immersivetranslate.com/" className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">官方網站</a>
          <a href="https://immersivetranslate.com/pricing/" className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">定價方案</a>
          <div className="flex items-center gap-2 px-3 pt-2 text-xs text-muted-foreground border-t border-border mt-1">
            <a href="/zh/mangaimmersive/" hrefLang="zh">繁中</a>
            <span>|</span>
            <a href="/en/mangaimmersive/" hrefLang="en">EN</a>
            <span>|</span>
            <a href="/ja/mangaimmersive/" hrefLang="ja">日本語</a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ---- Hero Section ----
function HeroSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <header className="relative overflow-hidden bg-background" role="banner">
      {/* Speed lines decorative background */}
      <div className="absolute inset-0 speed-lines-bg opacity-60 pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

      <div
        ref={ref}
        className="container mx-auto px-4 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
      >
        {/* Left: Text */}
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            全球 1000 萬用戶信賴
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-foreground leading-tight mb-6">
            一鍵漫畫翻譯
            <span className="block gradient-text text-3xl lg:text-4xl xl:text-5xl mt-2">
              突破語言障礙<br />暢讀全球漫畫
            </span>
          </h1>

          {/* Description */}
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg font-sans">
            沉浸式翻譯支援 Pixiv、MangaDex、MANGA Plus 等{" "}
            <strong className="text-foreground">20+ 主流漫畫網站</strong>，
            支援 <strong className="text-foreground">100+ 語言</strong>翻譯，
            讓你第一時間追讀最新話，無需等待官方翻譯。
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <a
              href="https://immersivetranslate.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 animate-pulse-glow"
            >
              🚀 免費安裝擴充功能
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 bg-secondary text-primary px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary/15 transition-all"
            >
              了解更多功能
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          {/* Platform tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">支援平台：</span>
            {["Chrome", "Firefox", "Edge", "Safari", "iOS", "Android"].map((p) => (
              <span key={p} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full border border-border">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Hero Image */}
        <div
          className={`relative transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="animate-float">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-border">
              <img
                src={HERO_IMAGE}
                alt="漫畫翻譯示範 - 沉浸式翻譯將日文漫畫即時翻譯成繁體中文"
                className="w-full block"
                loading="eager"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white border border-border rounded-xl px-4 py-3 shadow-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">文A</div>
              <div>
                <div className="text-xs font-semibold text-foreground">即時翻譯中</div>
                <div className="text-xs text-muted-foreground">繁體中文</div>
              </div>
            </div>
            {/* Stars badge */}
            <div className="absolute -top-4 -right-4 bg-white border border-border rounded-xl px-3 py-2 shadow-lg">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">4.8 / 5.0</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ---- Stats Section ----
function StatsSection() {
  const { ref, inView } = useInView(0.2);
  return (
    <section className="bg-primary py-12" aria-label="數據統計" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-white transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-3xl lg:text-4xl font-black mb-1">{stat.number}</div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Features Section ----
function FeaturesSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section id="features" className="py-24 bg-background" aria-labelledby="features-title" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-600 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 id="features-title" className="text-3xl lg:text-4xl font-black text-foreground mb-4">
            強大的漫畫翻譯功能
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg max-w-xl mx-auto font-sans">
            專為漫畫愛好者設計，讓語言不再是追漫的障礙
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => (
            <article
              key={feat.title}
              className={`bg-card border border-border rounded-2xl p-7 feature-card-hover transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">{feat.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Supported Sites ----
function SupportedSitesSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="py-20 bg-muted/40" aria-labelledby="sites-title" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-600 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 id="sites-title" className="text-3xl lg:text-4xl font-black text-foreground mb-4">
            支援 20+ 主流漫畫網站
          </h2>
          <p className="text-muted-foreground font-sans">涵蓋日漫、韓漫、美漫等各大平台，持續新增中</p>
        </div>
        <div className={`flex flex-wrap gap-3 justify-center transition-all duration-600 delay-200 ${inView ? "opacity-100" : "opacity-0"}`}>
          {SUPPORTED_SITES.map((site) => (
            <span
              key={site}
              className="bg-white border border-border text-foreground px-4 py-2 rounded-full text-sm font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors cursor-default"
            >
              {site}
            </span>
          ))}
          <span className="bg-primary/10 border border-primary text-primary px-4 py-2 rounded-full text-sm font-medium italic">
            更多持續新增中...
          </span>
        </div>
      </div>
    </section>
  );
}

// ---- How It Works ----
function HowItWorksSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="py-24 bg-background" aria-labelledby="howto-title" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-600 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 id="howto-title" className="text-3xl lg:text-4xl font-black text-foreground mb-4">
            三步驟開始翻譯漫畫
          </h2>
          <p className="text-muted-foreground font-sans">簡單快速，幾秒鐘內即可開始閱讀翻譯版漫畫</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-4 max-w-4xl mx-auto">
          {STEPS.map((step, i) => (
            <>
              <div
                key={step.num}
                className={`flex-1 text-center bg-card border border-border rounded-2xl p-8 feature-card-hover transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="text-5xl font-black gradient-text mb-4">{step.num}</div>
                <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight
                  key={`arrow-${i}`}
                  className={`w-6 h-6 text-primary/40 flex-shrink-0 rotate-90 lg:rotate-0 transition-all duration-500 ${inView ? "opacity-100" : "opacity-0"}`}
                  style={{ transitionDelay: `${(i + 0.5) * 120}ms` }}
                />
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Demo Section ----
function DemoSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="py-24 bg-muted/40" aria-labelledby="demo-title" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-600 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 id="demo-title" className="text-3xl lg:text-4xl font-black text-foreground mb-4">
            實際翻譯效果展示
          </h2>
          <p className="text-muted-foreground font-sans">瀏覽器內一鍵翻譯，效果直觀清晰</p>
        </div>
        <div
          className={`max-w-3xl mx-auto transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-primary/15 border border-border">
            <img
              src={DEMO_IMAGE}
              alt="沉浸式翻譯漫畫翻譯效果展示 - 瀏覽器中的翻譯介面"
              className="w-full block"
              loading="lazy"
            />
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            {[
              { icon: <Check className="w-4 h-4" />, text: "保留原始排版" },
              { icon: <Check className="w-4 h-4" />, text: "即時翻譯" },
              { icon: <Check className="w-4 h-4" />, text: "高準確率" },
              { icon: <Check className="w-4 h-4" />, text: "無需離開頁面" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-foreground bg-white border border-border px-4 py-2 rounded-full">
                <span className="text-primary">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Testimonials ----
function TestimonialsSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="py-24 bg-background" aria-labelledby="testimonials-title" ref={ref}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-600 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 id="testimonials-title" className="text-3xl lg:text-4xl font-black text-foreground mb-4">
            用戶好評如潮
          </h2>
          <p className="text-muted-foreground font-sans">全球 1000 萬用戶的真實回饋</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={t.name}
              className={`bg-card border border-border rounded-2xl p-7 feature-card-hover transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="text-sm text-foreground leading-relaxed mb-6 italic font-sans">{t.text}</p>
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                  {t.emoji}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- CTA Section ----
function CTASection() {
  const { ref, inView } = useInView(0.2);
  return (
    <section
      className="py-24 bg-primary relative overflow-hidden"
      aria-labelledby="cta-title"
      ref={ref}
    >
      {/* Decorative speed lines */}
      <div className="absolute inset-0 speed-lines-bg opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className={`container mx-auto px-4 lg:px-8 text-center relative transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h2 id="cta-title" className="text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-4">
          立即開始，免費翻譯你的漫畫
        </h2>
        <p className="text-white/80 text-base lg:text-lg mb-10 max-w-xl mx-auto font-sans">
          加入全球 1000 萬用戶，突破語言障礙，暢讀全球漫畫
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <a
            href="https://immersivetranslate.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold text-base hover:bg-white/90 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            🚀 免費安裝 Chrome 擴充功能
          </a>
          <a
            href="https://immersivetranslate.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-transparent text-white border-2 border-white/60 px-8 py-4 rounded-full font-bold text-base hover:bg-white/10 hover:border-white transition-all hover:-translate-y-0.5"
          >
            📱 下載行動應用程式
          </a>
        </div>
        <p className="text-white/50 text-sm font-sans">完全免費 · 無需註冊 · 立即使用</p>
      </div>
    </section>
  );
}

// ---- Footer ----
function Footer() {
  return (
    <footer className="bg-foreground text-white/70 py-16" role="contentinfo">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <a href="https://immersivetranslate.com/" className="flex items-center gap-2.5 text-white font-bold mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-black">沉</div>
              <span>沉浸式翻譯</span>
            </a>
            <p className="text-sm text-white/50 leading-relaxed font-sans">下一代 AI 翻譯工具，突破語言障礙</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">產品功能</h4>
            <ul className="space-y-2.5 font-sans">
              {[
                { label: "漫畫翻譯", href: "https://immersivetranslate.com/manga/" },
                { label: "網頁翻譯", href: "https://immersivetranslate.com/" },
                { label: "PDF 翻譯", href: "https://immersivetranslate.com/" },
                { label: "影片字幕翻譯", href: "https://immersivetranslate.com/" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">多語言版本</h4>
            <ul className="space-y-2.5 font-sans">
              {[
                { label: "繁體中文", href: "/zh/mangaimmersive/", lang: "zh" },
                { label: "English", href: "/en/mangaimmersive/", lang: "en" },
                { label: "日本語", href: "/ja/mangaimmersive/", lang: "ja" },
                { label: "한국어", href: "/ko/mangaimmersive/", lang: "ko" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} hrefLang={item.lang} className="text-sm text-white/50 hover:text-white transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">支援與資源</h4>
            <ul className="space-y-2.5 font-sans">
              {[
                { label: "定價方案", href: "https://immersivetranslate.com/pricing/" },
                { label: "使用教學", href: "https://immersivetranslate.com/docs/" },
                { label: "隱私政策", href: "https://immersivetranslate.com/privacy/" },
                { label: "服務條款", href: "https://immersivetranslate.com/terms/" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40 font-sans">© 2024 沉浸式翻譯. 保留所有權利.</p>
          <p className="text-xs text-white/30 font-sans">
            本頁面正式網址：
            <a href="https://immersivetranslate.com/ja/mangaimmersive/" className="hover:text-white/60 transition-colors">
              https://immersivetranslate.com/ja/mangaimmersive/
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---- Main Export ----
export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <SupportedSitesSection />
      <HowItWorksSection />
      <DemoSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
