// ============================================
// JET INSTITUTE — Modern Interactive JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initAccordions();
  initScrollToTop();
  initScrollAnimations();
  initActiveNav();
  initCounters();
  initTestimonialSlider();
  initSearchBar();
  initLangSwitch();
  initSidebarSpy();
});

// --- Sticky Header ---
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// --- Mobile Navigation ---
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.nav-overlay');

  if (!hamburger || !nav) return;

  const toggleNav = () => {
    nav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';

    const spans = hamburger.querySelectorAll('span');
    if (nav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  };

  hamburger.addEventListener('click', toggleNav);
  if (overlay) overlay.addEventListener('click', toggleNav);

  // Close nav on link click (mobile)
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('open')) toggleNav();
    });
  });
}

// --- Accordions ---
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const body = content.querySelector('.accordion-body');
      const isOpen = item.classList.contains('active');

      // Close other items in same accordion
      const accordion = item.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-item.active').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('active');
            openItem.querySelector('.accordion-content').style.maxHeight = '0';
          }
        });
      }

      // Toggle current
      item.classList.toggle('active');
      if (!isOpen) {
        content.style.maxHeight = body.scrollHeight + 40 + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });
}

// --- Scroll to Top ---
function initScrollToTop() {
  const scrollBtn = document.querySelector('.scroll-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Scroll Animations ---
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('[data-animate]');
  if (animateElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const animation = el.dataset.animate || 'fadeInUp';
        const delay = el.dataset.delay || '0';
        el.style.animationDelay = delay + 's';
        el.classList.add(`animate-${animation}`);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  animateElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// --- Active Nav Highlighting ---
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link:not(.cta)');

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentPath ||
        (currentPath === '' && href === 'index.html') ||
        (currentPath === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// --- Animated Counters ---
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);

          if (target >= 1000) {
            el.textContent = current.toLocaleString() + '+' + suffix;
          } else {
            el.textContent = current + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

// --- Testimonial Slider ---
function initTestimonialSlider() {
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || dots.length === 0) return;

  let currentSlide = 0;
  const totalSlides = dots.length;
  let autoplayInterval;

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(parseInt(dot.dataset.index));
      startAutoplay();
    });
  });

  startAutoplay();

  // Pause on hover
  const wrapper = track.closest('.testimonials-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
  }
}

// --- Smooth scroll for anchor links ---
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// --- Search Bar ---
function initSearchBar() {
  const toggle = document.querySelector('.search-toggle');
  const overlay = document.querySelector('.search-overlay');
  if (!toggle || !overlay) return;

  const closeBtn = overlay.querySelector('.search-close');
  const input = overlay.querySelector('input');

  toggle.addEventListener('click', () => {
    overlay.classList.add('active');
    setTimeout(() => input && input.focus(), 300);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }
  });
}

// --- Language Switch ---
function initLangSwitch() {
  const buttons = document.querySelectorAll('.lang-btn');
  if (buttons.length === 0) return;

  // Check saved language preference
  const savedLang = localStorage.getItem('jet-lang') || 'en';

  // Apply saved language on load
  if (savedLang !== 'en') {
    applyTranslations(savedLang);
    buttons.forEach(b => b.classList.remove('active'));
    buttons.forEach(b => {
      if (b.textContent.trim() === 'MN') b.classList.add('active');
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.textContent.trim() === 'MN' ? 'mn' : 'en';
      localStorage.setItem('jet-lang', lang);
      applyTranslations(lang);
    });
  });
}

function applyTranslations(lang) {
  if (typeof translations === 'undefined') return;

  // Translate all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] && translations[key][lang]) {
      el.innerHTML = translations[key][lang];
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key] && translations[key][lang]) {
      el.placeholder = translations[key][lang];
    }
  });

  // Update html lang attribute
  document.documentElement.lang = lang === 'mn' ? 'mn' : 'en';
}

// --- Sidebar Scroll Spy ---
function initSidebarSpy() {
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  if (sidebarLinks.length === 0) return;

  const sections = [];
  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ link, section });
    }
  });

  if (sections.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 150;
    let current = sections[0];

    sections.forEach(({ link, section }) => {
      if (section.offsetTop <= scrollPos) {
        current = { link, section };
      }
    });

    sidebarLinks.forEach(l => l.classList.remove('active'));
    current.link.classList.add('active');
  }, { passive: true });
}
