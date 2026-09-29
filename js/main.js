/* ============================================
   iFixServices — Main JavaScript
   Carousel, Navigation, WhatsApp Integration
   ============================================ */

// ─── WhatsApp Configuration ─────────────────
const WHATSAPP_NUMBER = '917891239456'; // +91 7891239456
const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// ─── DOM Ready ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroCarousel();
  initScrollAnimations();
  initScrollToTop();
  initContactForm();
  initServiceCardCTAs();
  initWhatsAppFloat();
  initWhatsAppInquiryModal();
  initFilterAccordions();
  initHomeServicesTabs();
  initQuickViewModal();
  initAddToCart();
  initNewsletterSubscription();
  initEditorialShop();
  initAdminPortalSync();
});

// ============================================
// NAVBAR — Scroll Effect
// ============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const announcementBar = document.querySelector('.announcement-bar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
      if (announcementBar) announcementBar.style.transform = 'translateY(-100%)';
    } else {
      navbar.classList.remove('scrolled');
      if (announcementBar) announcementBar.style.transform = 'translateY(0)';
    }
  };

  // Add smooth transition to announcement bar
  if (announcementBar) {
    announcementBar.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial state
}

// ============================================
// MOBILE MENU — Hamburger Toggle
// ============================================
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');
  if (!hamburger || !mobileMenu) return;

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.contains('active');
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    // Accessibility
    hamburger.setAttribute('aria-expanded', !isOpen);
    mobileMenu.setAttribute('aria-hidden', isOpen);
  };

  hamburger.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', toggleMenu);

  // Close on link click
  mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      toggleMenu();
    }
  });
}

// ============================================
// HERO CAROUSEL
// ============================================
function initHeroCarousel() {
  const carousel = document.querySelector('.hero');
  if (!carousel) return;

  const track = carousel.querySelector('.hero__track');
  const slides = carousel.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  const prevBtn = document.querySelector('.hero__arrow--prev');
  const nextBtn = document.querySelector('.hero__arrow--next');
  const pauseBtn = document.querySelector('.hero__pause');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayInterval = null;
  let isTransitioning = false;
  let isPaused = false;
  let touchStartX = 0;
  let touchEndX = 0;
  const AUTOPLAY_DELAY = 4500;

  // Go to slide
  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    isTransitioning = true;

    // Update slide classes
    slides[currentIndex].classList.remove('active');
    slides[index].classList.add('active');

    // Move track
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');

    currentIndex = index;

    // Reset animation lock
    setTimeout(() => {
      isTransitioning = false;
    }, 700);
  };

  const nextSlide = () => {
    const next = (currentIndex + 1) % slides.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prev);
  };

  // Auto-play
  const startAutoPlay = () => {
    stopAutoPlay();
    if (!isPaused) {
      autoPlayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  };

  const togglePlayPause = () => {
    isPaused = !isPaused;
    if (isPaused) {
      stopAutoPlay();
      if (pauseBtn) pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    } else {
      startAutoPlay();
      if (pauseBtn) pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 15V9M14 15V9"/></svg>';
    }
  };

  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
  if (pauseBtn) pauseBtn.addEventListener('click', togglePlayPause);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); startAutoPlay(); });
  });

  // Pause on hover (desktop)
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  // Touch/swipe support
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    startAutoPlay();
  }, { passive: true });

  // Initialize first slide
  slides[0].classList.add('active');
  if (dots[0]) dots[0].classList.add('active');
  startAutoPlay();
}

// ============================================
// SCROLL ANIMATIONS — Intersection Observer
// ============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .stagger-children');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// SCROLL TO TOP
// ============================================
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// WHATSAPP — Build Message & Redirect
// ============================================

/**
 * Opens WhatsApp with a pre-formatted message
 * @param {string} serviceName - The service name
 * @param {string} category - The service category (e.g., "MacBook", "iPhone")
 * @param {string} price - The price string (e.g., "₹4,999")
 */
function openWhatsApp(serviceName, category, price) {
  const message = `Hello iFixServices! 👋

I'm interested in the following service:

📱 *Category:* ${category}
🔧 *Service:* ${serviceName}
💰 *Listed Price:* ${price || 'Price on request'}

Please share more details and availability. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  const url = `${WHATSAPP_BASE_URL}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

/**
 * Opens WhatsApp with a custom inquiry message
 * @param {object} formData - Object with name, phone, device, issue
 */
function openWhatsAppInquiry(formData) {
  const message = `Hello iFixServices! 👋

New Repair Inquiry:

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📱 *Device:* ${formData.device}
🔧 *Issue:* ${formData.issue}

Please get back to me with a quote. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  const url = `${WHATSAPP_BASE_URL}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

/**
 * Opens WhatsApp with a general message
 */
function openWhatsAppGeneral() {
  const message = `Hello iFixServices! 👋

I'd like to inquire about your repair services. Please let me know how I can get help.

Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  const url = `${WHATSAPP_BASE_URL}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

// ============================================
// SERVICE CARD CTAs — Attach WhatsApp Redirect
// ============================================
function initServiceCardCTAs() {
  document.querySelectorAll('.service-card__cta, .service-card__cta--full').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.service-card');
      if (!card) return;

      const serviceName = card.querySelector('.service-card__title')?.textContent?.trim() || '';
      const category = card.dataset.category || document.querySelector('.page-hero__title')?.textContent?.trim() || 'General';
      const priceEl = card.querySelector('.service-card__price');
      const price = priceEl ? priceEl.childNodes[0]?.textContent?.trim() : 'Price on request';

      openWhatsApp(serviceName, category, price);
    });
  });

  // Book Now / Get Quote buttons in hero/nav
  document.querySelectorAll('[data-action="whatsapp-general"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsAppGeneral();
    });
  });
}

// ============================================
// CONTACT FORM — WhatsApp Redirect
// ============================================
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#form-name')?.value?.trim() || '';
    const phone = form.querySelector('#form-phone')?.value?.trim() || '';
    const device = form.querySelector('#form-device')?.value?.trim() || '';
    const issue = form.querySelector('#form-issue')?.value?.trim() || '';

    // Basic validation
    if (!name || !phone || !device || !issue) {
      highlightEmptyFields(form);
      return;
    }

    openWhatsAppInquiry({ name, phone, device, issue });

    // Show success feedback
    showFormSuccess(form);
  });
}

function highlightEmptyFields(form) {
  form.querySelectorAll('input, select, textarea').forEach(field => {
    if (field.required && !field.value.trim()) {
      field.style.borderColor = '#FF3B30';
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      }, { once: true });
    }
  });
}

