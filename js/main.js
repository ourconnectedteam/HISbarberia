/* ══════════════════════════════════════════════════════════
   HIS BARBERÍA — Interactions & Animations
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Preloader ───────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Hide after load + short delay for effect
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('is-gone'), 1800);
    });
  }

  /* ─── Custom Cursor ───────────────────────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    // cursor vars already declared above for use in lightbox section
    let mx = 0, my = 0;
    let fx = 0, fy = 0;
    let rafId;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    function followCursor() {
      fx += (mx - fx) * 0.11;
      fy += (my - fy) * 0.11;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      rafId = requestAnimationFrame(followCursor);
    }
    followCursor();

    // Hover effects on interactive elements
    document.querySelectorAll('a, button, .svc-list li, .wax-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        follower.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover');
        follower.classList.remove('is-hover');
      });
    });
  }

  /* ─── Navigation ──────────────────────────────────────── */
  const nav = document.getElementById('nav');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ─── Mobile Menu ─────────────────────────────────────── */
  const burger     = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    let menuOpen = false;

    burger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      burger.classList.toggle('is-open', menuOpen);
      mobileMenu.classList.toggle('is-open', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        burger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── Scroll Reveal ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  /* ─── Active Nav Links ────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__links a');

  if (sections.length && navLinks.length) {
    const sectionIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(a => {
            a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.45 });

    sections.forEach(s => sectionIo.observe(s));
  }

  /* ─── Hero Parallax ───────────────────────────────────── */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight * 1.2) {
        heroBg.style.transform = `translateY(${scrolled * 0.28}px)`;
      }
    }, { passive: true });
  }

  /* ─── Smooth scroll for anchor links ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ─── Featured Prices Slider ─────────────────────────── */
  const fpVisual  = document.getElementById('fpSlider');
  if (fpVisual) {
    const slides  = fpVisual.querySelectorAll('.fp__slide');
    const dots    = fpVisual.querySelectorAll('.fp__dot');
    const btnPrev = document.getElementById('fpPrev');
    const btnNext = document.getElementById('fpNext');
    let current = 0;
    let timer;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    function autoplay() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 4500);
    }

    dots.forEach(dot => dot.addEventListener('click', () => { goTo(+dot.dataset.slide); autoplay(); }));
    if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); autoplay(); });
    if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); autoplay(); });

    fpVisual.addEventListener('mouseenter', () => clearInterval(timer));
    fpVisual.addEventListener('mouseleave', () => autoplay());

    autoplay();
  }

  /* ─── Gallery staggered entrance ─────────────────────── */
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    const galleryIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const items = entry.target.querySelectorAll('.gallery__item');
        items.forEach((item, i) => {
          // Set stagger delay inline, then clear it after entrance so hover is instant
          item.style.transitionDelay = `${i * 75}ms`;
          requestAnimationFrame(() => {
            item.classList.add('is-visible');
            item.addEventListener('transitionend', () => {
              item.style.transitionDelay = '0ms';
            }, { once: true });
          });
        });
        galleryIo.unobserve(entry.target);
      });
    }, { threshold: 0.05 });
    galleryIo.observe(galleryGrid);
  }

  /* ─── Lightbox ────────────────────────────────────────── */
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightboxImg');
  const lightboxCap    = document.getElementById('lightboxCaption');
  const lightboxCtr    = document.getElementById('lightboxCounter');
  const lightboxClose  = document.getElementById('lightboxClose');
  const lightboxPrev   = document.getElementById('lightboxPrev');
  const lightboxNext   = document.getElementById('lightboxNext');
  const lightboxBack   = document.getElementById('lightboxBackdrop');
  const galleryItems   = Array.from(document.querySelectorAll('.gallery__item'));

  if (lightbox && galleryItems.length) {
    let currentIndex = 0;

    function getItemData(item) {
      const img   = item.querySelector('img');
      const cat   = item.querySelector('.gallery__cap-cat');
      const title = item.querySelector('.gallery__cap-title');
      const caption = cat && title
        ? `${cat.textContent.trim()} · ${title.textContent.trim()}`
        : (item.querySelector('figcaption') || { textContent: '' }).textContent.trim();
      return {
        src: img ? img.src : '',
        alt: img ? img.alt : '',
        caption
      };
    }

    function showLightbox(index) {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const { src, alt, caption } = getItemData(galleryItems[currentIndex]);

      lightboxImg.classList.remove('is-loaded');
      lightboxImg.alt = alt;
      lightboxCap.textContent = caption;
      lightboxCtr.textContent = `${currentIndex + 1} / ${galleryItems.length}`;

      lightbox.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';

      const tempImg = new Image();
      tempImg.onload = () => {
        lightboxImg.src = src;
        requestAnimationFrame(() => lightboxImg.classList.add('is-loaded'));
      };
      tempImg.src = src;
    }

    function closeLightbox() {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
      lightboxImg.src = '';
      lightboxImg.classList.remove('is-loaded');
    }

    // Open on click
    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => showLightbox(i));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showLightbox(i); }
      });
    });

    // Controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBack.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showLightbox(currentIndex - 1));
    lightboxNext.addEventListener('click', () => showLightbox(currentIndex + 1));

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (lightbox.hasAttribute('hidden')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  showLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
    });

    // Touch swipe
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) showLightbox(currentIndex + (delta < 0 ? 1 : -1));
    });

    // Register gallery items for cursor hover
    galleryItems.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursor)   cursor.classList.add('is-hover');
        if (follower) follower.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', () => {
        if (cursor)   cursor.classList.remove('is-hover');
        if (follower) follower.classList.remove('is-hover');
      });
    });
  }

})();
