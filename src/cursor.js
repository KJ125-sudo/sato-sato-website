import { canUseDesktopFx } from './utils.js';

export function initCursor() {
  if (!canUseDesktopFx()) return;

  document.body.classList.add('has-custom-cursor');

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  // Difference blend reads cream on blue, inverts on light surfaces
  ring.style.mixBlendMode = 'difference';
  dot.style.mixBlendMode = 'difference';

  document.body.append(ring, dot);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;
  let dx = mx;
  let dy = my;
  let hovering = false;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  document.querySelectorAll('a, button, .magnetic, .range-pill').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      hovering = true;
      ring.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      hovering = false;
      ring.classList.remove('is-hover');
    });
  });

  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dx += (mx - dx) * 0.35;
    dy += (my - dy) * 0.35;

    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    dot.style.transform = `translate(${dx}px, ${dy}px)`;
    requestAnimationFrame(tick);
  }

  tick();
}
