import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { initAgeGate } from './age-gate.js';
import { initAnalytics } from './analytics.js';
import { initOriginButtons } from './origin-button.js';
import { initCanBubbles } from './can-bubbles.js';
import { initCursor } from './cursor.js';
import { initOut } from './events.js';
import { initFind } from './find.js';
import { initHero } from './hero.js';
import { initLenis } from './lenis.js';
import { initMagnetic } from './magnetic.js';
import { initManifesto } from './manifesto.js';
import { initNav } from './nav.js';
import { initRange } from './range.js';
import { initServe } from './serve.js';
import { initSocial } from './social.js';
import { initStockForm } from './stock-form.js';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

function initReveals() {
  if (prefersReducedMotion()) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

async function boot() {
  initAnalytics();
  initCursor();
  initMagnetic();
  const lenis = initLenis();
  initNav(lenis);
  initOriginButtons();

  if (!prefersReducedMotion()) {
    requestAnimationFrame(() => {
      initCanBubbles();
    });
  }

  initHero();
  initManifesto();
  initRange();
  initServe();
  initSocial();
  initOut();
  initFind();
  initStockForm();
  initReveals();

  ScrollTrigger.refresh();
}

initAgeGate(boot);
