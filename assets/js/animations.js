/* ============================================================
   animations.js — Visual animations
   - Word-by-word headline reveal
   - IntersectionObserver scroll reveal
   - Lazy image fade-in
   - Respects prefers-reduced-motion
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Build the animated hero headline.
 * Reads lines from a `data-headline` attribute on the host element,
 * or falls back to the default Mirrrs lines.
 *
 * Markup expectation:
 *   <h1 class="hero-headline" id="headline"></h1>
 */
export function initHeadline() {
  const headline = document.getElementById('headline');
  if (!headline) return;

  // Default lines — change here or pass via data attribute
  const defaultLines = [
    { text: 'We discover', italic: false },
    { text: 'talent.',     italic: false },
    { text: 'We build',    italic: true  },
    { text: 'careers.',    italic: true  },
  ];

  // Allow overriding via JSON in a data attribute:
  //   <h1 data-lines='[{"text":"...","italic":false}, ...]'>
  let lines = defaultLines;
  if (headline.dataset.lines) {
    try { lines = JSON.parse(headline.dataset.lines); }
    catch (e) { console.warn('Invalid headline data-lines JSON, using defaults'); }
  }

  // If reduced motion is preferred, just print the lines flat
  if (prefersReducedMotion) {
    headline.innerHTML = lines.map(l => {
      const tag = l.italic ? 'em' : 'span';
      return `<div><${tag}>${l.text}</${tag}></div>`;
    }).join('');
    return;
  }

  let delay = 0;
  lines.forEach(line => {
    const lineEl = document.createElement('div');
    lineEl.style.cssText = 'overflow:hidden; display:block;';
    const words = line.text.split(' ');
    words.forEach((word, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'word-wrap';
      const span = document.createElement('span');
      span.className = 'word';
      span.style.animationDelay = delay + 's';
      span.textContent = word;
      if (line.italic) {
        span.style.fontStyle = 'italic';
        span.style.color = '#999';
      }
      wrap.appendChild(span);
      lineEl.appendChild(wrap);
      if (i < words.length - 1) lineEl.appendChild(document.createTextNode('\u00A0'));
      delay += 0.1;
    });
    headline.appendChild(lineEl);
  });
}

/**
 * Reveal elements as they scroll into view.
 * Add `class="reveal"` to anything you want animated.
 */
export function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));

  // Force-show hero items shortly after load (they're above the fold
  // and headline animation is already running).
  setTimeout(() => {
    document.querySelectorAll('.hero-bottom .reveal').forEach(el => el.classList.add('visible'));
  }, 1200);
}

/**
 * Fade-in images as they finish loading.
 * Pairs with the `img[loading="lazy"]` rule in utilities.css.
 */
export function initLazyImages() {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
    }
  });
}
