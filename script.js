/**
 * AEKAMBER SOLUTIONS — Vanilla JavaScript
 * Handles: Navbar scroll, Mobile menu, Hero carousel,
 *          Service tabs, FAQ accordion, Count-up stats,
 *          Floating CTA, Fade-in animations, Contact form
 * No dependencies. Works in all modern browsers.
 */
(function () {
  'use strict';

  /* ── NAVBAR SCROLL ─────────────────────────────────────────── */
  var navbar = document.getElementById('ak-navbar');
  if (navbar) {
    function updateNavbar() {
      if (window.scrollY > 20) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  /* ── MOBILE MENU ────────────────────────────────────────────── */
  var menuBtn    = document.getElementById('ak-menu-btn');
  var mobileMenu = document.getElementById('ak-mobile-menu');
  var overlay    = document.getElementById('ak-overlay');
  var closeBtn   = document.getElementById('ak-mobile-close');

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (overlay)    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (overlay)    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (menuBtn)  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay)  overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.ak-mobile-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ── HERO CAROUSEL ──────────────────────────────────────────── */
  var slides = document.querySelectorAll('.ak-carousel-slide');
  var dots   = document.querySelectorAll('.ak-dot');
  var current = 0, carouselTimer;

  function goTo(n) {
    slides.forEach(function (s, i) { s.classList.toggle('active', i === n); });
    dots.forEach(function (d, i)   { d.classList.toggle('active', i === n); });
    current = n;
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
      clearInterval(carouselTimer);
      carouselTimer = setInterval(function () { goTo((current + 1) % slides.length); }, 5000);
    });
  });
  if (slides.length > 1) {
    carouselTimer = setInterval(function () { goTo((current + 1) % slides.length); }, 5000);
  }

  /* ── SERVICE TABS ───────────────────────────────────────────── */
  document.querySelectorAll('.ak-tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group  = btn.closest('.ak-tabs-group');
      var target = btn.dataset.tab;
      if (!group) return;
      group.querySelectorAll('.ak-tab-btn').forEach(function (b) { b.classList.remove('active'); });
      group.querySelectorAll('.ak-tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = group.querySelector('[data-panel="' + target + '"]');
      if (panel) panel.classList.add('active');
    });
  });

  /* ── FAQ ACCORDION ──────────────────────────────────────────── */
  document.querySelectorAll('.ak-faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item   = q.closest('.ak-faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.ak-faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── COUNT-UP ───────────────────────────────────────────────── */
  function countUp(el) {
    var end      = parseInt(el.dataset.value || '0', 10);
    var suffix   = el.dataset.suffix || '';
    var duration = 2500;
    var startTime;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p    = Math.min((ts - startTime) / duration, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * end) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── INTERSECTION OBSERVER — fades + count-up ───────────────── */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.classList.contains('ak-fade'))     el.classList.add('visible');
        if (el.classList.contains('ak-count-up') && !el.dataset.counted) {
          el.dataset.counted = '1';
          countUp(el);
        }
        io.unobserve(el);
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.ak-fade, .ak-count-up').forEach(function (el) {
      io.observe(el);
    });
  } else {
    /* Fallback for IE/old browsers */
    document.querySelectorAll('.ak-fade').forEach(function (el) { el.classList.add('visible'); });
    document.querySelectorAll('.ak-count-up').forEach(function (el) {
      el.textContent = el.dataset.value + (el.dataset.suffix || '');
    });
  }

  /* ── FLOATING CTA ───────────────────────────────────────────── */
  var floatEl = document.getElementById('ak-float');
  if (floatEl) {
    window.addEventListener('scroll', function () {
      floatEl.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  /* ── CONTACT FORM ───────────────────────────────────────────── */
  var form = document.getElementById('ak-contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields  = document.getElementById('ak-form-fields');
      var success = document.getElementById('ak-form-success');
      if (fields)  fields.style.display  = 'none';
      if (success) success.style.display = 'block';
    });
  }
  document.querySelectorAll('.ak-form-reset').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var fields  = document.getElementById('ak-form-fields');
      var success = document.getElementById('ak-form-success');
      if (fields)  fields.style.display  = 'block';
      if (success) success.style.display = 'none';
      if (form) form.reset();
    });
  });

  /* ── ACTIVE NAV LINK ────────────────────────────────────────── */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.ak-nav-link, .ak-mobile-link').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('/').pop();
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

})();
