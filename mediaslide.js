/* ============================================================
   MIRRRS Models — MediaSlide integration
   ------------------------------------------------------------
   This is the ONLY file that talks to MediaSlide. The pages
   call window.MIRRRS.fetchModels() and window.MIRRRS.fetchModel(slug).

   While CONFIG.demo === true, the site uses the local DEMO_MODELS
   below (placeholder names + placeholder photos) so you can develop
   the layout without hitting MediaSlide.

   To go live:
     1. Set CONFIG.demo = false
     2. Fill in CONFIG.baseUrl with your MediaSlide URL
     3. (Optional) Fill in CONFIG.apiKey if MediaSlide requires auth
     4. Confirm that fetchModelsLive() and fetchModelLive() URLs
        match what MediaSlide gives you in their docs, and tweak
        normalizeModel() to match the field names in their response.
   ============================================================ */

const CONFIG = {
  // ---- DEMO MODE ----
  demo: true,

  // ---- MEDIASLIDE ----
  // Ask MediaSlide support for:
  //   - Your API base URL  (e.g. https://mirrrs.mediaslide.com)
  //   - Whether your plan exposes the public roster via API
  //   - An API key, if their endpoint requires Authorization
  baseUrl: '',          // e.g. 'https://mirrrs.mediaslide.com'
  apiKey:  '',          // optional, paste the key if needed

  // Which division (board) the public site shows by default.
  // Match the slug of one of your divisions in MediaSlide.
  defaultDivision: 'women',
};

/* =============================================================
   PUBLIC API — what the HTML pages call
   ============================================================= */

async function fetchModels(division) {
  division = division || CONFIG.defaultDivision;
  if (CONFIG.demo) return DEMO_MODELS.filter(m => !m.division || m.division === division);
  return fetchModelsLive(division);
}

async function fetchModel(slug) {
  if (CONFIG.demo) return DEMO_MODELS.find(m => m.slug === slug) || DEMO_MODELS[0];
  return fetchModelLive(slug);
}

/* =============================================================
   LIVE CALLS — wire these once we have MediaSlide credentials
   ============================================================= */

async function fetchModelsLive(division) {
  // TODO — confirm the actual endpoint with MediaSlide. Most likely:
  //   GET {baseUrl}/api/v1/divisions/{division}/models
  const url = `${CONFIG.baseUrl}/api/v1/divisions/${encodeURIComponent(division)}/models`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`MediaSlide ${res.status}`);
  const raw = await res.json();
  return (Array.isArray(raw) ? raw : raw.models || []).map(normalizeModel);
}

