import { canUseDesktopFx } from './utils.js';

function wrapProximityChars(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    const text = node.textContent;
    if (!text?.trim()) return;

    const fragment = document.createDocumentFragment();

    for (const char of text) {
      if (char === ' ' || char === '\n' || char === '\t') {
        fragment.appendChild(document.createTextNode(char));
        continue;
      }

      const span = document.createElement('span');
      span.dataset.proximityChar = '';
      span.textContent = char;
      fragment.appendChild(span);
    }

    node.replaceWith(fragment);
  });
}

export function initVariableFontProximity(el, options = {}) {
  if (!el || !canUseDesktopFx()) return;

  const {
    container = el.parentElement,
    fromWeight = 900,
    toWeight = 900,
    fromScale = 1,
    toScale = 1.045,
    radius = 120,
  } = options;

  if (!container) return;

  el.classList.add('proximity-font');
  wrapProximityChars(el);

  const chars = el.querySelectorAll('[data-proximity-char]');

  function setCharStyle(char, weight, scale) {
    char.style.fontVariationSettings = `'wght' ${weight}`;
    char.style.fontWeight = weight;
    char.style.transform = `scale(${scale})`;
  }

  chars.forEach((char) => setCharStyle(char, fromWeight, fromScale));

  let frame = 0;
  let lastX = 0;
  let lastY = 0;

  function updateWeights() {
    frame = 0;
    chars.forEach((char) => {
      const rect = char.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(lastX - cx, lastY - cy);
      const t = Math.max(0, 1 - dist / radius);
      const weight = Math.round(fromWeight + t * (toWeight - fromWeight));
      const scale = fromScale + t * (toScale - fromScale);
      setCharStyle(char, weight, scale);
    });
  }

  container.addEventListener('mousemove', (event) => {
    lastX = event.clientX;
    lastY = event.clientY;
    if (!frame) frame = requestAnimationFrame(updateWeights);
  });

  container.addEventListener('mouseleave', () => {
    chars.forEach((char) => setCharStyle(char, fromWeight, fromScale));
  });
}
