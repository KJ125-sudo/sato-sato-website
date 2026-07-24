/**
 * CO₂ bubble canvas for education deck product slide.
 * Extracted from sato.html s-bubbles scene — deck-controlled (no scroll).
 */
(function (global) {
  'use strict';

  const SB_COUNT = 2200;
  const SB_COLS = 52;
  const SB_FOAM_RATIO = 0.18;
  const SB_FOAM_PACK = 0.62;

  let canvas = null;
  let ctx = null;
  let sbW = 0;
  let sbH = 0;
  let sbBubbles = [];
  let running = false;
  let rafId = 0;
  let mode = 'rise';

  function sbFoamDepth() {
    return SB_FOAM_RATIO * sbH;
  }

  function sbColAt(x) {
    return Math.min(SB_COLS - 1, Math.max(0, Math.floor(x / (sbW / SB_COLS))));
  }

  function sbColStackCount(col) {
    let n = 0;
    for (let i = 0; i < sbBubbles.length; i++) {
      if (sbBubbles[i].trapped && sbBubbles[i].trapCol === col) n++;
    }
    return n;
  }

  function sbMakeBubble() {
    const col = Math.floor(Math.random() * SB_COLS);
    const r = 0.4 + Math.random() * 3.0;
    return {
      col,
      x: (col + 0.5 + (Math.random() - 0.5) * 0.85) * (sbW / SB_COLS),
      y: sbH * 0.35 + Math.random() * (sbH * 0.75),
      r,
      vy: -(2.0 + Math.random() * 3.8),
      vx: 0,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.024 + Math.random() * 0.032,
      wobbleAmp: 0.04 + Math.random() * 0.1,
      trapped: false,
      trapCol: col,
      anchorY: 0,
    };
  }

  function sbTrapAtTop(b) {
    const col = sbColAt(b.x);
    const foamMax = sbFoamDepth();
    const stack = sbColStackCount(col);
    const slotY = b.r + stack * b.r * SB_FOAM_PACK;
    if (slotY + b.r > foamMax) return false;
    b.trapped = true;
    b.trapCol = col;
    b.vy = 0;
    b.vx = (Math.random() - 0.5) * 0.4;
    b.anchorY = slotY;
    b.y = slotY;
    b.wobbleSpeed = 0.05 + Math.random() * 0.06;
    b.wobbleAmp = 0.05 + Math.random() * 0.09;
    return true;
  }

  function sbDrawBubble(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = r > 2.5 ? 'rgba(190,228,255,0.42)' : 'rgba(210,238,255,0.26)';
    ctx.lineWidth = r > 2 ? 0.9 : 0.5;
    ctx.stroke();
    if (r > 1.3) {
      ctx.beginPath();
      ctx.arc(x - r * 0.28, y - r * 0.3, r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fill();
    }
  }

  function tick() {
    if (!running) return;
    rafId = requestAnimationFrame(tick);
    if (!sbW) return;
    ctx.clearRect(0, 0, sbW, sbH);
    for (let i = sbBubbles.length - 1; i >= 0; i--) {
      const b = sbBubbles[i];
      if (b.trapped) {
        b.wobble += b.wobbleSpeed * 2.4;
        b.vx += (Math.random() - 0.5) * 0.22;
        b.vx *= 0.86;
        b.x += b.vx + Math.sin(b.wobble) * 0.14;
        b.y = b.anchorY + Math.sin(b.wobble * 1.7) * 0.12;
        if (b.x < -b.r) b.x = sbW + b.r;
        if (b.x > sbW + b.r) b.x = -b.r;
      } else {
        b.wobble += b.wobbleSpeed;
        b.x += Math.sin(b.wobble) * b.wobbleAmp;
        b.y += b.vy;
        b.r += 0.005;
        if (b.y - b.r <= 0) {
          if (!sbTrapAtTop(b)) sbBubbles.splice(i, 1);
          if (!sbBubbles[i]) continue;
        }
      }
      sbDrawBubble(b.x, b.y, b.r);
    }
  }

  function initFoam() {
    sbW = canvas.width = canvas.offsetWidth || window.innerWidth;
    sbH = canvas.height = canvas.offsetHeight || window.innerHeight;
    sbBubbles = [];
    const foamMax = sbFoamDepth();
    for (let col = 0; col < SB_COLS; col++) {
      let stack = 0;
      while (stack < 48) {
        const r = 0.35 + Math.random() * 2.8;
        const slotY = r + stack * r * SB_FOAM_PACK;
        if (slotY + r > foamMax) break;
        sbBubbles.push({
          col,
          x: (col + 0.5 + (Math.random() - 0.5) * 0.85) * (sbW / SB_COLS),
          y: slotY,
          r,
          trapped: true,
          trapCol: col,
          anchorY: slotY,
        });
        stack++;
      }
    }
  }

  function drawFoam() {
    if (!ctx || !sbW) return;
    ctx.clearRect(0, 0, sbW, sbH);
    for (let i = 0; i < sbBubbles.length; i++) {
      const b = sbBubbles[i];
      sbDrawBubble(b.x, b.y, b.r);
    }
  }

  function init() {
    sbW = canvas.width = canvas.offsetWidth || window.innerWidth;
    sbH = canvas.height = canvas.offsetHeight || window.innerHeight;
    sbBubbles = [];
    for (let i = 0; i < SB_COUNT; i++) sbBubbles.push(sbMakeBubble());
  }

  function start(el) {
    stop();
    canvas = el;
    ctx = canvas.getContext('2d');
    mode = 'rise';
    init();
    running = true;
    tick();
    window.addEventListener('resize', onResize);
  }

  function startFoam(el) {
    stop();
    canvas = el;
    ctx = canvas.getContext('2d');
    mode = 'foam';
    initFoam();
    drawFoam();
    window.addEventListener('resize', onResizeFoam);
  }

  function onResize() {
    if (!canvas || !running || mode !== 'rise') return;
    init();
  }

  function onResizeFoam() {
    if (!canvas || mode !== 'foam') return;
    initFoam();
    drawFoam();
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('resize', onResizeFoam);
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas = null;
    ctx = null;
    mode = 'rise';
  }

  global.EducationBubbles = { start, startFoam, stop };
})(window);
