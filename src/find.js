import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { prefersReducedMotion } from './utils.js';
import { VENUES, renderVenueCard } from './venues.js';

gsap.registerPlugin(ScrollTrigger);

export function initFind() {
  const container = document.getElementById('venues');

  if (container) {
    container.innerHTML = VENUES.map(renderVenueCard).join('');
  }

  const venues = document.querySelectorAll('.venue');

  if (!venues.length || prefersReducedMotion()) {
    venues.forEach((v) => v.classList.add('is-visible'));
    return;
  }

  ScrollTrigger.batch(venues, {
    start: 'top 88%',
    onEnter: (batch) => {
      gsap.fromTo(
        batch,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power2.out' },
      );
    },
    once: true,
  });
}
