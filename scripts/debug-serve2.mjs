import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

await page.goto('http://localhost:5190/', { waitUntil: 'networkidle' });

const boot = await page.evaluate(() => ({
  hasMain: !!document.querySelector('script[src*="main"]'),
  mainSrc: document.querySelector('script[type="module"]')?.getAttribute('src'),
  iceCss: [...document.styleSheets].map((s) => {
    try {
      return [...s.cssRules].filter((r) => r.cssText?.includes('serve-ice')).map((r) => r.cssText);
    } catch { return ['blocked']; }
  }).flat(),
  iceRule: (() => {
    const el = document.getElementById('serve-ice');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { height: cs.height, position: cs.position, bottom: cs.bottom, zIndex: cs.zIndex };
  })(),
  gsapLoaded: typeof window.gsap !== 'undefined',
  cubeCount: document.querySelectorAll('.ice-cube').length,
  inlineHeight: document.getElementById('serve-ice')?.style.height,
}));

console.log('BOOT:', JSON.stringify(boot, null, 2));
console.log('ERRORS:', errors);

await browser.close();
