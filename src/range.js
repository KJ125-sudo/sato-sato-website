import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { renderProductGrid } from './products.js';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initRange() {
  const section = document.getElementById('range');
  const grid = document.getElementById('product-grid');

  if (!section || !grid) return;

  renderProductGrid(grid);

  grid.querySelectorAll('.product-card__can').forEach((img) => {
    const redesignSrc = img.dataset.productSrc;
    if (!redesignSrc) return;

    const test = new Image();
    test.onload = () => { img.src = redesignSrc; };
    test.onerror = () => {};
    test.src = redesignSrc;
  });

  if (prefersReducedMotion()) return;

  const cards = grid.querySelectorAll('.product-card');

  ScrollTrigger.batch(cards, {
    start: 'top 90%',
    onEnter: (batch) => {
      gsap.fromTo(
        batch,
        { y: 32, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      );
    },
    once: true,
  });
}
