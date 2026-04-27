# Final Implementation Checklist

Three checklists to walk before launch.

---

## SEO Checklist

### Meta tags
- [ ] `<title>` unique on every page, 50–60 characters
- [ ] `<meta name="description">` on every page, 140–160 characters
- [ ] `<link rel="canonical">` on every page (self-referencing)
- [ ] `<meta name="robots">` set to `index, follow` on public pages, `noindex` on admin / preview
- [ ] `lang="en"` on `<html>` (or `de` if German)

### Open Graph & social
- [ ] `og:title`, `og:description`, `og:url`, `og:type`, `og:image` on every page
- [ ] OG image is 1200×630 JPG (under 8MB), saved at `/assets/img/og/`
- [ ] `twitter:card` set to `summary_large_image`
- [ ] Test with [opengraph.xyz](https://www.opengraph.xyz/) and [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Structured data (JSON-LD)
- [ ] **Organization** schema in `index.html` ✅ (already added)
- [ ] **WebSite** schema with `potentialAction` for site search (when search exists)
- [ ] **Article** schema on every journal post (Yoast/Rank Math handles in WP)
- [ ] **Person** schema on every model profile
- [ ] **BreadcrumbList** on board → model navigation
- [ ] Validate at [Schema.org Validator](https://validator.schema.org/) and Google's Rich Results Test

### Crawling & indexing
- [ ] `robots.txt` at site root ✅
- [ ] `sitemap.xml` at site root ✅
- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Submit sitemap to [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] No `noindex` on production by accident — check staging robots aren't deployed

### On-page
- [ ] Exactly one `<h1>` per page
- [ ] Logical heading order (`h1` → `h2` → `h3`, no skipping)
- [ ] All images have descriptive `alt` text (decorative images use `alt=""`)
- [ ] Internal links use descriptive anchor text — no "click here"
- [ ] URLs use hyphens not underscores, lowercase, no query strings where avoidable
- [ ] Mobile-friendly — pass [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Performance for SEO
- [ ] LCP under 2.5s
- [ ] CLS under 0.1
- [ ] INP under 200ms
- [ ] Test with [PageSpeed Insights](https://pagespeed.web.dev/)

### Local SEO (Hamburg)
- [ ] Google Business Profile claimed and verified for Karolinenstrasse 6
- [ ] NAP (Name / Address / Phone) consistent across site footer, GBP, Instagram bio
- [ ] German-language version planned for `/de/` (future)

---

## Accessibility Checklist

### Keyboard
- [ ] Every interactive element reachable via Tab
- [ ] Visible focus ring on every focusable element (`:focus-visible`) ✅
- [ ] Skip link present and works ✅
- [ ] Modal traps focus (Tab cycles within); Escape closes ✅
- [ ] No "keyboard traps" outside modals

### Screen readers
- [ ] All `<img>` have `alt` text — decorative ones use `alt=""`
- [ ] `<button>` for actions, `<a>` for navigation
- [ ] Buttons without visible text have `aria-label`
- [ ] Modal has `role="dialog"` and `aria-modal="true"` ✅
- [ ] Form inputs have associated `<label>` ✅
- [ ] Form errors announced via `role="alert"` ✅
- [ ] Live data hydration uses `aria-live="polite"` if visible to user

### Color & contrast
- [ ] Body text contrast ratio ≥ 4.5:1
- [ ] Large text contrast ratio ≥ 3:1
- [ ] Focus ring visible against all backgrounds
- [ ] Test with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] **Note:** the muted greys (`#bbb`, `#ccc`) used for captions on the warm cream may fail AA — verify and darken if needed

### Motion & animation
- [ ] `prefers-reduced-motion` respected in CSS ✅ and JS ✅
- [ ] Auto-playing animations under 5 seconds OR have a pause control
- [ ] Ticker can be paused on hover ✅

### Forms
- [ ] All fields have visible labels (not just placeholders)
- [ ] Error messages are clear and tied to the input via `aria-describedby` (consider adding)
- [ ] Required fields marked both visually and with `aria-required` or `required`

### Test
- [ ] Run [axe DevTools](https://www.deque.com/axe/devtools/) — 0 critical issues
- [ ] Run [WAVE](https://wave.webaim.org/) on every public page
- [ ] Manual test: navigate the home page using only the keyboard
- [ ] Manual test: navigate the home page with VoiceOver / NVDA

---

## Performance Checklist

### Loading
- [ ] CSS in `<head>`, non-blocking via single bundle (or HTTP/2 multiplexed)
- [ ] JS uses `type="module"` (defers automatically) ✅
- [ ] Fonts use `font-display: swap` ✅
- [ ] Preconnect to `fonts.gstatic.com` ✅

### Images
- [ ] All non-hero images use `loading="lazy"` ✅
- [ ] Width and height attributes on every `<img>` (prevents CLS) ✅
- [ ] WebP / AVIF where browser supports
- [ ] Replace Unsplash placeholder URLs with optimised production images
- [ ] Hero image is preloaded:
  ```html
  <link rel="preload" as="image" href="/assets/img/hero/talent-of-month.jpg" />
  ```

### Caching
- [ ] HTTP cache headers: HTML `no-cache`, CSS/JS/images `max-age=31536000, immutable`
- [ ] Use cache-busting filenames for CSS/JS in production (`main.abc123.css`)
- [ ] CDN in front of static assets (Cloudflare, Bunny, Vercel, Netlify)

### Code
- [ ] Concatenate CSS in production (see `main.css` build comment)
- [ ] Minify CSS/JS in production
- [ ] Remove unused CSS once content is final (PurgeCSS / similar)
- [ ] No console.log in production builds

### Core Web Vitals targets
- [ ] **LCP** (Largest Contentful Paint) < 2.5s — hero image is the LCP element; preload it
- [ ] **CLS** (Cumulative Layout Shift) < 0.1 — width/height on images, fonts swap correctly
- [ ] **INP** (Interaction to Next Paint) < 200ms — no heavy JS on click handlers

### Test
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) — green on mobile and desktop
- [ ] [WebPageTest](https://www.webpagetest.org/) — TTFB under 600ms
- [ ] Lighthouse — 90+ on Performance, 100 on SEO and Best Practices
- [ ] Test on a real mid-range Android device, not just desktop Chrome

---

## Pre-launch final pass

- [ ] All `REPLACE` comments in code resolved
- [ ] All Unsplash placeholders replaced with editorial photography
- [ ] OG image created and saved at `/assets/img/og/og-default.jpg`
- [ ] Favicon set generated and dropped in `/assets/icons/`
- [ ] Privacy Policy and Imprint pages live (German law requires Impressum)
- [ ] Cookie consent banner if any analytics are used (German GDPR compliance)
- [ ] Google Analytics / Plausible / Umami set up
- [ ] Domain DNS pointed correctly, HTTPS forced, HSTS header set
- [ ] 404 page styled
- [ ] Cross-browser test: Safari, Firefox, Chrome, mobile Safari, mobile Chrome
- [ ] Tested all `mailto:` and `tel:` links work
- [ ] Submitted to Search Console and verified ownership
- [ ] Backup strategy in place once WordPress is live