function showFormSuccess(form) {
  const btn = form.querySelector('button[type="submit"]');
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Sent to WhatsApp!`;
    btn.style.background = '#34C759';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      form.reset();
    }, 3000);
  }
}

// ============================================
// WHATSAPP FLOATING BUTTON
// ============================================
function initWhatsAppFloat() {
  const floatBtn = document.querySelector('.whatsapp-float');
  if (!floatBtn) return;
}

// ============================================
// EDITORIAL SHOP / TECH REPAIRS CATALOG
// ============================================
let shopCartCount = 0;
let shopWishlistCount = 0;

function initEditorialShop() {
  const shopPage = document.querySelector('.shop-page');
  if (!shopPage) return;

  initModelFilterSelector();
  initShopFiltering();
  initShopSorting();
  initLayoutSwitcher();
  initWishlistToggle();
  initMobileFilterDrawer();
}

/* ═══════════════════════════════════════════════════
   1. FILTER ACCORDIONS (+ / − TOGGLE)
   ═══════════════════════════════════════════════════ */
function initFilterAccordions() {
  const accordions = document.querySelectorAll('.filter-accordion');
  accordions.forEach(acc => {
    const header = acc.querySelector('.filter-accordion__header');
    const icon = acc.querySelector('.filter-accordion__icon');
    if (!header) return;

    header.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = acc.classList.toggle('open');
      if (icon) icon.textContent = isOpen ? '−' : '+';
    });
  });
}

/* ═══════════════════════════════════════════════════
   2. MODEL-SPECIFIC REPAIR CATALOG DATABASE
   ═══════════════════════════════════════════════════ */
const modelCatalogDatabase = {
  // ─── MACBOOK MODELS ───
  'mb-pro-m3': {
    name: 'MacBook Pro 14"/16" (M3 / Pro / Max)',
    category: 'macbook',
    img: 'images/placeholder-macbook.svg',
    services: [
      { id: 'mb-m3-1', title: 'MacBook Pro M3 Liquid Retina XDR Screen Replacement', category: 'screen', material: 'm3 pro', price: 6999, origPrice: 9500, time: '1–2 Hours', warranty: '1-Year Warranty', badge: '120HZ XDR', tag: 'MACBOOK PRO M3 • 120HZ' },
      { id: 'mb-m3-2', title: 'MacBook Pro M3 100% Health High-Density OEM Battery', category: 'battery', material: 'm3 pro', price: 3499, origPrice: 4800, time: '1–2 Hours', warranty: '1-Year Warranty', badge: '100% HEALTH', tag: 'MACBOOK PRO M3 • OEM CELL' },
      { id: 'mb-m3-3', title: 'MacBook Pro M3 Motherboard & Power IC Chip Repair', category: 'logicboard', material: 'm3 pro', price: 4499, origPrice: 6500, time: '24–48 Hours', warranty: '180-Day Warranty', badge: 'CHIP-LEVEL', tag: 'MACBOOK PRO M3 • LOGIC' },
      { id: 'mb-m3-4', title: 'MacBook Pro M3 Magic Keyboard & Force Touch Trackpad', category: 'keyboard', material: 'm3 pro', price: 2999, origPrice: 4200, time: '2 Hours', warranty: '180-Day Warranty', badge: 'GENUINE', tag: 'MACBOOK PRO M3 • KEYBOARD' },
      { id: 'mb-m3-5', title: 'MacBook Pro M3 MagSafe 3 & Dual Thunderbolt 4 Ports', category: 'port', material: 'm3 pro', price: 1799, origPrice: 2600, time: '45 Mins', warranty: '180-Day Warranty', badge: '140W FAST PD', tag: 'MACBOOK PRO M3 • MAGSAFE 3' },
      { id: 'mb-m3-6', title: 'MacBook Pro M3 Ultrasonic Liquid De-Oxidation Recovery', category: 'water', material: 'm3 pro', price: 1999, origPrice: 3000, time: 'Same Day', warranty: 'Tested Clean', badge: 'ULTRASONIC', tag: 'MACBOOK PRO M3 • WATER DAMAGE' },
      { id: 'mb-m3-7', title: 'MacBook Pro M3 Dual Fan Cleaning & Liquid Metal Compound', category: 'diagnostic', material: 'm3 pro', price: 999, origPrice: 1500, time: '45 Mins', warranty: 'Cooling Guaranteed', badge: 'THERMAL PRO', tag: 'MACBOOK PRO M3 • FANS' },
      { id: 'mb-m3-8', title: 'MacBook Pro M3 Six-Speaker Spatial Sound System Fix', category: 'diagnostic', material: 'm3 pro', price: 1499, origPrice: 2200, time: '1 Hour', warranty: '180-Day Warranty', badge: 'SPATIAL AUDIO', tag: 'MACBOOK PRO M3 • AUDIO' },
      { id: 'mb-m3-9', title: 'MacBook Pro M3 36-Point Hardware Diagnostic Health Check', category: 'diagnostic', material: 'm3 pro', price: 499, origPrice: 999, time: '30 Mins', warranty: 'Full Report', badge: 'FREE W/ REPAIR', tag: 'MACBOOK PRO M3 • DIAGNOSTIC' }
    ]
  },
  'mb-pro-m2': {
    name: 'MacBook Pro 14"/16" (M2 Pro / Max)',
    category: 'macbook',
    img: 'images/placeholder-macbook.svg',
    services: [
      { id: 'mb-m2-1', title: 'MacBook Pro M2 Liquid Retina XDR Display Replacement', category: 'screen', material: 'm2 pro', price: 5999, origPrice: 8500, time: '1–2 Hours', warranty: '1-Year Warranty', badge: 'MOST POPULAR', tag: 'MACBOOK PRO M2 • 120HZ' },
      { id: 'mb-m2-2', title: 'MacBook Pro M2 High-Capacity OEM Battery Renewal', category: 'battery', material: 'm2 pro', price: 3199, origPrice: 4500, time: '1–2 Hours', warranty: '1-Year Warranty', badge: '100% HEALTH', tag: 'MACBOOK PRO M2 • OEM CELLS' },
      { id: 'mb-m2-3', title: 'MacBook Pro M2 Logic Board Chip-Level Micro-Soldering', category: 'logicboard', material: 'm2 pro', price: 3999, origPrice: 5800, time: '24–48 Hours', warranty: '180-Day Warranty', badge: 'CHIP-LEVEL', tag: 'MACBOOK PRO M2 • PMIC' },
      { id: 'mb-m2-4', title: 'MacBook Pro M2 Magic Keyboard & Force Touch Trackpad', category: 'keyboard', material: 'm2 pro', price: 2699, origPrice: 3800, time: '2 Hours', warranty: '180-Day Warranty', badge: 'GENUINE', tag: 'MACBOOK PRO M2 • KEYBOARD' },
      { id: 'mb-m2-5', title: 'MacBook Pro M2 MagSafe 3 & USB-C Power Sub-Board Fix', category: 'port', material: 'm2 pro', price: 1699, origPrice: 2400, time: '45 Mins', warranty: '180-Day Warranty', badge: 'FAST CHARGE', tag: 'MACBOOK PRO M2 • MAGSAFE' },
      { id: 'mb-m2-6', title: 'MacBook Pro M2 Water Spill De-Oxidation & Chemical Cleaning', category: 'water', material: 'm2 pro', price: 1899, origPrice: 2800, time: 'Same Day', warranty: 'Tested Clean', badge: '98% RECOVERY', tag: 'MACBOOK PRO M2 • DE-OXIDIZE' },
      { id: 'mb-m2-7', title: 'MacBook Pro M2 36-Point Hardware Diagnostic Health Check', category: 'diagnostic', material: 'm2 pro', price: 499, origPrice: 899, time: '30 Mins', warranty: 'Full Report', badge: 'FREE W/ REPAIR', tag: 'MACBOOK PRO M2 • DIAGNOSTIC' }
    ]
  },
  'mb-air-13-m1': {
    name: 'MacBook Air 13" (M1 2020)',
    category: 'macbook',
    img: 'images/placeholder-macbook.svg',
    services: [
      { id: 'mb-m1-1', title: 'MacBook Air M1 Retina Display Replacement (True Tone)', category: 'screen', material: 'm1 air', price: 4999, origPrice: 6999, time: '1–2 Hours', warranty: '1-Year Warranty', badge: 'MOST POPULAR', tag: 'MACBOOK AIR M1 • TRUE TONE' },
      { id: 'mb-m1-2', title: 'MacBook Air M1 100% Health Battery Renewal (18-Hr Backup)', category: 'battery', material: 'm1 air', price: 2799, origPrice: 3999, time: '1–2 Hours', warranty: '1-Year Warranty', badge: '18-HR BACKUP', tag: 'MACBOOK AIR M1 • GENUINE' },
      { id: 'mb-m1-3', title: 'MacBook Air M1 Motherboard Micro-Soldering & Power IC Fix', category: 'logicboard', material: 'm1 air', price: 3499, origPrice: 5200, time: '24–48 Hours', warranty: '180-Day Warranty', badge: 'CHIP-LEVEL', tag: 'MACBOOK AIR M1 • PMIC REPAIR' },
      { id: 'mb-m1-4', title: 'MacBook Air M1 Magic Keyboard & Force Touch Trackpad', category: 'keyboard', material: 'm1 air', price: 2199, origPrice: 3200, time: '1–2 Hours', warranty: '180-Day Warranty', badge: 'ORIGINAL KEY', tag: 'MACBOOK AIR M1 • KEYBOARD' },
      { id: 'mb-m1-5', title: 'MacBook Air M1 Dual Thunderbolt / USB-C Port Board', category: 'port', material: 'm1 air', price: 1499, origPrice: 2200, time: '45 Mins', warranty: '180-Day Warranty', badge: 'FAST CHARGE', tag: 'MACBOOK AIR M1 • USB-C' },
      { id: 'mb-m1-6', title: 'MacBook Air M1 Liquid Damage Ultrasonic Chemical Cleaning', category: 'water', material: 'm1 air', price: 1799, origPrice: 2800, time: 'Same Day', warranty: 'Tested Clean', badge: '98% RECOVERY', tag: 'MACBOOK AIR M1 • DE-OXIDATION' },
      { id: 'mb-m1-7', title: 'MacBook Air M1 Stereo Loudspeakers & Triple-Mic Array', category: 'diagnostic', material: 'm1 air', price: 1299, origPrice: 1999, time: '1 Hour', warranty: '180-Day Warranty', badge: 'STEREO OEM', tag: 'MACBOOK AIR M1 • AUDIO' },
      { id: 'mb-m1-8', title: 'MacBook Air M1 Full 36-Point Hardware Diagnostic Check', category: 'diagnostic', material: 'm1 air', price: 499, origPrice: 899, time: '30 Mins', warranty: 'Full Report', badge: 'FREE W/ REPAIR', tag: 'MACBOOK AIR M1 • DIAGNOSTIC' }
    ]
  },
  'mb-air-15-m3-m2': {
    name: 'MacBook Air 15" (M3 / M2)',
    category: 'macbook',
    img: 'images/placeholder-macbook.svg',
    services: [
      { id: 'mb-air15-1', title: 'MacBook Air 15" Liquid Retina Display Replacement', category: 'screen', material: 'air 15', price: 5499, origPrice: 7800, time: '1–2 Hours', warranty: '1-Year Warranty', badge: 'GENUINE RETINA', tag: 'MACBOOK AIR 15" • 500 NITS' },
      { id: 'mb-air15-2', title: 'MacBook Air 15" High-Capacity 66.5Wh OEM Battery', category: 'battery', material: 'air 15', price: 2999, origPrice: 4200, time: '1–2 Hours', warranty: '1-Year Warranty', badge: '100% HEALTH', tag: 'MACBOOK AIR 15" • 66.5WH' },
      { id: 'mb-air15-3', title: 'MacBook Air 15" Logic Board Power Management IC Fix', category: 'logicboard', material: 'air 15', price: 3799, origPrice: 5500, time: '24–48 Hours', warranty: '180-Day Warranty', badge: 'CHIP-LEVEL', tag: 'MACBOOK AIR 15" • LOGIC' },
      { id: 'mb-air15-4', title: 'MacBook Air 15" MagSafe 3 Port Sub-Board Repair', category: 'port', material: 'air 15', price: 1599, origPrice: 2300, time: '45 Mins', warranty: '180-Day Warranty', badge: 'MAGSAFE 3', tag: 'MACBOOK AIR 15" • MAGSAFE' },
      { id: 'mb-air15-5', title: 'MacBook Air 15" Six-Speaker Sound System Renewal', category: 'diagnostic', material: 'air 15', price: 1499, origPrice: 2100, time: '1 Hour', warranty: '180-Day Warranty', badge: 'SPATIAL AUDIO', tag: 'MACBOOK AIR 15" • AUDIO' }
    ]
  },
  'mb-pro-intel-16-15': {
    name: 'MacBook Pro 16"/15" Intel Core i7/i9',
    category: 'macbook',
    img: 'images/placeholder-macbook.svg',
    services: [
      { id: 'mb-intel-1', title: 'MacBook Pro Intel Retina Display & True Tone Assembly', category: 'screen', material: 'intel pro', price: 4499, origPrice: 6500, time: '1–2 Hours', warranty: '1-Year Warranty', badge: 'RETINA OEM', tag: 'MACBOOK INTEL • RETINA' },
      { id: 'mb-intel-2', title: 'MacBook Pro Intel 100Wh High-Capacity Battery Renewal', category: 'battery', material: 'intel pro', price: 2899, origPrice: 4200, time: '1–2 Hours', warranty: '1-Year Warranty', badge: '100% HEALTH', tag: 'MACBOOK INTEL • 100WH' },
      { id: 'mb-intel-3', title: 'MacBook Pro Intel AMD GPU & Logic Board Repair', category: 'logicboard', material: 'intel pro', price: 3699, origPrice: 5500, time: '24–48 Hours', warranty: '180-Day Warranty', badge: 'GPU REBALL', tag: 'MACBOOK INTEL • GPU' },
      { id: 'mb-intel-4', title: 'MacBook Pro Intel Thermal Paste & Dual Fan Cleaning', category: 'diagnostic', material: 'intel pro', price: 799, origPrice: 1200, time: '45 Mins', warranty: 'Cooling Guaranteed', badge: 'THERMAL PRO', tag: 'MACBOOK INTEL • THERMAL' }
    ]
  },

  // ─── IPHONE MODELS ───
  'ip-15-pro-max': {
    name: 'iPhone 15 Pro Max & 15 Pro',
    category: 'iphone',
    img: 'images/placeholder-iphone.svg',
    services: [
      { id: 'ip15-1', title: 'iPhone 15 Pro Super Retina XDR OLED Display (120Hz)', category: 'screen', material: 'ip15', price: 3499, origPrice: 5200, time: '30 Mins', warranty: '1-Year Warranty', badge: '120HZ PROMOTION', tag: 'IPHONE 15 PRO • DYNAMIC ISLAND' },
      { id: 'ip15-2', title: 'iPhone 15 Pro Zero-Cycle Genuine Battery Replacement', category: 'battery', material: 'ip15', price: 1599, origPrice: 2400, time: '30 Mins', warranty: '180-Day Warranty', badge: '100% HEALTH', tag: 'IPHONE 15 PRO • ZERO CYCLE' },
      { id: 'ip15-3', title: 'iPhone 15 Pro Back Glass Laser Separation & Renewal', category: 'back-glass', material: 'ip15', price: 2199, origPrice: 3400, time: '1–2 Hours', warranty: 'Color Matched', badge: 'LASER ACCURACY', tag: 'IPHONE 15 PRO • TITANIUM FIT' },
      { id: 'ip15-4', title: 'iPhone 15 Pro USB-C Fast-Charging Port Sub-Board Fix', category: 'port', material: 'ip15', price: 1299, origPrice: 1999, time: '30 Mins', warranty: '180-Day Warranty', badge: 'TYPE-C 10GBPS', tag: 'IPHONE 15 PRO • USB-C' },
      { id: 'ip15-5', title: 'iPhone 15 Pro 48MP Main & 5x Telephoto Camera Sensor', category: 'camera', material: 'ip15', price: 2499, origPrice: 3800, time: '1 Hour', warranty: '180-Day Warranty', badge: '48MP PRO OEM', tag: 'IPHONE 15 PRO • OIS CAMERA' },
      { id: 'ip15-6', title: 'iPhone 15 Pro Logic Board Face ID & Power IC Repair', category: 'logicboard', material: 'ip15', price: 2999, origPrice: 4500, time: '24 Hours', warranty: '180-Day Warranty', badge: 'CHIP-LEVEL', tag: 'IPHONE 15 PRO • A17 PMIC' },
      { id: 'ip15-7', title: 'iPhone 15 Pro Ultrasonic Liquid Damage Chemical Recovery', category: 'water', material: 'ip15', price: 1499, origPrice: 2200, time: 'Same Day', warranty: 'Tested Clean', badge: 'ULTRASONIC', tag: 'IPHONE 15 PRO • WATER DAMAGE' }
    ]
  },
  'ip-14-pro-max': {
    name: 'iPhone 14 Pro Max & 14 Pro',
    category: 'iphone',
    img: 'images/placeholder-iphone.svg',
    services: [
      { id: 'ip14-1', title: 'iPhone 14 Pro OLED Display & Dynamic Island Screen', category: 'screen', material: 'ip14', price: 2999, origPrice: 4500, time: '30 Mins', warranty: '1-Year Warranty', badge: 'SUPER RETINA', tag: 'IPHONE 14 PRO • 120HZ' },
      { id: 'ip14-2', title: 'iPhone 14 Pro 100% Health Battery Replacement', category: 'battery', material: 'ip14', price: 1499, origPrice: 2200, time: '30 Mins', warranty: '180-Day Warranty', badge: '100% HEALTH', tag: 'IPHONE 14 PRO • GENUINE CELL' },
      { id: 'ip14-3', title: 'iPhone 14 Pro Back Glass Laser Frame Renewal', category: 'back-glass', material: 'ip14', price: 1999, origPrice: 3000, time: '1–2 Hours', warranty: 'Color Matched', badge: 'LASER SEPARATION', tag: 'IPHONE 14 PRO • BACK GLASS' },
      { id: 'ip14-4', title: 'iPhone 14 Pro Lightning Fast-Charging Port Board', category: 'port', material: 'ip14', price: 1199, origPrice: 1799, time: '30 Mins', warranty: '180-Day Warranty', badge: 'FAST CHARGE', tag: 'IPHONE 14 PRO • LIGHTNING' },
      { id: 'ip14-5', title: 'iPhone 14 Pro 48MP Triple Lens Camera Module Repair', category: 'camera', material: 'ip14', price: 2199, origPrice: 3400, time: '1 Hour', warranty: '180-Day Warranty', badge: '48MP OEM', tag: 'IPHONE 14 PRO • CAMERA' }
    ]
  },
  'ip-13-pro-max': {
    name: 'iPhone 13 Pro Max & 13 Pro',
    category: 'iphone',
    img: 'images/placeholder-iphone.svg',
    services: [
      { id: 'ip13-1', title: 'iPhone 13 Pro Super Retina OLED Screen Replacement', category: 'screen', material: 'ip13', price: 2799, origPrice: 4200, time: '30 Mins', warranty: '1-Year Warranty', badge: '120HZ PRO', tag: 'IPHONE 13 PRO • TRUE TONE' },
      { id: 'ip13-2', title: 'iPhone 13 Pro High-Capacity Battery Renewal', category: 'battery', material: 'ip13', price: 1399, origPrice: 2000, time: '30 Mins', warranty: '180-Day Warranty', badge: 'ZERO CYCLE', tag: 'IPHONE 13 PRO • OEM CELL' },
      { id: 'ip13-3', title: 'iPhone 13 Pro Back Glass Laser Frame Renewal', category: 'back-glass', material: 'ip13', price: 1799, origPrice: 2700, time: '1–2 Hours', warranty: 'OEM Finish', badge: 'LASER ACCURACY', tag: 'IPHONE 13 PRO • GLASS' },
      { id: 'ip13-4', title: 'iPhone 13 Pro Face ID & TrueDepth Sensor Repair', category: 'logicboard', material: 'ip13', price: 2499, origPrice: 3800, time: '24 Hours', warranty: '180-Day Warranty', badge: 'FACE ID RESTORE', tag: 'IPHONE 13 PRO • TRUEDEPTH' }
    ]
  },

  // ─── CCTV SYSTEMS ───
  'cctv-4k-dome': {
    name: '4K Ultra HD Dome IP Camera System',
    category: 'camera',
    img: 'images/placeholder-cctv.svg',
    services: [
      { id: 'cctv-d1', title: '4K Ultra HD Dome Camera Lens & IR Night Sensor Fix', category: 'camera', material: 'camera 4k dome', price: 2499, origPrice: 3499, time: '1–2 Hours', warranty: '2-Year Warranty', badge: '4K SONY SENSOR', tag: 'CCTV • 4K ULTRA HD' },
      { id: 'cctv-d2', title: 'PoE Power Supply & Cat6 Gigabit Sub-Board Repair', category: 'camera', material: 'camera poe', price: 1299, origPrice: 1899, time: '45 Mins', warranty: '1-Year Warranty', badge: 'POE 48V', tag: 'CCTV • POE SUB-BOARD' },
      { id: 'cctv-d3', title: 'Complete 4K Dome Camera Installation & Focus Alignment', category: 'camera', material: 'camera setup', price: 1499, origPrice: 2200, time: 'Same Day', warranty: 'Free Support', badge: 'ON-SITE SETUP', tag: 'CCTV • PROFESSIONAL FIT' },
      { id: 'cctv-d4', title: 'Weatherproof IP67 Metal Housing & Mounting Bracket', category: 'camera', material: 'camera ip67', price: 899, origPrice: 1400, time: '30 Mins', warranty: 'IP67 Sealed', badge: 'VANDAL-PROOF', tag: 'CCTV • IP67 HOUSING' }
    ]
  },
  'cctv-home-pkg': {
    name: '4-Camera Complete Home Security Package',
    category: 'camera',
    img: 'images/placeholder-cctv.svg',
    services: [
      { id: 'cctv-hp1', title: 'Complete 4-Camera 4K Home Setup + 1TB Surveillance HDD', category: 'camera', material: 'camera bundle', price: 8999, origPrice: 12500, time: 'Same Day', warranty: '2-Year Warranty', badge: 'TOP RATED HOME', tag: 'CCTV • 4-CAMERA BUNDLE' },
      { id: 'cctv-hp2', title: '4-Channel PoE 4K NVR System With Remote Mobile View', category: 'camera', material: 'camera nvr', price: 3999, origPrice: 5500, time: '2 Hours', warranty: '2-Year Warranty', badge: 'SMART APP READY', tag: 'CCTV • 4CH POE NVR' },
      { id: 'cctv-hp3', title: 'Annual Security AMC Maintenance & Inspection Plan', category: 'camera', material: 'camera amc', price: 1999, origPrice: 3000, time: 'Annual', warranty: 'Priority Visits', badge: '24/7 HELPLINE', tag: 'CCTV • AMC MAINTENANCE' }
    ]
  },

  // ─── APPLE WATCH MODELS ───
  'watch-ultra-2': {
    name: 'Apple Watch Ultra 2 & Ultra 1 (49mm)',
    category: 'apple-watch',
    img: 'images/placeholder-watch.svg',
    services: [
      { id: 'wat-u1', title: 'Apple Watch Ultra 2 OLED Display & Sapphire Glass', category: 'screen', material: 'ultra sapphire', price: 2999, origPrice: 4500, time: '45 Mins', warranty: '1-Year Warranty', badge: 'SAPPHIRE OEM', tag: 'APPLE WATCH ULTRA • 3000 NITS' },
      { id: 'wat-u2', title: 'Apple Watch Ultra 2 High-Density Extended Battery Renewal', category: 'battery', material: 'ultra battery', price: 1799, origPrice: 2600, time: '45 Mins', warranty: '180-Day Warranty', badge: '100% HEALTH', tag: 'APPLE WATCH ULTRA • 542MAH' },
      { id: 'wat-u3', title: 'Apple Watch Ultra 2 IP6X 100M Water-Resistant Resealing', category: 'water', material: 'ultra waterproof', price: 1299, origPrice: 1900, time: '30 Mins', warranty: 'Pressure Tested', badge: '100M WR', tag: 'APPLE WATCH ULTRA • IP6X SEAL' },
      { id: 'wat-u4', title: 'Apple Watch Ultra 2 Optical Heart Rate, ECG & SpO2 Sensor Fix', category: 'diagnostic', material: 'ultra sensor', price: 1599, origPrice: 2300, time: '1 Hour', warranty: '180-Day Warranty', badge: 'ECG PRECISION', tag: 'APPLE WATCH ULTRA • ECG' },
      { id: 'wat-u5', title: 'Apple Watch Ultra 2 Digital Crown & Action Button Haptics', category: 'diagnostic', material: 'ultra crown', price: 1199, origPrice: 1700, time: '45 Mins', warranty: '180-Day Warranty', badge: 'TAPTIC OEM', tag: 'APPLE WATCH ULTRA • HAPTICS' }
    ]
  },
  'watch-s9-s8': {
    name: 'Apple Watch Series 9 & 8 (45mm / 41mm)',
    category: 'apple-watch',
    img: 'images/placeholder-watch.svg',
    services: [
      { id: 'wat-s9-1', title: 'Apple Watch Series 9/8 OLED Display Replacement (Always-On)', category: 'screen', material: 'series9 series8', price: 2199, origPrice: 3400, time: '45 Mins', warranty: '1-Year Warranty', badge: 'MOST POPULAR', tag: 'APPLE WATCH S9 • ALWAYS-ON' },
      { id: 'wat-s9-2', title: 'Apple Watch Series 9/8 100% Health OEM Battery Renewal', category: 'battery', material: 'series9 series8', price: 1499, origPrice: 2200, time: '45 Mins', warranty: '180-Day Warranty', badge: 'ZERO CYCLE', tag: 'APPLE WATCH S9 • GENUINE CELL' },
      { id: 'wat-s9-3', title: 'Apple Watch Series 9/8 Waterproof IP6X Gasket Re-Sealing', category: 'water', material: 'series9 waterproof', price: 999, origPrice: 1500, time: '30 Mins', warranty: '50M WR Tested', badge: 'SWIM-PROOF', tag: 'APPLE WATCH S9 • 50M SEAL' },
      { id: 'wat-s9-4', title: 'Apple Watch Series 9/8 Rear Ceramic Sapphire Sensor Repair', category: 'diagnostic', material: 'series9 sensor', price: 1399, origPrice: 2000, time: '1 Hour', warranty: '180-Day Warranty', badge: 'OPTICAL SENSOR', tag: 'APPLE WATCH S9 • BIO SENSOR' }
    ]
  }
};

/* Helper: Build generic model services if not explicitly in database */
function generateGenericModelServices(modelKey, modelLabel) {
  const isMac = modelLabel.toLowerCase().includes('macbook');
  const isPhone = modelLabel.toLowerCase().includes('iphone');
  const isWatch = modelLabel.toLowerCase().includes('watch');
  const isCctv = modelLabel.toLowerCase().includes('camera') || modelLabel.toLowerCase().includes('cctv');

  if (isMac) {
    return [
      { id: `${modelKey}-1`, title: `${modelLabel} Retina Display Replacement`, category: 'screen', material: 'macbook', price: 4999, origPrice: 7200, time: '1–2 Hours', warranty: '1-Year Warranty', badge: 'GENUINE OEM', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-2`, title: `${modelLabel} 100% Health Battery Renewal`, category: 'battery', material: 'macbook', price: 2799, origPrice: 3999, time: '1–2 Hours', warranty: '1-Year Warranty', badge: '100% HEALTH', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-3`, title: `${modelLabel} Logic Board Micro-Soldering & IC Repair`, category: 'logicboard', material: 'macbook', price: 3499, origPrice: 5200, time: '24–48 Hours', warranty: '180-Day Warranty', badge: 'CHIP-LEVEL', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-4`, title: `${modelLabel} Keyboard & Force Touch Trackpad Fix`, category: 'keyboard', material: 'macbook', price: 2199, origPrice: 3200, time: '1–2 Hours', warranty: '180-Day Warranty', badge: 'OEM SCISSOR', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-5`, title: `${modelLabel} MagSafe / USB-C Power Port Sub-Board`, category: 'port', material: 'macbook', price: 1499, origPrice: 2200, time: '45 Mins', warranty: '180-Day Warranty', badge: 'FAST CHARGE', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-6`, title: `${modelLabel} Liquid Damage Ultrasonic Cleaning`, category: 'water', material: 'macbook', price: 1799, origPrice: 2800, time: 'Same Day', warranty: 'Tested Clean', badge: 'DE-OXIDIZE', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-7`, title: `${modelLabel} Full 36-Point Hardware Diagnostic Health Check`, category: 'diagnostic', material: 'macbook', price: 499, origPrice: 899, time: '30 Mins', warranty: 'Full Report', badge: 'FREE W/ REPAIR', tag: `${modelLabel.toUpperCase()}` }
    ];
  }

  if (isPhone) {
    return [
      { id: `${modelKey}-1`, title: `${modelLabel} Super Retina OLED Screen Replacement`, category: 'screen', material: 'iphone', price: 2999, origPrice: 4500, time: '30 Mins', warranty: '1-Year Warranty', badge: 'SUPER RETINA', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-2`, title: `${modelLabel} Zero-Cycle Genuine Battery Replacement`, category: 'battery', material: 'iphone', price: 1499, origPrice: 2200, time: '30 Mins', warranty: '180-Day Warranty', badge: '100% HEALTH', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-3`, title: `${modelLabel} Back Glass Laser Replacement`, category: 'back-glass', material: 'iphone', price: 1899, origPrice: 2800, time: '1–2 Hours', warranty: 'Color Matched', badge: 'LASER FIT', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-4`, title: `${modelLabel} Charging Port Board & Microphone Fix`, category: 'port', material: 'iphone', price: 1199, origPrice: 1799, time: '30 Mins', warranty: '180-Day Warranty', badge: 'FAST CHARGE', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-5`, title: `${modelLabel} Main & Ultra-Wide Camera Sensor Fix`, category: 'camera', material: 'iphone', price: 2199, origPrice: 3400, time: '1 Hour', warranty: '180-Day Warranty', badge: 'OEM SENSOR', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-6`, title: `${modelLabel} Ultrasonic Liquid De-Oxidation Recovery`, category: 'water', material: 'iphone', price: 1499, origPrice: 2200, time: 'Same Day', warranty: 'Tested Clean', badge: 'ULTRASONIC', tag: `${modelLabel.toUpperCase()}` }
    ];
  }

  if (isWatch) {
    return [
      { id: `${modelKey}-1`, title: `${modelLabel} OLED Display & Glass Replacement`, category: 'screen', material: 'watch', price: 2199, origPrice: 3400, time: '45 Mins', warranty: '1-Year Warranty', badge: 'OLED RETINA', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-2`, title: `${modelLabel} 100% Health OEM Battery Renewal`, category: 'battery', material: 'watch', price: 1499, origPrice: 2200, time: '45 Mins', warranty: '180-Day Warranty', badge: 'ZERO CYCLE', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-3`, title: `${modelLabel} Waterproof IP6X Gasket Re-Sealing`, category: 'water', material: 'watch', price: 999, origPrice: 1500, time: '30 Mins', warranty: '50M WR Tested', badge: 'WATERPROOF', tag: `${modelLabel.toUpperCase()}` },
      { id: `${modelKey}-4`, title: `${modelLabel} Optical Heart Rate & Sensor Sub-Board`, category: 'diagnostic', material: 'watch', price: 1399, origPrice: 2000, time: '1 Hour', warranty: '180-Day Warranty', badge: 'BIO SENSOR', tag: `${modelLabel.toUpperCase()}` }
    ];
  }

  // Default CCTV
  return [
    { id: `${modelKey}-1`, title: `${modelLabel} Sensor & Lens Repair`, category: 'camera', material: 'camera', price: 2199, origPrice: 3200, time: '1–2 Hours', warranty: '2-Year Warranty', badge: 'OEM HARDWARE', tag: `${modelLabel.toUpperCase()}` },
    { id: `${modelKey}-2`, title: `${modelLabel} On-site Installation & Network Setup`, category: 'camera', material: 'camera', price: 1499, origPrice: 2200, time: 'Same Day', warranty: 'Free Support', badge: 'ON-SITE SETUP', tag: `${modelLabel.toUpperCase()}` },
    { id: `${modelKey}-3`, title: `${modelLabel} Annual AMC Maintenance Package`, category: 'camera', material: 'camera', price: 1999, origPrice: 3000, time: 'Annual', warranty: 'Priority Service', badge: '24/7 HELPLINE', tag: `${modelLabel.toUpperCase()}` }
  ];
}

