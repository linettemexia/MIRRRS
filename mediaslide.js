/* ============================================================
   MIRRRS Models — Local Data Layer
   ------------------------------------------------------------
   MediaSlide is not yet connected. All model data is managed
   here locally. When MediaSlide is ready, swap this file out.

   HOW TO ADD / EDIT A MODEL:
   - Add an entry to the MODELS array below
   - Put the model's images in: images/{slug}/
       book/      → editorial photos  (1.jpg, 2.jpg …)
       polaroids/ → polaroid photos   (1.jpg, 2.jpg …)
   - thumbnail is auto-set to book/1.jpg

   CATEGORIES: 'main' | 'new-faces' | 'image'
   ============================================================ */

const MODELS = [

  /* ── MAIN ─────────────────────────────────── */
  {
    slug: 'agnes-abma', name: 'Agnes Abma',
    division: 'women', category: 'main',
    instagram: 'https://www.instagram.com/agnesabma',
    stats: {
      height: "179 cm / 5'10½\"", bust: '83 cm / 32½"',
      waist: '62 cm / 24½"', hips: '90 cm / 35½"',
      shoes: '40 EU / 9 US / 7 UK', dress: '36 EU / 6 US / 8 UK',
      hair: 'Vinyl Blond · Curly', eyes: 'Blue',
    },
    bookCount: 20, polaroidCount: 6,
  },
  { slug: 'agustina-sposato', name: 'Agustina Sposato', division: 'women', category: 'main', instagram: null, stats: { height: "175 cm / 5'9\"", bust: '82 cm', waist: '60 cm', hips: '89 cm', shoes: '39 EU', hair: 'Brown', eyes: 'Brown' }, bookCount: 0, polaroidCount: 0 },
  { slug: 'aida-abdullina', name: 'Aida Abdullina', division: 'women', category: 'main', instagram: null, stats: { height: "178 cm / 5'10\"", bust: '82 cm', waist: '61 cm', hips: '89 cm', shoes: '40 EU', hair: 'Brown', eyes: 'Brown' }, bookCount: 0, polaroidCount: 0 },
  { slug: 'aksharaa-jandhyala', name: 'Aksharaa Jandhyala', division: 'women', category: 'main', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'alba-novak', name: 'Alba Novak', division: 'women', category: 'main', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'amelie-rousseau', name: 'Amélie Rousseau', division: 'women', category: 'main', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'anouk-de-vries', name: 'Anouk de Vries', division: 'women', category: 'main', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'ayame-tanaka', name: 'Ayame Tanaka', division: 'women', category: 'main', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },

  /* ── NEW FACES ────────────────────────────── */
  { slug: 'alejandra-diaz-marriaga', name: 'Alejandra Diaz Marriaga', division: 'women', category: 'new-faces', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'alexia-kordas', name: 'Alexia Kordas', division: 'women', category: 'new-faces', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'aliyah-bartels', name: 'Aliyah Bartels', division: 'women', category: 'new-faces', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'axelle-rignodji', name: 'Axelle Rignodji', division: 'women', category: 'new-faces', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'bea-lindqvist', name: 'Bea Lindqvist', division: 'women', category: 'new-faces', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'clara-moreau', name: 'Clara Moreau', division: 'women', category: 'new-faces', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'daria-volkov', name: 'Daria Volkov', division: 'women', category: 'new-faces', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'eva-bauer', name: 'Eva Bauer', division: 'women', category: 'new-faces', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },

  /* ── IMAGE ────────────────────────────────── */
  { slug: 'aditsa-berzeniia', name: 'Aditsa Berzeniia', division: 'women', category: 'image', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'akolde-meen', name: 'Akolde Meen', division: 'women', category: 'image', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'anyiel-majok', name: 'Anyiel Majok', division: 'women', category: 'image', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'athiec-geng', name: 'Athiec Geng', division: 'women', category: 'image', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'iman-osei', name: 'Iman Osei', division: 'women', category: 'image', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
  { slug: 'lior-mizrahi', name: 'Lior Mizrahi', division: 'women', category: 'image', instagram: null, stats: {}, bookCount: 0, polaroidCount: 0 },
];

/* ── Image path helpers ───────────────────────────────────── */

function thumbnailFor(m) {
  return m.bookCount > 0 ? `images/${m.slug}/book/1.jpg` : null;
}

function bookImagesFor(m) {
  return Array.from({ length: m.bookCount }, (_, i) =>
    `images/${m.slug}/book/${i + 1}.jpg`
  );
}

function polaroidImagesFor(m) {
  return Array.from({ length: m.polaroidCount }, (_, i) =>
    `images/${m.slug}/polaroids/${i + 1}.jpg`
  );
}

/* ── Public API (same interface the pages already use) ─────── */

async function fetchModels(division) {
  division = division || 'women';
  return MODELS
    .filter(m => m.division === division)
    .map(m => ({ ...m, thumbnail: thumbnailFor(m) }));
}

async function fetchModel(slug) {
  const m = MODELS.find(m => m.slug === slug);
  if (!m) throw new Error('Model not found: ' + slug);
  return {
    ...m,
    thumbnail: thumbnailFor(m),
    book:      bookImagesFor(m),
    polaroids: polaroidImagesFor(m),
  };
}

window.MIRRRS = { fetchModels, fetchModel };
