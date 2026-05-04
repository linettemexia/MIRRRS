/**
 * ============================================================
 * mediaslide-config.js — MediaSlide Integration Configuration
 * ============================================================
 * This file holds the configuration for integrating with the
 * MediaSlide WordPress plugin once WordPress is installed.
 *
 * DO NOT commit real API keys here. Use environment variables
 * or a /config.local.js file (gitignored) for production.
 *
 * USAGE:
 *   import { MS_CONFIG } from '/integrations/mediaslide-config.js';
 *   fetch(MS_CONFIG.endpoints.featured)...
 * ============================================================
 */

export const MS_CONFIG = {
  // ── Base URLs ───────────────────────────────────────────────
  // Once WordPress is live (likely on /blog), point these here.
  // If WP lives on a subdomain (e.g. cms.mirrrs.com), update accordingly.
  baseUrl:    'https://mirrrs.com',
  wpBaseUrl:  'https://mirrrs.com/blog',
  apiBaseUrl: 'https://mirrrs.com/blog/wp-json',

  // ── Endpoints ───────────────────────────────────────────────
  // These follow MediaSlide's expected REST routes. Verify the
  // exact paths in your MediaSlide installation; tweak as needed.
  endpoints: {
    // Featured talent (Talent of the Month)
    featured:   '/mediaslide/v1/featured',

    // Boards
    boards:     '/mediaslide/v1/boards',                 // list all boards
    boardMain:  '/mediaslide/v1/boards/main',
    boardNew:   '/mediaslide/v1/boards/new-faces',
    boardImage: '/mediaslide/v1/boards/image',

    // Models
    models:     '/wp/v2/model',                          // CPT created by MediaSlide
    modelById:  (id) => `/wp/v2/model/${id}`,

    // Journal (WordPress posts in the "Journal" category)
    posts:      '/wp/v2/posts?categories=journal',
    postBySlug: (slug) => `/wp/v2/posts?slug=${slug}`,
  },

  // ── Default fetch options ───────────────────────────────────
  fetchOptions: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  },

  // ── Image handling ──────────────────────────────────────────
  // Match MediaSlide's image size names; adjust to whatever your
  // installation registers.
  imageSizes: {
    thumb:     'thumbnail',     // ~ 150x150
    card:      'medium',        // ~ 400x600
    portfolio: 'large',         // ~ 1024x1536
    hero:      'mirrrs-hero',   // custom — register in functions.php
  },
};

/**
 * Helper to build a full endpoint URL.
 *   buildUrl('featured')                -> 'https://mirrrs.com/blog/wp-json/mediaslide/v1/featured'
 *   buildUrl('modelById', 42)           -> 'https://mirrrs.com/blog/wp-json/wp/v2/model/42'
 */
export function buildUrl(key, ...args) {
  const ep = MS_CONFIG.endpoints[key];
  const path = typeof ep === 'function' ? ep(...args) : ep;
  return `${MS_CONFIG.apiBaseUrl}${path}`;
}