async function fetchModelLive(slug) {
  // TODO — confirm with MediaSlide. Most likely:
  //   GET {baseUrl}/api/v1/models/{slug}
  const url = `${CONFIG.baseUrl}/api/v1/models/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`MediaSlide ${res.status}`);
  return normalizeModel(await res.json());
}

function authHeaders() {
  const h = { 'Accept': 'application/json' };
  if (CONFIG.apiKey) h['Authorization'] = 'Bearer ' + CONFIG.apiKey;
  return h;
}

/* =============================================================
   NORMALIZER — turns MediaSlide's response into our shape.
   Tweak the field names once we see one real response.
   ============================================================= */

function normalizeModel(raw) {
  return {
    slug:      raw.slug || raw.id || raw.url_slug,
    name:      raw.name || [raw.first_name, raw.last_name].filter(Boolean).join(' '),
    division:  raw.division || raw.board,
    category:  raw.category || raw.board_section || 'main',
    thumbnail: raw.thumbnail_url || raw.cover || (raw.book_images && raw.book_images[0] && raw.book_images[0].url),
    stats: {
      height: raw.height,
      bust:   raw.bust   || raw.chest,
      waist:  raw.waist,
      hips:   raw.hips,
      shoes:  raw.shoes  || raw.shoe_size,
      hair:   raw.hair   || raw.hair_color,
      eyes:   raw.eyes   || raw.eye_color,
    },
    book:       (raw.book_images || raw.book || []).map(pickUrl),
    polaroids:  (raw.polaroid_images || raw.polaroids || []).map(pickUrl),
  };
}

function pickUrl(item) {
  return typeof item === 'string' ? item : (item.url || item.src || item.image_url);
}

/* =============================================================
   DEMO DATA — only used while CONFIG.demo === true
   ============================================================= */

/* a small palette of muted editorial tones, rotated through the demo */
const TONES = [
  { bg: 'EDE6DC', fg: '6E5C44' }, // sand
  { bg: 'D9D4CC', fg: '5A554D' }, // dust
  { bg: 'C8C2BB', fg: '4F4842' }, // stone
  { bg: 'E8E2DA', fg: '52443A' }, // cream
  { bg: '1A1A1A', fg: 'EAEAEA' }, // black
  { bg: '2A2A2A', fg: 'D9D4CC' }, // charcoal
  { bg: 'F4F0EA', fg: '8C7B66' }, // bone
  { bg: 'B5ADA1', fg: '2A2520' }, // taupe
];

function makeDemo(slug, name, category, toneIndex) {
  const t   = TONES[toneIndex % TONES.length];
  const alt = TONES[(toneIndex + 3) % TONES.length];

  return {
    slug, name, division: 'women', category,
    thumbnail: `https://placehold.co/600x800/${t.bg}/${t.fg}?font=playfair&text=${encodeURIComponent(name)}`,
    stats: {
      height: '178 cm / 5\'10"',
      bust:   '82 cm',
      waist:  '61 cm',
      hips:   '89 cm',
      shoes:  '40 EU',
      hair:   'Brown',
      eyes:   'Brown',
    },
    book: Array.from({ length: 8 }, (_, i) =>
      `https://placehold.co/1200x1800/${i % 2 ? alt.bg : t.bg}/${i % 2 ? alt.fg : t.fg}?font=playfair&text=${encodeURIComponent(name)}+%2F+0${i + 1}`
    ),
    polaroids: Array.from({ length: 6 }, (_, i) =>
      `https://placehold.co/800x1067/${i % 2 ? alt.bg : t.bg}/${i % 2 ? alt.fg : t.fg}?font=playfair&text=Polaroid+0${i + 1}`
    ),
  };
}

const DEMO_MODELS = [
  // ---- MAIN ----
  makeDemo('agnes-abma',          'Agnes Abma',          'main', 0),
  makeDemo('agustina-sposato',    'Agustina Sposato',    'main', 1),
  makeDemo('aida-abdullina',      'Aida Abdullina',      'main', 2),
  makeDemo('aksharaa-jandhyala',  'Aksharaa Jandhyala',  'main', 3),
  makeDemo('alba-novak',          'Alba Novak',          'main', 6),
  makeDemo('amelie-rousseau',     'Amélie Rousseau',     'main', 7),
  makeDemo('anouk-de-vries',      'Anouk de Vries',      'main', 0),
  makeDemo('ayame-tanaka',        'Ayame Tanaka',        'main', 1),

  // ---- NEW FACES ----
  makeDemo('alejandra-diaz-marriaga', 'Alejandra Diaz Marriaga', 'new-faces', 2),
  makeDemo('alexia-kordas',           'Alexia Kordas',           'new-faces', 3),
  makeDemo('aliyah-bartels',          'Aliyah Bartels',          'new-faces', 6),
  makeDemo('axelle-rignodji',         'Axelle Rignodji',         'new-faces', 7),
  makeDemo('bea-lindqvist',           'Bea Lindqvist',           'new-faces', 0),
  makeDemo('clara-moreau',            'Clara Moreau',            'new-faces', 1),
  makeDemo('daria-volkov',            'Daria Volkov',            'new-faces', 2),
  makeDemo('eva-bauer',               'Eva Bauer',               'new-faces', 3),

  // ---- IMAGE (mostly black & white tones) ----
  makeDemo('aditsa-berzeniia', 'Aditsa Berzeniia', 'image', 4),
  makeDemo('akolde-meen',      'Akolde Meen',      'image', 5),
  makeDemo('anyiel-majok',     'Anyiel Majok',     'image', 4),
  makeDemo('athiec-geng',      'Athiec Geng',      'image', 5),
  makeDemo('iman-osei',        'Iman Osei',        'image', 4),
  makeDemo('lior-mizrahi',     'Lior Mizrahi',     'image', 5),
];

/* =============================================================
   EXPORTS
   ============================================================= */

window.MIRRRS = { fetchModels, fetchModel, config: CONFIG };
