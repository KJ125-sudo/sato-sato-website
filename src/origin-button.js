import { canUseDesktopFx } from './utils.js';

const FILL_DURATION_MS = 500;
const FILL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function getCoverDiameter(width, height, x, y) {
  return Math.ceil(
    2
    * Math.max(
      Math.hypot(x, y),
      Math.hypot(width - x, y),
      Math.hypot(x, height - y),
      Math.hypot(width - x, height - y),
    ),
  );
}

function setupOriginButton(button) {
  const fill = button.querySelector('.btn-origin-fill');
  if (!fill) return;

  let origin = { x: 0, y: 0 };
  let coverSize = 0;

  function measureCover() {
    const rect = button.getBoundingClientRect();
    coverSize = getCoverDiameter(rect.width, rect.height, origin.x, origin.y);
    fill.style.width = `${coverSize}px`;
    fill.style.height = `${coverSize}px`;
  }

  function setOrigin(clientX, clientY) {
    const rect = button.getBoundingClientRect();
    origin = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    fill.style.left = `${origin.x}px`;
    fill.style.top = `${origin.y}px`;
    measureCover();
  }

  function setActive(active) {
    button.classList.toggle('is-origin-active', active);
    fill.style.transform = active
      ? 'translate(-50%, -50%) scale(1)'
      : 'translate(-50%, -50%) scale(0)';
  }

  button.addEventListener('pointerenter', (event) => {
    setOrigin(event.clientX, event.clientY);
    setActive(true);
  });

  button.addEventListener('pointermove', (event) => {
    if (!button.classList.contains('is-origin-active')) return;
    setOrigin(event.clientX, event.clientY);
  });

  button.addEventListener('pointerleave', () => {
    setActive(false);
  });

  button.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    setOrigin(event.clientX, event.clientY);
    setActive(true);
    button.classList.add('is-origin-pressed');
  });

  button.addEventListener('pointerup', () => {
    button.classList.remove('is-origin-pressed');
  });

  button.addEventListener('pointercancel', () => {
    button.classList.remove('is-origin-pressed');
    setActive(false);
  });

  button.addEventListener('focus', () => {
    const rect = button.getBoundingClientRect();
    setOrigin(rect.left + rect.width / 2, rect.top + rect.height / 2);
    if (button.matches(':focus-visible')) setActive(true);
  });

  button.addEventListener('blur', () => {
    button.classList.remove('is-origin-pressed');
    setActive(false);
  });

  const resizeObserver = new ResizeObserver(() => {
    if (button.classList.contains('is-origin-active')) measureCover();
  });
  resizeObserver.observe(button);

  fill.style.transition = `transform ${FILL_DURATION_MS}ms ${FILL_EASE}`;
}

export function initOriginButtons() {
  document.querySelectorAll('.btn--origin').forEach((button) => {
    if (canUseDesktopFx()) {
      setupOriginButton(button);
      return;
    }

    button.classList.add('is-origin-static');
  });
}