/* ═══════════════════════════════════════════════════
   3. MODEL FILTER SELECTOR ENGINE
   ═══════════════════════════════════════════════════ */
let originalProductGridHTML = null;

function initModelFilterSelector() {
  const modelSelect = document.getElementById('model-filter-select');
  const productGrid = document.getElementById('product-grid');
  const banner = document.getElementById('model-banner-indicator');
  const bannerName = document.getElementById('model-banner-name');
  const bannerReset = document.getElementById('model-banner-reset');

  if (!productGrid) return;

  // Cache initial grid HTML for restoration
  if (!originalProductGridHTML) {
    originalProductGridHTML = productGrid.innerHTML;
  }

  if (modelSelect) {
    modelSelect.addEventListener('change', () => {
      const selectedVal = modelSelect.value.trim();
      const selectedOption = modelSelect.options[modelSelect.selectedIndex];
      const modelLabel = selectedOption ? selectedOption.textContent.trim() : 'Selected Model';

      if (selectedVal === 'all') {
        resetToAllModels();
      } else {
        applySpecificModel(selectedVal, modelLabel);
      }
    });
  }

  if (bannerReset) {
    bannerReset.addEventListener('click', (e) => {
      e.preventDefault();
      if (modelSelect) modelSelect.value = 'all';
      resetToAllModels();
    });
  }

  function resetToAllModels() {
    if (originalProductGridHTML) {
      productGrid.innerHTML = originalProductGridHTML;
    }
    if (banner) banner.classList.remove('active');
    
    // Re-bind click handlers on restored DOM
    initWishlistToggle();
    initAddToCart();
    initQuickViewModal();
    initShopFiltering();
    
    showShopToast('All Models Restored', 'Displaying all hardware repair solutions across all device models.');
  }

  function applySpecificModel(modelKey, modelLabel) {
    let entry = modelCatalogDatabase[modelKey];
    let services = entry ? entry.services : generateGenericModelServices(modelKey, modelLabel);
    
    let defaultImg = 'images/placeholder-macbook.png';
    if (entry && entry.img) {
      defaultImg = entry.img;
    } else {
      const lower = modelLabel.toLowerCase();
      if (lower.includes('iphone')) defaultImg = 'images/placeholder-iphone.png';
      else if (lower.includes('watch')) defaultImg = 'images/placeholder-watch.png';
      else if (lower.includes('cctv') || lower.includes('camera')) defaultImg = 'images/placeholder-cctv.png';
      else if (lower.includes('macbook')) defaultImg = 'images/placeholder-macbook.png';
      else defaultImg = 'images/service-placeholder.png';
    }

    // Update banner indicator
    if (banner) {
      banner.classList.add('active');
      if (bannerName) bannerName.textContent = modelLabel;
    }

    // Build custom HTML cards for this model
    let newHTML = '';
    services.forEach(srv => {
      newHTML += `
        <article class="editorial-card" data-category="${srv.category}" data-material="${srv.material || ''}" data-price="${srv.price}" data-rating="4.9">
          <div class="editorial-card__image-container">
            <span class="editorial-card__badge">${srv.badge || 'GENUINE OEM'}</span>
            <button class="editorial-card__wishlist" aria-label="Save Service" data-product-id="${srv.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            <a href="#service" class="editorial-card__link">
              <img src="${srv.img || defaultImg}" alt="${srv.title}" class="editorial-card__img" loading="lazy">
            </a>
            <div class="editorial-card__actions">
              <button class="editorial-card__action-btn quick-view-btn" data-id="${srv.id}" data-name="${srv.title}" data-price="₹${srv.price.toLocaleString()}" data-img="${srv.img || defaultImg}" title="Quick View" aria-label="Quick View">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
              <button class="editorial-card__action-btn add-to-cart-btn" data-id="${srv.id}" data-name="${srv.title}" data-price="₹${srv.price.toLocaleString()}" data-img="${srv.img || defaultImg}" title="Book Repair" aria-label="Book Repair">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </button>
            </div>
          </div>
          <div class="editorial-card__body">
            <span class="editorial-card__meta-tag">${srv.tag || 'CERTIFIED HARDWARE REPAIR'}</span>
            <h3 class="editorial-card__title"><a href="#service">${srv.title}</a></h3>
            <div class="editorial-card__price-row">
              <span class="editorial-card__price-current">₹${srv.price.toLocaleString()}</span>
              ${srv.origPrice ? `<span class="editorial-card__price-original">₹${srv.origPrice.toLocaleString()}</span>` : ''}
            </div>
            <div class="editorial-card__size-pills">
              <span class="size-pill">${srv.time || '1–2 Hours'}</span>
              <span class="size-pill active">${srv.warranty || '1-Year Warranty'}</span>
            </div>
          </div>
        </article>
      `;
    });

    productGrid.innerHTML = newHTML;

    // Re-bind event handlers
    initWishlistToggle();
    initAddToCart();
    initQuickViewModal();
    initShopFiltering();

    showShopToast(`Model Loaded: ${modelLabel}`, `Showing ${services.length} customized repair services and exact pricing.`);
  }
}

