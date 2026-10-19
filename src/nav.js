import { prefersReducedMotion } from './utils.js';

export function initNav(lenis) {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('site-nav');

  function setOpen(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
  }

  toggle?.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!menu || !toggle) return;
    if (toggle.contains(event.target) || menu.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    setOpen(false);

    if (lenis) {
      lenis.scrollTo(target);
    } else {
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    }

    history.pushState(null, '', hash);
  });

  if (location.hash && lenis) {
    const target = document.querySelector(location.hash);
    if (target) lenis.scrollTo(target, { immediate: true });
  }
}
