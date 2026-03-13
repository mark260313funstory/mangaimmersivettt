/**
 * 沉浸式翻譯 - 漫畫翻譯頁面 主腳本
 * mangaimmersivettt | immersivetranslate.com
 * 所有資源路徑使用相對路徑，兼容子路徑部署
 */

(function () {
  'use strict';

  /* ---- Navbar Scroll Effect ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ---- Mobile Nav Toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Intersection Observer for Animations ---- */
  const animateElements = document.querySelectorAll(
    '.feature-card, .step-item, .testimonial-card, .stat-item, .site-tag'
  );

  if ('IntersectionObserver' in window && animateElements.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    animateElements.forEach(function (el, index) {
      el.style.opacity = '0';
      el.style.animationDelay = (index % 3) * 0.1 + 's';
      observer.observe(el);
    });
  }

  /* ---- Smooth Scroll for Anchor Links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  /* ---- Stats Counter Animation ---- */
  const statNumbers = document.querySelectorAll('.stat-number');
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  /* ---- Lazy Load Images Fallback ---- */
  if ('loading' in HTMLImageElement.prototype === false) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  /* ---- Track CTA Clicks via GTM dataLayer ---- */
  document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'cta_click',
          cta_text: btn.textContent.trim(),
          cta_location: btn.closest('section') ? btn.closest('section').className : 'navbar',
          page_path: window.location.pathname
        });
      }
    });
  });

  console.log('[沉浸式翻譯] 漫畫翻譯頁面已載入 | immersivetranslate.com/ja/mangaimmersive/');
})();