/* ═══════════════════════════════════════════════════
   4. 100% REAL-TIME FILTERING ENGINE
   ═══════════════════════════════════════════════════ */
function initShopFiltering() {
  const productGrid = document.getElementById('product-grid');
  const countElem = document.getElementById('product-count');
  if (!productGrid) return;

  const cards = Array.from(productGrid.querySelectorAll('.editorial-card'));
  const categoryItems = document.querySelectorAll('.category-nav-item');
  const checkboxes = document.querySelectorAll('.shop-sidebar input[type="checkbox"]');
  const sizeChips = document.querySelectorAll('.size-chip');
  const priceSlider = document.getElementById('filter-price-slider');
  const priceValueLabel = document.getElementById('price-slider-value');
  const applyPriceBtn = document.getElementById('apply-price-filter');
  const resetBtn = document.getElementById('clear-all-filters');

  let activeCategory = 'all';

  // Category navigation click
  categoryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      categoryItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      activeCategory = (item.dataset.category || 'all').toLowerCase();
      runFilter();
    });
  });

  // Checkbox state change (models / series / warranty)
  checkboxes.forEach(input => {
    input.addEventListener('change', runFilter);
  });

  // Turnaround / Speed chips click
  sizeChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      chip.classList.toggle('active');
      runFilter();
    });
  });

  // Price slider live update & filter
  if (priceSlider && priceValueLabel) {
    const minVal = priceSlider.min || '499';
    
    priceSlider.addEventListener('input', () => {
      const currentVal = parseInt(priceSlider.value, 10);
      priceValueLabel.textContent = `₹${parseInt(minVal, 10).toLocaleString()} — ₹${currentVal.toLocaleString()}`;
      runFilter();
    });

    priceSlider.addEventListener('change', runFilter);
    if (applyPriceBtn) {
      applyPriceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        runFilter();
      });
    }
  }

  // Reset All Filters
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Reset model selector
      const modelSelect = document.getElementById('model-filter-select');
      if (modelSelect) {
        modelSelect.value = 'all';
        modelSelect.dispatchEvent(new Event('change'));
      }

      // Reset categories
      categoryItems.forEach(i => i.classList.remove('active'));
      const firstCat = document.querySelector('.category-nav-item[data-category="all"]');
      if (firstCat) firstCat.classList.add('active');
      activeCategory = 'all';

      // Reset checkboxes
      checkboxes.forEach(i => i.checked = false);

      // Reset speed chips
      sizeChips.forEach(c => c.classList.remove('active'));

      // Reset price slider
      if (priceSlider) {
        priceSlider.value = priceSlider.max || 15000;
        if (priceValueLabel) {
          const minVal = priceSlider.min || '499';
          const maxVal = priceSlider.max || '15000';
          priceValueLabel.textContent = `₹${parseInt(minVal, 10).toLocaleString()} — ₹${parseInt(maxVal, 10).toLocaleString()}`;
        }
      }

      runFilter();
      showShopToast('Filters Reset', 'Displaying all available repair services.');
    });
  }

  function runFilter() {
    const selectedBoxes = Array.from(document.querySelectorAll('.shop-sidebar input[type="checkbox"]:checked')).map(i => i.value.toLowerCase().trim());
    const activeChipValues = Array.from(document.querySelectorAll('.size-chip.active')).map(c => (c.dataset.size || c.textContent).toLowerCase().trim());
    const maxPrice = priceSlider ? parseFloat(priceSlider.value) : Infinity;

    let visibleCount = 0;

    cards.forEach(card => {
      const cardCategory = (card.dataset.category || '').toLowerCase();
      const cardMaterial = (card.dataset.material || '').toLowerCase();
      const cardPrice = parseFloat(card.dataset.price || '0');
      const cardText = card.textContent.toLowerCase();

      // 1. Category Matching
      let matchesCategory = (activeCategory === 'all') || 
                            (cardCategory.includes(activeCategory)) ||
                            (activeCategory === 'screen' && (cardCategory.includes('screen') || cardText.includes('screen') || cardText.includes('display'))) ||
                            (activeCategory === 'battery' && (cardCategory.includes('battery') || cardText.includes('battery'))) ||
                            (activeCategory === 'logicboard' && (cardCategory.includes('logic') || cardText.includes('motherboard') || cardText.includes('chip'))) ||
                            (activeCategory === 'camera' && (cardCategory.includes('cam') || cardText.includes('camera'))) ||
                            (activeCategory === 'port' && (cardCategory.includes('port') || cardText.includes('charging') || cardText.includes('magsafe'))) ||
                            (activeCategory === 'water' && (cardCategory.includes('water') || cardText.includes('liquid')));

      // 2. Checkbox Matching (Models / Specs)
      let matchesBoxes = selectedBoxes.length === 0;
      if (!matchesBoxes) {
        matchesBoxes = selectedBoxes.some(val => cardMaterial.includes(val) || cardText.includes(val));
      }

      // 3. Speed / Turnaround Chips Matching
      let matchesChips = activeChipValues.length === 0;
      if (!matchesChips) {
        matchesChips = activeChipValues.some(chipVal => cardText.includes(chipVal));
      }

      // 4. Price Slider Matching
      let matchesPrice = cardPrice <= maxPrice;

      if (matchesCategory && matchesBoxes && matchesChips && matchesPrice) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countElem) {
      countElem.textContent = visibleCount;
    }
    if (applyPriceBtn) {
      applyPriceBtn.textContent = `VIEW SERVICES (${visibleCount})`;
    }
  }

  // Run once initially
  runFilter();
}

