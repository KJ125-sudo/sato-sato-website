import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

const FLAVOURS = [
  {
    id: 'original',
    name: 'Original',
    image: '/images/can-range-original.png',
    accent: '#fafaf5',
    badge: 'Hero',
  },
  {
    id: 'lime',
    name: 'Lime',
    image: '/images/can-range-lime.png',
    accent: '#9fd8a8',
    badge: 'Citrus',
  },
  {
    id: 'cantaloupe',
    name: 'Cantaloupe',
    image: '/images/can-range-cantaloupe.png',
    accent: '#f0c888',
    badge: 'Fruit',
  },
  {
    id: 'krajiab',
    name: 'Krajiab',
    image: '/images/can-range-krajiab.png',
    accent: '#e8a0b8',
    badge: 'Floral',
  },
];

export function initRange() {
  const section = document.getElementById('range');
  const canImg = document.getElementById('range-can');
  const nameEl = document.getElementById('range-name');
  const badgeEl = document.getElementById('range-badge');
  const pills = document.querySelectorAll('[data-range-pill]');
  const thumbs = document.querySelectorAll('[data-range-thumb]');

  if (!section || !canImg) return;

  function setFlavour(id) {
    const flavour = FLAVOURS.find((f) => f.id === id) ?? FLAVOURS[0];

    canImg.src = flavour.image;
    canImg.alt = `Sato Sato ${flavour.name}`;
    if (nameEl) nameEl.textContent = flavour.name;
    if (badgeEl) {
      badgeEl.textContent = flavour.badge;
      badgeEl.style.background = flavour.accent;
    }

    section.style.setProperty('--range-accent', flavour.accent);

    pills.forEach((pill) => {
      pill.classList.toggle('is-active', pill.dataset.rangePill === id);
    });
    thumbs.forEach((thumb) => {
      thumb.classList.toggle('is-active', thumb.dataset.rangeThumb === id);
    });
  }

  pills.forEach((pill) => {
    pill.addEventListener('click', () => setFlavour(pill.dataset.rangePill));
    pill.addEventListener('mouseenter', () => setFlavour(pill.dataset.rangePill));
  });

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => setFlavour(thumb.dataset.rangeThumb));
  });

  setFlavour('original');

  const watermark = section.querySelector('.section-watermark');

  if (!prefersReducedMotion()) {
    if (watermark) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          watermark.style.backgroundPosition = `center ${self.progress * 120}px`;
        },
      });
    }

    const thumbsWrap = section.querySelector('.range-thumbs');
    if (thumbsWrap) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          const drift = Math.sin(self.progress * Math.PI * 2) * 6;
          thumbsWrap.style.transform = `translateX(${drift}px)`;
        },
      });
    }
  }
}
