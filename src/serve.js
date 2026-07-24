import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initServe() {
  const section = document.getElementById('serve');
  if (!section || prefersReducedMotion()) return;

  const steps = section.querySelectorAll('.serve-step');

  ScrollTrigger.batch(steps, {
    start: 'top 88%',
    onEnter: (batch) => {
      gsap.fromTo(
        batch,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.12, ease: 'power2.out' },
      );
    },
    once: true,
  });
}
