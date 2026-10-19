import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { prefersReducedMotion } from './utils.js';
import { PLACES } from './places.js';
import { VENUES, renderVenueGroups } from './venues.js';

gsap.registerPlugin(ScrollTrigger);

export function initFind() {
  const container = document.getElementById('venues');
  if (!container) return;

  const photographed = new Set(PLACES.map((place) => place.venueName).filter(Boolean));
  const rest = VENUES.filter((venue) => !photographed.has(venue.name));
  container.innerHTML = renderVenueGroups(PLACES, rest);

  const venues = container.querySelectorAll('.venue');

  if (!venues.length || prefersReducedMotion()) {
    venues.forEach((v) => v.classList.add('is-visible'));
    return;
  }

  ScrollTrigger.batch(venues, {
    start: 'top 92%',
    onEnter: (batch) => {
      gsap.fromTo(
        batch,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
      );
    },
    once: true,
  });
}
