import { prefersReducedMotion } from './utils.js';

export function initTicker() {
  const track = document.getElementById('ticker-track');
  if (!track || prefersReducedMotion()) return;

  const group = track.querySelector('.ticker__group');
  if (!group) return;

  const clone = group.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
}
