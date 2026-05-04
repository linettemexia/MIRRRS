# MediaSlide Integration Plan

> Strategy for connecting the static front-end to the MediaSlide WordPress plugin without losing performance or design control.

---

## 1. Architecture overview

The static site lives at the root (`/`). WordPress + MediaSlide will eventually live at `/blog/` (or a subdomain).

```
mirrrs.com/                ← Static site (this codebase)
mirrrs.com/blog/           ← WordPress install (with MediaSlide)
mirrrs.com/blog/wp-json/   ← REST API surface
```

Two integration patterns are supported:

| Pattern | Best for | Trade-off |
|---|---|---|
| **A. Server-side render** | Board pages, model detail, journal | WordPress renders the page; static site links to it. Fast for SEO, slower to keep visually consistent. |
| **B. JSON hydration** | Home hero (Talent of the Month), ticker, "Latest from Journal" | Static HTML stays fast; small `fetch()` calls swap in fresh data on load. |

Use **A** for content-heavy pages and **B** for the home page.

---

## 2. Suggested page templates

| Route | Type | Source |
|---|---|---|
| `/` | Static | `index.html` |
| `/main`, `/new-faces`, `/image` | Static + JSON hydration | `pages/board.html` + `MS_CONFIG.endpoints.boardX` |
| `/models/:slug` | Server-rendered (WP) | MediaSlide single-model template |
| `/portfolio/:slug` | Server-rendered (WP) | MediaSlide gallery template |
| `/journal` | Server-rendered (WP) | WP archive |
| `/journal/:slug` | Server-rendered (WP) | WP single post |
| `/apply`, `/contact` | Static | `pages/apply.html`, `pages/contact.html` |

---

## 3. Visual consistency between static & WP

To keep the WP-rendered pages looking identical to the static site:

1. **Build a child theme** as documented in `mirrrs_project_context.md`:
   ```
   /wp-content/themes/mirrrs-child/
     ├── style.css       ← imports the same tokens.css
     ├── functions.php
     └── mediaslide/
   ```
2. In the child theme `style.css`, **`@import` the same CSS files** that this static site uses:
   ```css
   @import url('https://mirrrs.com/assets/css/tokens.css');
   @import url('https://mirrrs.com/assets/css/base.css');
   @import url('https://mirrrs.com/assets/css/components.css');
   @import url('https://mirrrs.com/assets/css/pages.css');
   ```
3. Override MediaSlide's default selectors with the design tokens:
   ```css
   .ms-models-grid {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
     gap: var(--space-6);
   }
   .ms-model-card-name {
     font-family: var(--font-serif);
     font-weight: var(--fw-light);
   }
   ```
4. **Reuse the page templates** in `assets/css/pages.css` — they include `.model-card`, `.board-grid`, `.model-hero`, `.model-portfolio`, `.article` ready for MediaSlide markup.

---

## 4. Data needed from MediaSlide

For each model (CPT `model`):

```json
{
  "id": 42,
  "slug": "tsion-teferi",
  "name": "Tsion Teferi",
  "board": "main",
  "featured": false,
  "talent_of_month": true,
  "image": "https://.../tsion-card.jpg",
  "portfolio": [
    "https://.../1.jpg",
    "https://.../2.jpg"
  ],
  "stats": {
    "height": "180 cm",
    "bust":   "82 cm",
    "waist":  "60 cm",
    "hips":   "88 cm",
    "shoes":  "EU 39",
    "hair":   "Brown",
    "eyes":   "Brown"
  }
}
```

Register a custom REST endpoint in `functions.php`:

```php
add_action('rest_api_init', function () {
  register_rest_route('mediaslide/v1', '/featured', [
    'methods'  => 'GET',
    'callback' => function () {
      $model = ms_get_featured_model();
      return [
        'id'    => $model->ID,
        'slug'  => $model->post_name,
        'name'  => $model->post_title,
        'image' => ms_get_model_image($model->ID, 'hero'),
        'url'   => '/models/' . $model->post_name,
      ];
    },
    'permission_callback' => '__return_true',
  ]);
});
```

---

## 5. Step-by-step rollout

1. **Phase 1 — Static only** (current state): the home page lives at `/`, no live data. ✅
2. **Phase 2 — WP install on `/blog/`**: install WordPress on `/blog/`, install MediaSlide, install the Mirrrs child theme.
3. **Phase 3 — Hydrate hero**: enable the `hydrateHero()` call in `assets/js/main.js`. The home page now shows the live Talent of the Month.
4. **Phase 4 — Board pages**: build `pages/board.html`, render boards via JSON. Or move boards to WP and use server-side rendering.
5. **Phase 5 — Model detail**: route `/models/:slug` to WP (preferred for SEO) using a `.htaccess` rewrite or Nginx location block.
6. **Phase 6 — Journal**: WP posts under category "Journal" become the journal feed; the home page hydrates the latest 3 posts via the `/wp/v2/posts` endpoint.

---

## 6. CORS & security

Because the static site fetches from `mirrrs.com/blog/wp-json/`, both domains must match (or you must enable CORS in WP):

```php
// functions.php
add_action('rest_api_init', function () {
  remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
  add_filter('rest_pre_serve_request', function ($value) {
    header('Access-Control-Allow-Origin: https://mirrrs.com');
    header('Access-Control-Allow-Methods: GET');
    return $value;
  });
});
```

Keep the WP admin behind a strong password + 2FA + a plugin like Wordfence.

---

## 7. Files in this repo

- `integrations/mediaslide-config.js` — endpoint configuration
- `assets/js/integrations.js` — `loadFeaturedTalent`, `hydrateHero`, `renderBoard` stubs
- `assets/css/pages.css` — `.model-card`, `.board-grid`, `.article` styles ready for MediaSlide markup
