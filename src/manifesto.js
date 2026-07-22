import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger.js';
import { prefersReducedMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

export function initManifesto() {
  const pin = document.getElementById('manifesto-pin');
  const stage = document.getElementById('manifesto-stage');
  const lines = document.querySelectorAll('[data-manifesto-line]');
  const can = document.getElementById('manifesto-can');

  if (!pin || !stage || !lines.length) return;

  function showLine(index) {
    lines.forEach((line, i) => {
      const active = i === index;
      line.classList.toggle('is-active', active);
      if (!active) {
        line.style.opacity = '0';
        line.style.transform = 'translateY(20px)';
      }
    });
  }

  if (prefersReducedMotion()) {
    showLine(lines.length - 1);
    return;
  }

  ScrollTrigger.create({
    trigger: pin,
    start: 'top top',
    end: 'bottom bottom',
    pin: stage,
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress;
      const segment = 1 / lines.length;
      const index = Math.min(lines.length - 1, Math.floor(p / segment));
      const local = (p - index * segment) / segment;

      lines.forEach((line, i) => {
        if (i !== index) {
          line.classList.remove('is-active');
          line.style.opacity = '0';
          line.style.transform = 'translateY(20px)';
          return;
        }

        line.classList.add('is-active');
        const eased = gsap.utils.clamp(0, 1, local / 0.75);
        line.style.opacity = String(0.15 + eased * 0.85);
        line.style.transform = `translateY(${(1 - eased) * 20}px)`;
      });

      if (can) {
        can.style.transform = `translateY(${-p * 48}px) rotate(${-6 + p * 8}deg)`;
      }
    },
  });
}
