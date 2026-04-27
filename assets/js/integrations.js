/* ============================================================
   integrations.js — Third-party / dynamic integrations
   - Video modal (Apply CTA)
   - MediaSlide placeholder (stub the data layer for now)
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   VIDEO MODAL
   ──────────────────────────────────────────────────────────── */
export function initVideoModal() {
  const overlay  = document.getElementById('videoOverlay');
  const applyBtn = document.getElementById('applyBtn');
  const closeBtn = document.getElementById('videoClose');

  if (!overlay || !applyBtn) return;

  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Move focus into the modal for accessibility
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Pause any playing video
    const video = overlay.querySelector('video');
    if (video) video.pause();

    // Reset iframe to stop YouTube/Vimeo playback
    const iframe = overlay.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = '';
      iframe.src = src;
    }

    // Restore focus
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  applyBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
}

/* ────────────────────────────────────────────────────────────
   MEDIASLIDE — placeholder integration
   ────────────────────────────────────────────────────────────
   MediaSlide is a WordPress plugin that manages the model
   roster, boards, and portfolios. When the WordPress install
   is in place, expose its data via either:

     A) WordPress REST API:
        /wp-json/wp/v2/model
        /wp-json/wp/v2/board
        /wp-json/mediaslide/v1/featured

     B) Server-side rendering (faster):
        WordPress renders the relevant pages and the static
        site links straight to them (preferred for SEO).

   For the Talent of the Month and the home-page boards we
   recommend a small JSON endpoint MediaSlide can populate,
   e.g. /api/featured.json — that way the static front page
   stays a single fast HTML file, just hydrated with fresh data.

   The functions below are stubs; wire them up to real URLs
   once WordPress is live.
   ──────────────────────────────────────────────────────────── */

const MS_ENDPOINTS = {
  // REPLACE these URLs once WordPress + MediaSlide is live
  featured: '/wp-json/mediaslide/v1/featured',
  boards:   '/wp-json/mediaslide/v1/boards',
  models:   '/wp-json/wp/v2/model',
};

/**
 * Fetch the talent currently flagged "Talent of the Month".
 * Returns null if the endpoint isn't available yet.
 */
export async function loadFeaturedTalent() {
  try {
    const res = await fetch(MS_ENDPOINTS.featured, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.info('[MediaSlide] featured endpoint not available yet — using static markup.');
    return null;
  }
}

/**
 * Hydrate the home-page hero with live data from MediaSlide.
 * Falls back silently if the API isn't reachable.
 *
 * Expected JSON shape:
 *   {
 *     "id": 123,
 *     "name": "Tsion Teferi",
 *     "image": "https://.../tsion.jpg",
 *     "url":   "/models/tsion-teferi"
 *   }
 */
export async function hydrateHero() {
  const featured = await loadFeaturedTalent();
  if (!featured) return;

  const heroFeat = document.querySelector('.hero-feat');
  if (!heroFeat) return;

  const img  = heroFeat.querySelector('.hero-feat-img');
  const name = heroFeat.querySelector('.hero-feat-badge .name');

  if (img && featured.image) {
    img.src = featured.image;
    img.alt = `Talent of the month — ${featured.name}`;
  }
  if (name && featured.name) {
    name.textContent = featured.name;
  }
  if (featured.url) {
    heroFeat.style.cursor = 'pointer';
    heroFeat.addEventListener('click', () => { window.location.href = featured.url; });
  }
}

/**
 * Future: render a board on a board page.
 * Suggested usage on /pages/board.html:
 *   import { renderBoard } from '/assets/js/integrations.js';
 *   renderBoard('main', document.querySelector('.board-grid'));
 */
export async function renderBoard(boardSlug, container) {
  if (!container) return;
  try {
    const res = await fetch(`${MS_ENDPOINTS.boards}/${boardSlug}`);
    if (!res.ok) return;
    const models = await res.json();

    container.innerHTML = models.map(m => `
      <a class="model-card" href="${m.url}">
        <div class="model-card-img">
          <img src="${m.image}" alt="${m.name}" loading="lazy">
        </div>
        <p class="model-card-name">${m.name}</p>
        <p class="model-card-meta">${m.height || ''}</p>
      </a>
    `).join('');
  } catch (err) {
    console.warn('[MediaSlide] could not render board:', err);
  }
}
