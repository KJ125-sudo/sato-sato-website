import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { canUseDesktopFx, prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const section = document.getElementById('hero');
  const wordmark = document.getElementById('hero-wordmark');
  const cloudsInner = document.getElementById('hero-clouds-inner');
  const landscape = document.getElementById('hero-landscape');

  if (!section) return;

  if (!prefersReducedMotion()) {
    if (wordmark) {
      gsap.fromTo(wordmark, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.15 });
    }

    if (cloudsInner) {
      gsap.to(cloudsInner, {
        x: '-50%',
        duration: 60,
        repeat: -1,
        ease: 'none',
      });
    }

    if (landscape) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
        onUpdate: (self) => {
          landscape.style.transform = `translateY(${self.progress * 20}px)`;
        },
      });
    }
  }

  if (canUseDesktopFx() && !prefersReducedMotion() && wordmark) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = nx * 16;
      targetY = ny * 10;
    });

    section.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    gsap.ticker.add(() => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      wordmark.style.translate = `${currentX * 0.2}px ${currentY * 0.12}px`;
    });
  }
}
