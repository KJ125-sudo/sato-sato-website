import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import Lenis from 'lenis';
import { prefersReducedMotion } from './utils.js';

export function initLenis() {
  if (prefersReducedMotion()) return null;

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
