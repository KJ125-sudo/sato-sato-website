import gsap from 'gsap';
import { prefersReducedMotion } from './utils.js';

const FLOW_SPEED = 38;

function waitForImages(container) {
  const images = [...container.querySelectorAll('img')];
  if (!images.length) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }
        }),
    ),
  );
}

export function initManifesto() {
  const showcase = document.getElementById('bento-can-showcase');
  if (!showcase || prefersReducedMotion()) return;

  const wrap = showcase.querySelector('.bento-can-stack-wrap');
  const stack = document.getElementById('bento-can-stack');
  if (!wrap || !stack) return;

  const cans = stack.querySelectorAll('.bento-can-stack__can');
  const tiltValues = Array.from(cans, (can) => Number(can.dataset.tilt) || 0);
  let flowTimeline;
  let resizeTimer;

  function startRocking() {
    cans.forEach((can, i) => {
      const baseTilt = tiltValues[i];
      const rockAmount = i % 2 === 0 ? 10 : -9;
      const sway = i % 2 === 0 ? 6 : -5;

      gsap.set(can, { rotation: baseTilt, x: 0 });
      gsap.to(can, {
        rotation: baseTilt + rockAmount,
        x: sway,
        duration: 2.2 + i * 0.15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.12,
      });
    });
  }

  function getFlowBounds() {
    const wrapHeight = wrap.clientHeight;
    const stackHeight = stack.offsetHeight;
    const startY = 0;
    const endY = Math.min(0, wrapHeight - stackHeight);

    return { startY, endY, travel: Math.abs(endY - startY) };
  }

  function startFlow() {
    if (flowTimeline) flowTimeline.kill();
    gsap.killTweensOf([stack, ...cans]);

    const { startY, endY, travel } = getFlowBounds();
    const duration = Math.max(travel / FLOW_SPEED, 0.01);

    gsap.set(stack, { y: startY });
    startRocking();

    if (travel <= 1) return;

    flowTimeline = gsap
      .timeline({ repeat: -1 })
      .to(stack, {
        y: endY,
        duration,
        ease: 'power1.inOut',
      })
      .to(stack, {
        y: startY,
        duration,
        ease: 'power1.inOut',
      });
  }

  waitForImages(stack).then(startFlow);

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      waitForImages(stack).then(startFlow);
    }, 150);
  });
}

export function initCraftBento() {
  const cloudsInner = document.getElementById('craft-clouds-inner');
  if (!cloudsInner || prefersReducedMotion()) return;

  gsap.to(cloudsInner, {
    x: '-50%',
    duration: 60,
    repeat: -1,
    ease: 'none',
  });
}
