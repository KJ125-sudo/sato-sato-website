import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { canUseDesktopFx, prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const section = document.getElementById('hero');
  const can = document.getElementById('hero-can');
  const canStage = document.getElementById('hero-can-stage');
  const watermark = document.querySelector('.watermark');

  if (!section) return;

  const lines = section.querySelectorAll('.hero__line');

  if (!prefersReducedMotion()) {
    gsap.set(lines, { y: 28, opacity: 0 });
    if (can) gsap.set(can, { y: 40, opacity: 0, scale: 0.94 });

    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .to(lines, { y: 0, opacity: 1, duration: 0.75, stagger: 0.08 }, 0.1)
      .to(can, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 0.45);
  }

  if (can && canStage && canUseDesktopFx() && !prefersReducedMotion()) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    section.addEventListener('mousemove', (e) => {
      const rect = canStage.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ny = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      targetX = nx * 18;
      targetY = ny * 14;
    });

    section.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    gsap.ticker.add(() => {
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      canStage.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });
  }

  if (watermark && !prefersReducedMotion()) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        watermark.style.backgroundPosition = `center ${self.progress * 120}px`;
      },
    });
  }
}