/* ═══════════════════════════════════════════════════
   5. SORTING FUNCTIONALITY
   ═══════════════════════════════════════════════════ */
function initShopSorting() {
  const sortSelect = document.getElementById('sort-select');
  const productGrid = document.getElementById('product-grid');
  if (!sortSelect || !productGrid) return;

  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;
    const cards = Array.from(productGrid.querySelectorAll('.editorial-card'));

    cards.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price || '0');
      const priceB = parseFloat(b.dataset.price || '0');
      const ratingA = parseFloat(a.dataset.rating || '0');
      const ratingB = parseFloat(b.dataset.rating || '0');

      if (val === 'price-asc') return priceA - priceB;
      if (val === 'price-desc') return priceB - priceA;
      if (val === 'rating') return ratingB - ratingA;
      return 0; // featured
    });

    cards.forEach(card => productGrid.appendChild(card));
  });
}

/* ═══════════════════════════════════════════════════
   6. LAYOUT SWITCHER (4-COL / 2-COL)
   ═══════════════════════════════════════════════════ */
function initLayoutSwitcher() {
  const btns = document.querySelectorAll('.shop-toolbar__layout-btn');
  const productGrid = document.getElementById('product-grid');
  if (!productGrid || btns.length === 0) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const gridCols = btn.dataset.grid;
      if (gridCols === '2') {
        productGrid.classList.add('grid-2');
      } else {
        productGrid.classList.remove('grid-2');
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   5. WISHLIST TOGGLE
   ═══════════════════════════════════════════════════ */
function initWishlistToggle() {
  const wishlistBtns = document.querySelectorAll('.editorial-card__wishlist');
  const badge = document.getElementById('wishlist-count');

  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = btn.classList.toggle('active');
      shopWishlistCount += isActive ? 1 : -1;
      if (shopWishlistCount < 0) shopWishlistCount = 0;
      if (badge) badge.textContent = shopWishlistCount;

      showShopToast(
        isActive ? 'Saved to Favorites' : 'Removed from Favorites',
        isActive ? 'Service bookmarked for quick access.' : 'Item removed from your favorites.'
      );
    });
  });
}

