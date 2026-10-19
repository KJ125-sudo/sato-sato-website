import { SOCIAL_LINKS } from './site.js';

const ICONS = {
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  line: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s5.9-3.5 8-6C21.4 14.2 22 12.7 22 11c0-4.4-4.5-8-10-8z"/></svg>`,
};

export function initSocial() {
  const section = document.getElementById('social');
  if (!section) return;

  const links = SOCIAL_LINKS.filter((item) => item.href.trim());
  if (!links.length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  section.innerHTML = `
    <div class="section__inner follow">
      <div class="follow__copy">
        <p class="eyebrow">Follow</p>
        <p class="follow__handle">@satosatobkk</p>
      </div>
      <div class="follow__links">
        ${links
          .map(
            (item) => `
          <a class="btn btn--pill follow__link" href="${item.href}" target="_blank" rel="noopener noreferrer" data-track="social_${item.id}">
            ${ICONS[item.id] || ''}
            <span>${item.label}</span>
          </a>`,
          )
          .join('')}
      </div>
    </div>
  `;
}
