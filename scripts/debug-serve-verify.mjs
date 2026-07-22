import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://localhost:5190/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const serveY = await page.evaluate(() => {
  const el = document.getElementById('serve-pin');
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});
await page.evaluate((y) => window.scrollTo(0, y), serveY);
await page.waitForTimeout(1000);

const data = await page.evaluate(() => {
  const ice = document.getElementById('serve-ice-fill');
  if (!ice) return { error: 'no serve-ice-fill' };
  const r = ice.getBoundingClientRect();
  const cs = getComputedStyle(ice);
  return {
    rectHeight: r.height,
    computedHeight: cs.height,
    inlineHeight: ice.style.height,
    zIndex: cs.zIndex,
    backgroundColor: cs.backgroundColor,
    cubeCount: ice.querySelectorAll('.ice-cube').length,
    inViewport: r.height > 50 && r.bottom > 0 && r.top < window.innerHeight,
  };
});

console.log('POST-FIX:', JSON.stringify(data, null, 2));
await browser.close();
