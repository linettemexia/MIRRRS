/* ============================================
   MIRRRS — Lightweight i18n (EN / DE)
   Adds a language toggle bound to .lang-switch
   buttons. Wraps any element with a data-i18n key
   and swaps its text on click. Use data-i18n-placeholder
   on inputs to translate the placeholder. Persists
   the choice in localStorage.
   ============================================ */

(function () {
  const DICT = {
    en: {
      'nav.models':       'Models',
      'nav.newsletter':   'Newsletter',
      'nav.about':        'About',
      'nav.contact':      'Contact',
      'nav.apply':        'Become a Model',

      'models.heading':   'Women',
      'models.loading':   'Loading…',

      'cat.main':         'Main',
      'cat.newFaces':     'New Faces',
      'cat.image':        'Image',

      'model.addToPackage': 'Add to package',
      'model.downloadPdf':  'Download PDF',
      'model.book':         'Book',
      'model.polaroids':    'Polaroids',

      'contact.heading':       'Contact',
      'contact.intro':         'For bookings and general enquiries.',
      'contact.address.title': 'Address',
      'contact.team.title':    'Team',
      'contact.role.director': 'Director & Owner',
      'contact.role.head':     'Head of Booking',
      'contact.role.booker':   'Booker',
      'contact.role.art':      'Art Department',

      /* ---- Apply page ---- */
      'apply.heading':       'Become a Model',
      'apply.intro':         'Fill in your details below. Our team reviews every application and replies as soon as possible.',
      'apply.personal':      'Personal',
      'apply.agency':        'Agency',
      'apply.gender':        'Gender',
      'apply.gender.female':    'Female',
      'apply.gender.male':      'Male',
      'apply.gender.nonBinary': 'Non-binary',
      'apply.gender.other':     'Other',
      'apply.firstName':     'First Name',
      'apply.lastName':      'Last Name',
      'apply.email':         'Email',
      'apply.phone':         'Phone',
      'apply.country':       'Country',
      'apply.city':          'City',
      'apply.birthDate':     'Birth date',
      'apply.details':       'Details',
      'apply.height':        'Height',
      'apply.images':        'Images',
      'apply.images.intro':  'Please upload up to 3 images (Max. 5mb each).',
      'apply.images.guideTitle': 'GUIDE FOR IMAGES',
      'apply.images.guide1': 'Please submit a full-length, close-up, and profile.',
      'apply.images.guide2': 'Do not wear makeup',
      'apply.images.guide3': 'Take images in front facing natural daylight',
      'apply.images.guide4': 'Clean and simple images are best',
      'apply.upload':        'Upload',
      'apply.social':        'Social',
      'apply.instagram':     'Instagram (Optional)',
      'apply.tiktok':        'TikTok (Optional)',
      'apply.terms':         'Terms',
      'apply.terms1':        'I read and I accept the Information to the Applicant.',
      'apply.terms1.link':   'INFORMATION TO THE APPLICANT',
      'apply.terms2':        'I understand and agree that, upon my acceptance (that is not compulsory) you will also send me information by email and/or SMS about existing and new services and special offers.',
      'apply.terms3':        'I understand and agree that upon my acceptance (that is not compulsory) you will be entitled to transfer my data to third parties with whom you have a contractual relationship (partners, sponsors …) so that I may receive special offers and other information from them.',
      'apply.submit':        'Submit Application',

      'footer.copy':         '© 2026 — All rights reserved'
    },
    de: {
      'nav.models':       'Models',
      'nav.newsletter':   'Newsletter',
      'nav.about':        'Über uns',
      'nav.contact':      'Kontakt',
      'nav.apply':        'Model werden',

      'models.heading':   'Frauen',
      'models.loading':   'Wird geladen…',

      'cat.main':         'Main',
      'cat.newFaces':     'New Faces',
      'cat.image':        'Image',

      'model.addToPackage': 'Zum Paket hinzufügen',
      'model.downloadPdf':  'PDF herunterladen',
      'model.book':         'Book',
      'model.polaroids':    'Polaroids',

      'contact.heading':       'Kontakt',
      'contact.intro':         'Für Buchungen und allgemeine Anfragen.',
      'contact.address.title': 'Adresse',
      'contact.team.title':    'Team',
      'contact.role.director': 'Direktorin & Inhaberin',
      'contact.role.head':     'Leitung Booking',
      'contact.role.booker':   'Booker',
      'contact.role.art':      'Art Department',

      /* ---- Apply page ---- */
      'apply.heading':       'Model werden',
      'apply.intro':         'Füllen Sie das Formular aus. Unser Team prüft jede Bewerbung und antwortet so schnell wie möglich.',
      'apply.personal':      'Persönlich',
      'apply.agency':        'Agentur',
      'apply.gender':        'Geschlecht',
      'apply.gender.female':    'Weiblich',
      'apply.gender.male':      'Männlich',
      'apply.gender.nonBinary': 'Non-binär',
      'apply.gender.other':     'Andere',
      'apply.firstName':     'Vorname',
      'apply.lastName':      'Nachname',
      'apply.email':         'E-Mail',
      'apply.phone':         'Telefon',
      'apply.country':       'Land',
      'apply.city':          'Stadt',
      'apply.birthDate':     'Geburtsdatum',
      'apply.details':       'Details',
      'apply.height':        'Größe',
      'apply.images':        'Bilder',
      'apply.images.intro':  'Bitte laden Sie bis zu 3 Bilder hoch (max. 5 MB pro Bild).',
      'apply.images.guideTitle': 'BILDRICHTLINIEN',
      'apply.images.guide1': 'Bitte ein Ganzkörperbild, eine Nahaufnahme und ein Profilfoto einreichen.',
      'apply.images.guide2': 'Kein Make-up tragen',
      'apply.images.guide3': 'Bilder bei natürlichem Tageslicht, frontal aufnehmen',
      'apply.images.guide4': 'Klare und einfache Bilder funktionieren am besten',
      'apply.upload':        'Hochladen',
      'apply.social':        'Social Media',
      'apply.instagram':     'Instagram (optional)',
      'apply.tiktok':        'TikTok (optional)',
      'apply.terms':         'Bedingungen',
      'apply.terms1':        'Ich habe die Informationen für Bewerber gelesen und akzeptiere sie.',
      'apply.terms1.link':   'INFORMATIONEN FÜR BEWERBER',
      'apply.terms2':        'Ich verstehe und stimme zu, dass Sie mir nach meiner (nicht verpflichtenden) Annahme per E-Mail und/oder SMS Informationen über bestehende und neue Dienste sowie Sonderangebote senden.',
      'apply.terms3':        'Ich verstehe und stimme zu, dass Sie nach meiner (nicht verpflichtenden) Annahme berechtigt sind, meine Daten an Dritte weiterzugeben, mit denen Sie in einem Vertragsverhältnis stehen (Partner, Sponsoren …), damit ich von ihnen Sonderangebote und weitere Informationen erhalten kann.',
      'apply.submit':        'Bewerbung absenden',

      'footer.copy':         '© 2026 — Alle Rechte vorbehalten'
    }
  };

  const STORAGE_KEY = 'mirrrs.lang';

  function apply(lang) {
    const d = DICT[lang] || DICT.en;
    document.documentElement.lang = lang;

    /* textContent translations */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (d[key] != null) el.textContent = d[key];
    });

    /* placeholder translations */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (d[key] != null) el.setAttribute('placeholder', d[key]);
    });

    /* highlight active button */
    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.lang === lang);
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  function init() {
    let saved = 'en';
    try { saved = localStorage.getItem(STORAGE_KEY) || 'en'; } catch (_) {}
    apply(saved);

    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.addEventListener('click', () => apply(b.dataset.lang));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
