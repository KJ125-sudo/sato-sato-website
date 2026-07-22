export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchDevice() {
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

export function canUseDesktopFx() {
  return !prefersReducedMotion() && !isTouchDevice();
}
