# Mirrrs Models — Front-End

> Editorial, premium, scalable starter codebase for the Mirrrs Models website.
> Plain HTML + CSS + Vanilla JS. No build step required.

---

## Project structure

```
/
├── index.html                       Home page
├── robots.txt                       Crawler rules
├── sitemap.xml                      Search engine map
├── README.md                        This file
│
├── /assets/
│   ├── /css/
│   │   ├── main.css                 Single entry — imports all
│   │   ├── tokens.css               Design tokens (colors, typo, spacing)
│   │   ├── fonts.css                Font loading + self-host instructions
│   │   ├── reset.css                Modern CSS reset
│   │   ├── base.css                 Base typography & a11y defaults
│   │   ├── layout.css               Page-level grids
│   │   ├── components.css           Nav, buttons, cards, modal, ticker, footer
│   │   ├── pages.css                Page-specific (board, model, article, contact)
│   │   ├── utilities.css            Single-purpose helpers
│   │   └── responsive.css           Breakpoint overrides (mobile-first scale-down)
│   │
│   ├── /js/
│   │   ├── main.js                  Entry — initialises all modules
│   │   ├── navigation.js            Sticky nav, mobile drawer, smooth scroll
│   │   ├── animations.js            Headline reveal, scroll reveal, lazy fade
│   │   ├── forms.js                 Form validation scaffold
│   │   └── integrations.js          Video modal, MediaSlide stubs
│   │
│   ├── /fonts/                      Self-hosted .woff2 (when ready)
│   ├── /img/                        Editorial photography
│   ├── /icons/                      Favicons + brand SVGs
│   └── /meta/                       site.webmanifest
│
├── /pages/                          Future static pages (apply.html, contact.html, board.html…)
├── /blog/                           Reserved for WordPress install (MediaSlide + journal)
└── /integrations/                   Third-party config & docs
    ├── mediaslide-config.js
    └── MEDIASLIDE_INTEGRATION.md
```

---

## Getting started

```bash
# Serve locally — any static server works
npx serve .          # or: python3 -m http.server 8000
```

Open `http://localhost:3000`.

There is no build step. The CSS uses native `@import` and the JS is ESM.
For production, you can optionally concatenate the CSS files (see comment at the bottom of `assets/css/main.css`).

---

## Design system

All visual decisions are tokens in `assets/css/tokens.css`. Edit there to change global colors, type, spacing, etc. — every component picks them up.

- **Brand color (rose):** `--color-accent: #C0857C`
- **Page background (cream):** `--color-warm: #f7f5f0`
- **Display serif:** `Cormorant Garamond` (Light + Italic)
- **UI sans:** `Inter` (300/400/500)

---

## What to replace before going live

Search the codebase for `REPLACE` comments. The big ones:

1. **Production URL** — `https://mirrrs.com/` in `index.html`, `robots.txt`, `sitemap.xml`
2. **Open Graph image** — `/assets/img/og/og-default.jpg` (1200×630)
3. **Favicon set** — drop the icon files into `/assets/icons/`
4. **Photography** — replace Unsplash placeholders in `index.html` with editorial shots
5. **MediaSlide endpoints** — `integrations/mediaslide-config.js` once WordPress is live

---

## Roadmap

See `integrations/MEDIASLIDE_INTEGRATION.md` for the WordPress + MediaSlide rollout plan.

---

## License

© 2025 Mirrrs Models GmbH. All rights reserved.
