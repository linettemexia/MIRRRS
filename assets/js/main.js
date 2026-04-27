/* ============================================================
   main.js — Application entry point
   Initialises each module in the correct order.
   Loaded as a module: <script type="module" src="/assets/js/main.js"></script>
   ============================================================ */

import { initNavigation } from './navigation.js';
import { initHeadline, initScrollReveal, initLazyImages } from './animations.js';
import { initVideoModal, hydrateHero } from './integrations.js';
import { initForms } from './forms.js';

function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

ready(() => {
  // Order matters in only a couple of cases:
  // 1) headline runs first so the words start animating on paint
  // 2) hydrateHero runs last so it can replace static content
  initHeadline();
  initNavigation();
  initScrollReveal();
  initLazyImages();
  initVideoModal();
  initForms();

  // Optional: live data — silently no-ops if MediaSlide isn't wired yet.
  // Comment out in development if you don't want the network noise.
  // hydrateHero();
});
