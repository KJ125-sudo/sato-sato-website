import { track } from './analytics.js';
import { CONTACT_EMAIL } from './site.js';

const FIELDS = [
  ['stock-name', 'name'],
  ['stock-venue', 'venue'],
  ['stock-city', 'city'],
  ['stock-message', 'message'],
];

export function initStockForm() {
  const form = document.getElementById('trade');
  if (!form) return;

  const error = document.getElementById('stock-error');
  const status = document.getElementById('stock-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const missing = [];
    const values = {};

    FIELDS.forEach(([id, key]) => {
      const input = document.getElementById(id);
      const value = input?.value.trim() ?? '';
      values[key] = value;
      const invalid = value.length === 0;
      input?.setAttribute('aria-invalid', invalid ? 'true' : 'false');
      if (invalid) missing.push(input?.labels?.[0]?.textContent || key);
    });

    if (missing.length) {
      if (error) {
        error.hidden = false;
        error.textContent = 'Add your name, venue, city, and message.';
      }
      if (status) status.textContent = '';
      document.getElementById(FIELDS.find(([id]) => document.getElementById(id)?.getAttribute('aria-invalid') === 'true')?.[0])?.focus();
      return;
    }

    if (error) {
      error.hidden = true;
      error.textContent = '';
    }

    const subject = `Stock enquiry from ${values.name}`;
    const body = `Name: ${values.name}\nVenue: ${values.venue}\nCity: ${values.city}\n\n${values.message}`;
    track('stock_enquiry');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (status) {
      status.textContent = `Your email app should open with this enquiry. If it does not, write to ${CONTACT_EMAIL}.`;
    }
  });
}
