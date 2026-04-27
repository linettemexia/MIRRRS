/* ============================================================
   forms.js — Form validation scaffold
   Currently no live form on the home page.
   This module is ready for /pages/contact.html or an apply form
   inside the video modal.
   ============================================================ */

/**
 * Initialise validation on all forms tagged with `data-validate`.
 * Each <input>/<textarea>/<select> can declare:
 *   required           — must not be empty
 *   data-min-length    — minimum string length
 *   data-pattern       — RegExp the value must match
 *   data-error         — custom error message
 *
 * The wrapping `.form-field` element gets `.has-error` and an
 * adjacent `.form-error` paragraph is created/updated.
 */
export function initForms() {
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(setupForm);
}

function setupForm(form) {
  form.setAttribute('novalidate', 'novalidate');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      // ─────────────────────────────────────────────────────────
      // REPLACE: point this to your real endpoint
      // (Formspree, Basin, your own API, or WP REST endpoint)
      // ─────────────────────────────────────────────────────────
      const endpoint = form.action || '/api/contact';

      const data = new FormData(form);
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        showSuccess(form);
        form.reset();
      } else {
        showServerError(form);
      }
    } catch (err) {
      console.error(err);
      showServerError(form);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  // Live validation — clear error on input
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => clearFieldError(field));
  });
}

function validateForm(form) {
  let valid = true;
  const fields = form.querySelectorAll('input, textarea, select');

  fields.forEach(field => {
    if (!validateField(field)) valid = false;
  });

  return valid;
}

function validateField(field) {
  const value = (field.value || '').trim();
  const wrap  = field.closest('.form-field') || field.parentElement;

  // Required
  if (field.hasAttribute('required') && !value) {
    setFieldError(wrap, field.dataset.error || 'This field is required.');
    return false;
  }

  // Min length
  const minLen = field.dataset.minLength;
  if (minLen && value.length < parseInt(minLen, 10)) {
    setFieldError(wrap, `Please enter at least ${minLen} characters.`);
    return false;
  }

  // Pattern (e.g., simple email check)
  if (field.dataset.pattern) {
    const re = new RegExp(field.dataset.pattern);
    if (!re.test(value)) {
      setFieldError(wrap, field.dataset.error || 'Invalid format.');
      return false;
    }
  }

  // Native email type
  if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    setFieldError(wrap, 'Please enter a valid email.');
    return false;
  }

  clearFieldError(field);
  return true;
}

function setFieldError(wrap, message) {
  if (!wrap) return;
  wrap.classList.add('has-error');
  let err = wrap.querySelector('.form-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error';
    wrap.appendChild(err);
  }
  err.textContent = message;
}

function clearFieldError(field) {
  const wrap = field.closest('.form-field') || field.parentElement;
  if (!wrap) return;
  wrap.classList.remove('has-error');
  const err = wrap.querySelector('.form-error');
  if (err) err.remove();
}

function showSuccess(form) {
  const success = document.createElement('div');
  success.className = 'form-success';
  success.setAttribute('role', 'status');
  success.textContent = 'Thank you. We will be in touch.';
  form.replaceWith(success);
}

function showServerError(form) {
  let banner = form.querySelector('.form-error.is-banner');
  if (!banner) {
    banner = document.createElement('p');
    banner.className = 'form-error is-banner';
    banner.setAttribute('role', 'alert');
    form.prepend(banner);
  }
  banner.textContent = 'Something went wrong. Please try again or email us directly.';
}
