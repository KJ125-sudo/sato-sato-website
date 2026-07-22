import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { initCursor } from './cursor.js';
import { initFind } from './find.js';
import { initHero } from './hero.js';
import { initLenis } from './lenis.js';
import { initMagnetic } from './magnetic.js';
import { initManifesto } from './manifesto.js';
import { initRange } from './range.js';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

function initNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('is-open');
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks?.classList.remove('is-open'));
  });
}

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
  initNav();
  initCursor();
  initMagnetic();
  initLenis();

  initHero();
  initManifesto();
  initRange();
  initFind();
  initReveals();

  ScrollTrigger.refresh();
}

boot();