/* ═══════════════════════════════════════════════════
   6. ADD TO CART / DIRECT INQUIRY TRIGGERS
   ═══════════════════════════════════════════════════ */
function initAddToCart() {
  const addBtns = document.querySelectorAll('.add-to-cart-btn');
  const badge = document.getElementById('cart-count');

  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const card = btn.closest('.editorial-card') || btn.closest('.service-card');
      const name = btn.dataset.name || card?.querySelector('.editorial-card__title a')?.textContent || 'Repair Service';
      const price = btn.dataset.price || card?.querySelector('.editorial-card__price-current')?.textContent || '';

      // Open the WhatsApp Inquiry Modal automatically with pre-filled details!
      openWhatsAppInquiryModal({
        serviceName: name,
        price: price,
        card: card
      });
    });
  });
}

function showShopToast(title, desc) {
  const toast = document.getElementById('toast-notification');
  const titleEl = document.getElementById('toast-title');
  const descEl = document.getElementById('toast-desc');
  if (!toast) return;

  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;

  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

/* ═══════════════════════════════════════════════════
   7. QUICK VIEW MODAL
   ═══════════════════════════════════════════════════ */
function initQuickViewModal() {
  const quickBtns = document.querySelectorAll('.quick-view-btn');
  const modal = document.getElementById('quickview-modal');
  const overlay = document.getElementById('quickview-overlay');
  const closeBtn = document.getElementById('quickview-close');
  const content = document.getElementById('quickview-content');
  if (!modal || !overlay) return;

  quickBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const card = btn.closest('.editorial-card');
      if (!card) return;

      const title = card.querySelector('.editorial-card__title a')?.textContent || 'Hardware Repair Service';
      const priceCurrent = card.querySelector('.editorial-card__price-current')?.textContent || '₹999';
      const priceOriginal = card.querySelector('.editorial-card__price-original')?.textContent || '';
      const imgSrc = card.querySelector('.editorial-card__img')?.getAttribute('src') || 'images/service-placeholder.png';
      const metaTag = card.querySelector('.editorial-card__meta-tag')?.textContent || 'GENUINE OEM PARTS';
      const pills = Array.from(card.querySelectorAll('.size-pill')).map(p => p.textContent).join(' • ') || 'Same Day Service • 90-Day Warranty';

      if (content) {
        content.innerHTML = `
          <div class="quickview-grid">
            <div class="quickview-img-wrap">
              <img src="${imgSrc}" alt="${title}">
            </div>
            <div class="quickview-details">
              <span class="editorial-card__meta-tag" style="margin-bottom:8px;display:inline-block;">${metaTag}</span>
              <h3 class="quickview-title">${title}</h3>
              <div class="quickview-price">
                ${priceCurrent} 
                ${priceOriginal ? `<span style="text-decoration:line-through;color:#999;font-size:16px;margin-left:10px;">${priceOriginal}</span>` : ''}
              </div>
              <p class="quickview-desc">
                Certified precision repair executed by experienced engineers using 100% genuine components. Includes rigorous multi-point diagnostic testing and post-repair quality verification.
              </p>
              <div class="editorial-card__size-pills" style="margin-bottom:20px;gap:8px;">
                <span class="size-pill active">${pills}</span>
                <span class="size-pill">Free Doorstep Pickup</span>
              </div>
              <button class="quickview-add-btn" style="background:#25D366;display:flex;align-items:center;justify-content:center;gap:8px;" data-name="${title}" data-price="${priceCurrent}">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:18px;height:18px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                INQUIRE ON WHATSAPP
              </button>
            </div>
          </div>
        `;

        const modalAddBtn = content.querySelector('.quickview-add-btn');
        if (modalAddBtn) {
          modalAddBtn.addEventListener('click', () => {
            closeModal();
            openWhatsAppInquiryModal({
              serviceName: title,
              price: priceCurrent,
              card: card
            });
          });
        }
      }

      modal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}

/* ═══════════════════════════════════════════════════
   8. MOBILE FILTER DRAWER (SLIDE-OVER)
   ═══════════════════════════════════════════════════ */
function initMobileFilterDrawer() {
  const openBtn = document.getElementById('open-filter-drawer');
  const closeBtn = document.getElementById('close-filter-drawer');
  const sidebar = document.getElementById('shop-sidebar');

  if (openBtn && sidebar) {
    openBtn.addEventListener('click', () => {
      sidebar.classList.add('active');
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  }
}

/* ═══════════════════════════════════════════════════
   9. WHATSAPP INQUIRY MODAL (WITH DYNAMIC MODELS)
   ═══════════════════════════════════════════════════ */
const deviceModelsDatabase = {
  'macbook': [
    'MacBook Pro 16" (M3 Max / M3 Pro / M2 / M1)',
    'MacBook Pro 14" (M3 / M2 Pro / M1 Pro)',
    'MacBook Pro 13" (M2 / M1 / Touch Bar)',
    'MacBook Air 15" (M3 / M2)',
    'MacBook Air 13" (M3 / M2 / M1)',
    'MacBook Air 13" (Intel Core i5/i7)',
    'MacBook Pro 15" (Retina / Intel)',
    'Other MacBook Model'
  ],
  'iphone': [
    'iPhone 15 Pro Max / 15 Pro',
    'iPhone 15 / 15 Plus',
    'iPhone 14 Pro Max / 14 Pro',
    'iPhone 14 / 14 Plus',
    'iPhone 13 Pro Max / 13 Pro / 13',
    'iPhone 12 / 12 Pro / 12 Mini',
    'iPhone 11 / 11 Pro / 11 Pro Max',
    'iPhone XR / XS Max / XS / X',
    'iPhone SE (3rd Gen / 2nd Gen)',
    'iPhone 8 Plus / 8 / 7 / Older'
  ],
  'camera': [
    '4K Ultra HD Dome IP Camera (PoE)',
    'Color Night Vision Bullet Camera',
    '360° PTZ High Speed Dome Camera',
    '8-Channel PoE NVR 2TB System',
    'Wireless WiFi Solar Outdoor Camera',
    '4-Camera Complete Home Package',
    '8-Camera Commercial Business Package',
    'CCTV Cable & Signal Repair / AMC'
  ],
  'android': [
    'Samsung Galaxy S24 Ultra / S24+ / S24',
    'Samsung Galaxy S23 / S22 / S21 Series',
    'Samsung Galaxy Z Fold 5/4/3 & Z Flip',
    'Samsung Galaxy A / M / F Series',
    'OnePlus 12 / 11 / 10 Pro / Nord Series',
    'Google Pixel 8 Pro / 8 / 7 Pro / 7 / 6',
    'Xiaomi 14 / 13 / Redmi Note Series',
    'Vivo / Oppo / Realme Devices'
  ],
  'apple-watch': [
    'Apple Watch Ultra 2 / Ultra 1 (49mm)',
    'Apple Watch Series 9 (45mm / 41mm)',
    'Apple Watch Series 8 / 7 (45mm / 41mm)',
    'Apple Watch Series 6 / 5 / 4 (44mm / 40mm)',
    'Apple Watch SE (2nd Gen / 1st Gen)',
    'Apple Watch Series 3 / Older'
  ]
};

function initWhatsAppInquiryModal() {
  // Create modal container if not present in DOM
  if (!document.getElementById('inquiry-modal')) {
    const modalHTML = `
      <div class="inquiry-modal-overlay" id="inquiry-modal-overlay"></div>
      <div class="inquiry-modal" id="inquiry-modal" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="inquiry-modal__header">
          <div>
            <span class="inquiry-modal__badge">⚡ INSTANT WHATSAPP ESTIMATE</span>
            <h3 class="inquiry-modal__title">Book a Repair / WhatsApp Inquiry</h3>
            <p class="inquiry-modal__subtitle">Fill in your device details for immediate technician support</p>
          </div>
          <button class="inquiry-modal__close" id="inquiry-modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="inquiry-modal__body">
          <form id="whatsapp-inquiry-form">
            
            <div id="inquiry-selected-service" style="display:none;" class="inquiry-selected-service-card">
              <div class="inquiry-selected-service-card__info">
                <div class="inquiry-selected-service-card__icon" id="inquiry-service-icon">🔧</div>
                <div>
                  <h4 class="inquiry-selected-service-card__title" id="inquiry-service-name">Service Name</h4>
                  <p class="inquiry-selected-service-card__meta" id="inquiry-service-meta">Estimated Price: ₹999</p>
                </div>
              </div>
              <span style="font-size:11px;font-weight:700;color:#128C7E;background:#E8F8EE;padding:3px 8px;border-radius:12px;">SELECTED</span>
            </div>

            <div class="inquiry-form-grid">
              
              <!-- 1. Device Category -->
              <div class="inquiry-form-group">
                <label class="inquiry-form-label" for="inquiry-category">Device Category <span>*</span></label>
                <select id="inquiry-category" class="inquiry-form-select" required>
                  <option value="macbook">💻 MacBook Pro / Air</option>
                  <option value="iphone">📱 Apple iPhone</option>
                  <option value="camera">📹 CCTV Camera & Security</option>
                  <option value="android">🤖 Android Smartphone</option>
                  <option value="apple-watch">⌚ Apple Watch</option>
                </select>
              </div>

              <!-- 2. Dynamic Device Model -->
              <div class="inquiry-form-group">
                <label class="inquiry-form-label" for="inquiry-model">Specific Model <span>*</span></label>
                <select id="inquiry-model" class="inquiry-form-select" required>
                  <!-- Populated dynamically -->
                </select>
              </div>

              <!-- 3. Service / Issue Needed -->
              <div class="inquiry-form-group full-width">
                <label class="inquiry-form-label" for="inquiry-issue">Service or Issue Type <span>*</span></label>
                <select id="inquiry-issue" class="inquiry-form-select" required>
                  <option value="Screen / Display Replacement">Screen / Display Replacement (Cracked Glass, Touch, Blank)</option>
                  <option value="Battery Replacement / Health Renewal">Battery Replacement (Fast Drain, 100% Health Cell)</option>
                  <option value="Logic Board / Motherboard Chip-Level Repair">Logic Board / IC Micro-Soldering (No Power, Dead)</option>
                  <option value="Charging Port / MagSafe / USB-C Repair">Charging Port / MagSafe / USB-C Failure</option>
                  <option value="Water / Liquid Damage Ultrasonic Recovery">Water / Liquid Damage Ultrasonic Cleaning</option>
                  <option value="Camera Lens / Module Repair">Camera Lens / Module / Sensor Repair</option>
                  <option value="Speaker / Microphone / Haptics Fix">Speaker / Microphone / Haptic Engine Issue</option>
                  <option value="Back Glass Laser Replacement">Back Glass Laser Housing Replacement</option>
                  <option value="CCTV Installation / AMC Package">CCTV Installation, NVR Setup or AMC Contract</option>
                  <option value="Complete Diagnostic Health Audit">Complete Hardware Diagnostic Health Check</option>
                </select>
              </div>

              <!-- 4. Customer Name -->
              <div class="inquiry-form-group">
                <label class="inquiry-form-label" for="inquiry-name">Your Full Name <span>*</span></label>
                <input type="text" id="inquiry-name" class="inquiry-form-input" placeholder="e.g. Rahul Sharma" required>
              </div>

              <!-- 5. Phone Number -->
              <div class="inquiry-form-group">
                <label class="inquiry-form-label" for="inquiry-phone">WhatsApp / Phone <span>*</span></label>
                <input type="tel" id="inquiry-phone" class="inquiry-form-input" placeholder="e.g. 98765 43210" required>
              </div>

              <!-- 6. Area / Address -->
              <div class="inquiry-form-group full-width">
                <label class="inquiry-form-label" for="inquiry-location">Your Area / Location <span>*</span></label>
                <input type="text" id="inquiry-location" class="inquiry-form-input" placeholder="e.g. Hitech City, Madhapur, Gachibowli, or In-Store" required>
              </div>

              <!-- 7. Issue Description -->
              <div class="inquiry-form-group full-width">
                <label class="inquiry-form-label" for="inquiry-description">Describe the Issue (Optional)</label>
                <textarea id="inquiry-description" class="inquiry-form-textarea" placeholder="Briefly describe what happened (e.g. dropped on floor, display flickering, charging stopped working)..."></textarea>
              </div>

            </div>

            <button type="submit" class="inquiry-submit-btn" id="inquiry-submit-btn">
              <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              SEND INQUIRY ON WHATSAPP
            </button>
            <p class="inquiry-footer-note">🔒 Your details are 100% private. An engineer will reply on WhatsApp within 5 minutes.</p>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const categorySelect = document.getElementById('inquiry-category');
  const modelSelect = document.getElementById('inquiry-model');
  const overlay = document.getElementById('inquiry-modal-overlay');
  const modal = document.getElementById('inquiry-modal');
  const closeBtn = document.getElementById('inquiry-modal-close');
  const form = document.getElementById('whatsapp-inquiry-form');

  // Populate models based on category
  function updateModels(catKey) {
    if (!modelSelect) return;
    const models = deviceModelsDatabase[catKey] || deviceModelsDatabase['macbook'];
    modelSelect.innerHTML = models.map(m => `<option value="${m}">${m}</option>`).join('');
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      updateModels(categorySelect.value);
    });
    // Initial populate
    updateModels(categorySelect.value);
  }

  // Close handlers
  const closeModal = () => {
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Attach to all WhatsApp buttons on the site
  document.querySelectorAll('[data-action="whatsapp-general"], [data-action="whatsapp-inquire"], .service-card__cta, .editorial-card__action-btn[title="Book Repair"], .editorial-card__action-btn[title="Get Quote"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.editorial-card') || btn.closest('.service-card');
      const title = card?.querySelector('.editorial-card__title a')?.textContent || card?.querySelector('.service-card__title')?.textContent || '';
      const price = card?.querySelector('.editorial-card__price-current')?.textContent || card?.querySelector('.service-card__price')?.textContent || '';
      
      openWhatsAppInquiryModal({
        serviceName: title,
        price: price,
        card: card
      });
    });
  });

  // Handle Form Submission -> WhatsApp Redirect
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('inquiry-name')?.value.trim() || 'Valued Customer';
      const phone = document.getElementById('inquiry-phone')?.value.trim() || '';
      const location = document.getElementById('inquiry-location')?.value.trim() || 'Hyderabad';
      const category = categorySelect?.options[categorySelect.selectedIndex]?.text || 'Device Repair';
      const model = modelSelect?.value || 'Standard Model';
      const issue = document.getElementById('inquiry-issue')?.value || 'General Repair';
      const desc = document.getElementById('inquiry-description')?.value.trim() || 'Need immediate repair and pricing estimate.';

      const messageText = 
`*🔧 NEW REPAIR INQUIRY — iFixServices*
----------------------------------------
👤 *Customer Name:* ${name}
📞 *Contact Number:* ${phone}
📍 *Location / Area:* ${location}

📱 *Device Category:* ${category}
💻 *Exact Model:* ${model}
⚙️ *Service Required:* ${issue}

📝 *Issue Details:*
${desc}
----------------------------------------
_Sent via iFixServices Instant Booking Portal_`;

      const whatsappURL = `https://wa.me/917891239456?text=${encodeURIComponent(messageText)}`;

      closeModal();
      showShopToast('Connecting to WhatsApp...', 'Redirecting to our repair desk.');
      window.open(whatsappURL, '_blank');
    });
  }
}

function openWhatsAppInquiryModal(data = {}) {
  const modal = document.getElementById('inquiry-modal');
  const overlay = document.getElementById('inquiry-modal-overlay');
  const categorySelect = document.getElementById('inquiry-category');
  const modelSelect = document.getElementById('inquiry-model');
  const issueSelect = document.getElementById('inquiry-issue');
  const selectedServiceBox = document.getElementById('inquiry-selected-service');
  const serviceNameEl = document.getElementById('inquiry-service-name');
  const serviceMetaEl = document.getElementById('inquiry-service-meta');

  if (!modal || !overlay) return;

  // Auto-detect category from current page or card
  const path = window.location.pathname.toLowerCase();
  let defaultCategory = 'macbook';
  if (path.includes('iphone')) defaultCategory = 'iphone';
  else if (path.includes('camera')) defaultCategory = 'camera';
  else if (path.includes('android')) defaultCategory = 'android';
  else if (path.includes('watch')) defaultCategory = 'apple-watch';

  if (categorySelect) {
    categorySelect.value = defaultCategory;
    const models = deviceModelsDatabase[defaultCategory] || [];
    if (modelSelect) {
      modelSelect.innerHTML = models.map(m => `<option value="${m}">${m}</option>`).join('');

      // Check if page has an active model filter selected
      const pageModelSelect = document.getElementById('model-filter-select');
      if (pageModelSelect && pageModelSelect.value !== 'all' && pageModelSelect.options[pageModelSelect.selectedIndex]) {
        const selectedModelTitle = pageModelSelect.options[pageModelSelect.selectedIndex].textContent.trim();
        const matchingOpt = Array.from(modelSelect.options).find(opt => 
          opt.text.toLowerCase().includes(selectedModelTitle.toLowerCase()) || 
          selectedModelTitle.toLowerCase().includes(opt.text.toLowerCase())
        );

        if (matchingOpt) {
          modelSelect.value = matchingOpt.value;
        } else {
          const newOpt = document.createElement('option');
          newOpt.value = selectedModelTitle;
          newOpt.textContent = selectedModelTitle;
          newOpt.selected = true;
          modelSelect.prepend(newOpt);
        }
      }
    }
  }

  // Pre-fill selected service banner if triggered from a card
  if (data.serviceName && selectedServiceBox && serviceNameEl) {
    serviceNameEl.textContent = data.serviceName;
    if (serviceMetaEl) serviceMetaEl.textContent = data.price ? `Estimated Price: ${data.price}` : 'Certified OEM Repair';
    selectedServiceBox.style.display = 'flex';

    // Auto-select issue type if matching
    if (issueSelect) {
      const lower = data.serviceName.toLowerCase();
      if (lower.includes('screen') || lower.includes('display')) issueSelect.value = 'Screen / Display Replacement';
      else if (lower.includes('battery')) issueSelect.value = 'Battery Replacement / Health Renewal';
      else if (lower.includes('logic') || lower.includes('chip') || lower.includes('motherboard')) issueSelect.value = 'Logic Board / Motherboard Chip-Level Repair';
      else if (lower.includes('port') || lower.includes('charging') || lower.includes('magsafe')) issueSelect.value = 'Charging Port / MagSafe / USB-C Repair';
      else if (lower.includes('water') || lower.includes('liquid')) issueSelect.value = 'Water / Liquid Damage Ultrasonic Recovery';
      else if (lower.includes('camera') || lower.includes('dome') || lower.includes('cctv')) issueSelect.value = 'CCTV Installation / AMC Package';
    }
  } else if (selectedServiceBox) {
    selectedServiceBox.style.display = 'none';
  }

  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ═══════════════════════════════════════════════════
   10. HOME SERVICES TABS INTERACTION
   ═══════════════════════════════════════════════════ */
function initHomeServicesTabs() {
  const tabs = document.querySelectorAll('.services__tab');
  const serviceCards = document.querySelectorAll('.service-card, .editorial-product-grid .editorial-card');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = (tab.dataset.category || 'all').toLowerCase();

      serviceCards.forEach(card => {
        const cardCat = (card.dataset.category || '').toLowerCase();
        if (target === 'all' || cardCat.includes(target) || card.textContent.toLowerCase().includes(target)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initNewsletterSubscription() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      showShopToast('Subscription Confirmed', 'Thank you for subscribing to iFixServices newsletter!');
      input.value = '';
    }
  });
}

/* ═══════════════════════════════════════════════════
   15. ADMIN PORTAL SYNC & LOGIN MODAL
   ═══════════════════════════════════════════════════ */
function initAdminPortalSync() {
  // Inject Admin Login Modal HTML if not present
  if (!document.getElementById('admin-login-modal-overlay')) {
    const modalHTML = `
      <div class="admin-modal-overlay" id="admin-login-modal-overlay">
        <div class="admin-login-card" role="dialog" aria-modal="true">
          <div class="admin-login-card__header">
            <button type="button" class="admin-login-card__close" id="admin-modal-close">&times;</button>
            <span class="admin-login-card__badge">RESTRICTED ACCESS</span>
            <h3 class="admin-login-card__title">Admin Portal Login</h3>
            <p class="admin-login-card__desc">Enter administrator credentials to access inventory & pricing management.</p>
          </div>
          <div class="admin-login-card__body">
            <div class="admin-quick-fill">
              <span><strong>Demo Credentials:</strong> admin@ifixservices.in / admin123</span>
              <button type="button" class="admin-quick-fill-btn" id="admin-quick-fill-btn">Auto Fill</button>
            </div>

            <form id="admin-login-form">
              <div class="admin-form-group">
                <label for="admin-email">Admin Email *</label>
                <input type="email" id="admin-email" class="admin-form-input" placeholder="admin@ifixservices.in" required>
              </div>

              <div class="admin-form-group">
                <label for="admin-password">Password *</label>
                <input type="password" id="admin-password" class="admin-form-input" placeholder="••••••••" required>
              </div>

              <div class="admin-error-msg" id="admin-error-msg">Invalid email or password. Please try again.</div>

              <button type="submit" class="admin-submit-btn" style="margin-top:10px;">Login to Admin Dashboard</button>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modalOverlay = document.getElementById('admin-login-modal-overlay');
  const closeBtn = document.getElementById('admin-modal-close');
  const loginForm = document.getElementById('admin-login-form');
  const emailInput = document.getElementById('admin-email');
  const passInput = document.getElementById('admin-password');
  const quickFillBtn = document.getElementById('admin-quick-fill-btn');
  const errorMsg = document.getElementById('admin-error-msg');

  // Export global open function
  window.openAdminLoginModal = function() {
    if (sessionStorage.getItem('ifix_admin_logged_in') === 'true') {
      window.location.href = 'admin.html';
      return;
    }
    if (modalOverlay) modalOverlay.classList.add('active');
  };

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('active');
    });
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  // Quick fill button
  if (quickFillBtn) {
    quickFillBtn.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'admin@ifixservices.in';
      if (passInput) passInput.value = 'admin123';
      if (errorMsg) errorMsg.style.display = 'none';
    });
  }

  // Login Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput ? emailInput.value.trim() : '';
      const pass = passInput ? passInput.value.trim() : '';

      if (email === 'admin@ifixservices.in' && pass === 'admin123') {
        sessionStorage.setItem('ifix_admin_logged_in', 'true');
        if (errorMsg) errorMsg.style.display = 'none';
        showShopToast('Admin Authenticated', 'Access granted. Redirecting to Admin Dashboard...');
        if (modalOverlay) modalOverlay.classList.remove('active');
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 600);
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
      }
    });
  }

  // Bind all Admin nav buttons / links
  document.querySelectorAll('.editorial-nav__link--admin, [href="admin.html"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (sessionStorage.getItem('ifix_admin_logged_in') !== 'true') {
        e.preventDefault();
        window.openAdminLoginModal();
      }
    });
  });

  // Apply localStorage Custom Services & Stock Status to current Page Cards
  syncPageServicesFromStorage();
}

// Sync Live Product Changes from localStorage to Product Cards on Any Page
function syncPageServicesFromStorage() {
  const data = localStorage.getItem('ifix_catalog_services');
  if (!data) return;

  let storedServices = [];
  try {
    storedServices = JSON.parse(data);
  } catch (e) {
    return;
  }

  const cards = document.querySelectorAll('.editorial-card');
  cards.forEach(card => {
    const cardId = card.querySelector('.add-to-cart-btn')?.dataset.id || card.querySelector('.quick-view-btn')?.dataset.id;
    const cardTitle = card.querySelector('.editorial-card__title a')?.textContent?.trim();

    // Match stored service by ID or title
    const matched = storedServices.find(s => s.id === cardId || (s.title && s.title.trim() === cardTitle));
    if (matched) {
      // Update Price
      const priceCurrent = card.querySelector('.editorial-card__price-current');
      if (priceCurrent && matched.price) {
        priceCurrent.textContent = '₹' + Number(matched.price).toLocaleString();
      }

      // Update Original Price
      const priceOrig = card.querySelector('.editorial-card__price-original');
      if (priceOrig) {
        if (matched.originalPrice) {
          priceOrig.textContent = '₹' + Number(matched.originalPrice).toLocaleString();
        } else {
          priceOrig.textContent = '';
        }
      }

      // Update Image
      const img = card.querySelector('.editorial-card__img');
      if (img && matched.img) {
        img.src = matched.img;
      }

      // Update Badge
      const badge = card.querySelector('.editorial-card__badge');
      if (badge && matched.badge) {
        badge.textContent = matched.badge;
      }

      // Update Stock Status
      const isOut = matched.stock === 'outofstock';
      if (isOut) {
        card.classList.add('out-of-stock');
        if (!card.querySelector('.out-of-stock-badge')) {
          const badgeEl = document.createElement('span');
          badgeEl.className = 'out-of-stock-badge';
          badgeEl.textContent = 'OUT OF STOCK';
          card.querySelector('.editorial-card__image-container')?.appendChild(badgeEl);
        }
        const addBtn = card.querySelector('.add-to-cart-btn');
        if (addBtn) {
          addBtn.setAttribute('disabled', 'disabled');
          addBtn.setAttribute('title', 'Out of Stock');
        }
      } else {
        card.classList.remove('out-of-stock');
        card.querySelector('.out-of-stock-badge')?.remove();
        const addBtn = card.querySelector('.add-to-cart-btn');
        if (addBtn) {
          addBtn.removeAttribute('disabled');
          addBtn.setAttribute('title', 'Book Repair');
        }
      }
    }
  });

  // If on a page with #product-grid and new items were added that are not in the initial HTML, append them
  const grid = document.getElementById('product-grid');
  if (grid) {
    let pageCat = '';
    const loc = window.location.pathname.toLowerCase();
    if (loc.includes('macbook')) pageCat = 'macbook';
    else if (loc.includes('iphone')) pageCat = 'iphone';
    else if (loc.includes('camera')) pageCat = 'cctv';
    else if (loc.includes('watch')) pageCat = 'watch';
    else if (loc.includes('all-services')) pageCat = 'all';

    if (pageCat) {
      storedServices.forEach(srv => {
        if (srv.id && srv.id.startsWith('custom-')) {
          if (pageCat === 'all' || srv.category === pageCat) {
            if (!grid.querySelector(`[data-product-id="${srv.id}"]`) && !grid.querySelector(`.add-to-cart-btn[data-id="${srv.id}"]`)) {
              const isOut = srv.stock === 'outofstock';
              const cardHTML = `
                <article class="editorial-card ${isOut ? 'out-of-stock' : ''}" data-category="${srv.category}" data-price="${srv.price}" data-rating="4.9">
                  <div class="editorial-card__image-container">
                    <span class="editorial-card__badge">${srv.badge || 'NEW SERVICE'}</span>
                    ${isOut ? '<span class="out-of-stock-badge">OUT OF STOCK</span>' : ''}
                    <button class="editorial-card__wishlist" aria-label="Save Service" data-product-id="${srv.id}">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                    <a href="#service" class="editorial-card__link">
                      <img src="${srv.img}" alt="${srv.title}" class="editorial-card__img" loading="lazy">
                    </a>
                    <div class="editorial-card__actions">
                      <button class="editorial-card__action-btn quick-view-btn" data-id="${srv.id}" data-name="${srv.title}" data-price="₹${srv.price.toLocaleString()}" data-img="${srv.img}" title="Quick View" aria-label="Quick View">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <button class="editorial-card__action-btn add-to-cart-btn" data-id="${srv.id}" data-name="${srv.title}" data-price="₹${srv.price.toLocaleString()}" data-img="${srv.img}" title="Book Repair" aria-label="Book Repair" ${isOut ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                      </button>
                    </div>
                  </div>
                  <div class="editorial-card__body">
                    <span class="editorial-card__meta-tag">${srv.tag || 'CERTIFIED SERVICE'}</span>
                    <h3 class="editorial-card__title"><a href="#service">${srv.title}</a></h3>
                    <div class="editorial-card__price-row">
                      <span class="editorial-card__price-current">₹${srv.price.toLocaleString()}</span>
                      ${srv.originalPrice ? `<span class="editorial-card__price-original">₹${srv.originalPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="editorial-card__size-pills">
                      <span class="size-pill">Same Day Service</span>
                      <span class="size-pill active">Warranty Included</span>
                    </div>
                  </div>
                </article>
              `;
              grid.insertAdjacentHTML('afterbegin', cardHTML);
            }
          }
        }
      });
    }
  }
}

