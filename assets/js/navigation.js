/* ============================================================
   navigation.js — Header / nav behavior
   - Sticky header shadow on scroll
   - Mobile drawer toggle
   - Active link highlighting
   - Smooth scroll for in-page anchors
   ============================================================ */

export function initNavigation() {
  const nav        = document.querySelector('.nav');
  const toggle     = document.querySelector('.nav-toggle');
  const navLinks   = document.querySelector('.nav-links');
  const linkItems  = document.querySelectorAll('.nav-links a');

  if (!nav) return;

  // ── Sticky header — add shadow once user scrolls past 8px ──
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        nav.classList.toggle('is-scrolled', window.scrollY > 8);
        lastY = window.scrollY;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Mobile drawer ──
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer when a link is clicked (mobile)
    linkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close drawer on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // ── Smooth scroll for in-page anchors (#section) ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Highlight current page link via aria-current ──
  // (uses pathname match — adjust as your URL structure evolves)
  const path = window.location.pathname.replace(/\/$/, '');
  linkItems.forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '');
    if (linkPath === path) link.setAttribute('aria-current', 'page');
  });
}
