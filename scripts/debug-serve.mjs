import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://localhost:5190/', { waitUntil: 'networkidle' });

const serveY = await page.evaluate(() => {
  const el = document.getElementById('serve-pin');
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
});

await page.evaluate((y) => window.scrollTo(0, y), serveY);
await page.waitForTimeout(1000);

const atServe = await page.evaluate(() => {
  const ice = document.getElementById('serve-ice');
  const stage = document.getElementById('serve-stage');
  if (!ice) return { error: 'no ice element' };
  const r = ice.getBoundingClientRect();
  const cs = getComputedStyle(ice);
  return {
    rect: { top: r.top, bottom: r.bottom, height: r.height, width: r.width },
    computedHeight: cs.height,
    inlineHeight: ice.style.height,
    backgroundColor: cs.backgroundColor,
    zIndex: cs.zIndex,
    display: cs.display,
    visibility: cs.visibility,
    opacity: cs.opacity,
    cubeCount: ice.querySelectorAll('.ice-cube').length,
    stageHeight: stage?.getBoundingClientRect().height,
    inViewport: r.height > 0 && r.bottom > 0 && r.top < window.innerHeight,
  };
});

console.log('AT_SERVE:', JSON.stringify(atServe, null, 2));

// scroll through serve pin
for (let i = 0; i <= 5; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), serveY + i * 200);
  await page.waitForTimeout(300);
}
const afterScroll = await page.evaluate(() => {
  const ice = document.getElementById('serve-ice');
  const r = ice.getBoundingClientRect();
  return { inlineHeight: ice.style.height, rectHeight: r.height, top: r.top, bottom: r.bottom };
});
console.log('AFTER_SCROLL:', JSON.stringify(afterScroll, null, 2));

await browser.close();
