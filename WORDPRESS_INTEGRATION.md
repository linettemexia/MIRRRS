# WordPress Blog Integration Plan

> Strategy for adding WordPress to host the **Journal** without breaking the static site's design or SEO.

---

## 1. Where should WordPress live?

**Recommended: `/blog/` subdirectory**

| Option | Pros | Cons |
|---|---|---|
| `/blog/` subdirectory | Same domain — best for SEO; one cookie/auth scope; cleaner branding | Slightly trickier server setup (path routing) |
| `blog.mirrrs.com` subdomain | Easiest to host on a different server | Treated as a separate site for some SEO signals; CORS friction |
| Custom Journal in static site | Full control, no PHP | Manual to update; non-technical people can't post |

We recommend **`/blog/`** because the Journal is a content-marketing channel that should pass authority to the main domain.

---

## 2. URL structure

```
mirrrs.com/                  ← Static home (this codebase)
mirrrs.com/journal           ← Static landing page that *links to* WordPress
mirrrs.com/blog/             ← WordPress install (admin, posts, MediaSlide)
mirrrs.com/blog/journal/     ← WP archive of "Journal" category
mirrrs.com/blog/journal/:slug ← Single article
```

In WordPress, set **Permalinks → Custom**: `/journal/%postname%/`.
That way the public URL becomes `mirrrs.com/blog/journal/anneta-mango/` — clean and editorial.

If you want the WP install completely hidden behind `/journal/`, you can rewrite the URLs in `.htaccess` to drop the `/blog/` prefix from public-facing URLs. Discuss with your host first.

---

## 3. Visually consistent styling

WordPress will use a **child theme** that imports the same design tokens used by the static site:

```
/wp-content/themes/mirrrs-child/
├── style.css            ← imports our CSS
├── functions.php
├── front-page.php
├── archive-model.php    ← MediaSlide override
├── single-model.php     ← MediaSlide override
├── archive.php          ← Journal listing
├── single.php           ← Journal article
└── header.php / footer.php
```

`style.css` (top of file):

```css
/*
Theme Name: Mirrrs Child
Template: parent-theme-name
*/

@import url('https://mirrrs.com/assets/css/tokens.css');
@import url('https://mirrrs.com/assets/css/reset.css');
@import url('https://mirrrs.com/assets/css/base.css');
@import url('https://mirrrs.com/assets/css/components.css');
@import url('https://mirrrs.com/assets/css/pages.css');     /* .article styles live here */
@import url('https://mirrrs.com/assets/css/utilities.css');
@import url('https://mirrrs.com/assets/css/responsive.css');
```

Now any WP page automatically uses the same design system as the static site. Override WP-specific selectors as needed (e.g. `.wp-block-image`, `.wp-block-quote`).

### Shared header & footer

Recreate the static `<header class="nav">` and `<footer>` markup in `header.php` and `footer.php` of the child theme. The HTML is identical — same classes, same structure. This is the single biggest visual-consistency win.

---

## 4. Linking from the static site to WordPress

In the static `index.html`, all journal links already point to `/journal/...` URLs. Add an Apache/Nginx rewrite so `/journal/...` resolves to the WP install:

**Apache `.htaccess`** (in site root):

```apache
RewriteEngine On
RewriteRule ^journal/?$ /blog/journal/ [L]
RewriteRule ^journal/(.+)$ /blog/journal/$1 [L]
```

**Nginx**:

```nginx
location ~ ^/journal/?$       { return 301 /blog/journal/; }
location ~ ^/journal/(.+)$    { return 301 /blog/journal/$1; }
```

This way users and crawlers see a single clean `/journal/` URL space, and WP just powers the back-end.

---

## 5. SEO considerations (mixing static + WordPress)

1. **One canonical domain** — keep everything on `mirrrs.com`. No `www` redirects, one preferred domain in Search Console.
2. **One sitemap index** — when WP is up, WordPress will generate its own sitemap (Yoast / Rank Math do this). Update the root `sitemap.xml` to reference both:
   ```xml
   <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <sitemap><loc>https://mirrrs.com/sitemap-static.xml</loc></sitemap>
     <sitemap><loc>https://mirrrs.com/blog/sitemap_index.xml</loc></sitemap>
   </sitemapindex>
   ```
3. **Canonical tags** — every WP article must have a canonical pointing to itself.
4. **Schema markup** — install Yoast SEO or Rank Math; configure Article schema for journal posts and Person schema for model profiles.
5. **Open Graph** — the SEO plugin will handle this for WP pages; the static site's manual OG tags stay.
6. **No duplicate content** — never republish a journal article on the static side. Always link to WP.
7. **Robots** — `robots.txt` already disallows `/wp-admin/` and `/wp-login.php`.

---

## 6. Performance

WordPress is heavier than static HTML. Mitigate:

- **Caching plugin** — WP Rocket, W3 Total Cache, or a host-level Varnish layer.
- **Image optimisation** — enable WebP via Imagify or ShortPixel.
- **CDN** — put Cloudflare in front of the whole domain. CDN-cached HTML on WP is almost as fast as static.
- **Lazy load** — already enabled in WP core for images.

---

## 7. Tokens to share between systems

These CSS custom properties must remain identical in both the static site and the WP child theme:

- `--color-warm`, `--color-ink`, `--color-accent`
- `--font-serif`, `--font-sans`
- `--space-*` scale
- `--ease-out`, transition durations
- `--gutter`, `--max-width`

Because the child theme `@import`s `tokens.css` directly, you only ever change them in **one place**.

---

## 8. Rollout checklist

- [ ] Install WordPress in `/blog/`
- [ ] Install MediaSlide plugin
- [ ] Install Mirrrs child theme + `@import` shared CSS
- [ ] Recreate `header.php` / `footer.php` with the static markup
- [ ] Build `single.php` using `.article` styles (already in `pages.css`)
- [ ] Set Permalinks to `/journal/%postname%/`
- [ ] Add `.htaccess`/Nginx rewrite for `/journal/` → `/blog/journal/`
- [ ] Install Yoast SEO + configure Article schema
- [ ] Update sitemap index
- [ ] Add WP install to Google Search Console
- [ ] Test on staging before going live
