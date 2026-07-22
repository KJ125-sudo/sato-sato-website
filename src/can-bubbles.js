const MAX_BUBBLES = 120;

export function initCanBubbles() {
  document.querySelectorAll('.can-bubbles').forEach((canvas) => {
    startCanBubbles(canvas);
  });
}

export function startCanBubbles(canvas) {
  if (!canvas) return () => {};

  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const stage = canvas.parentElement;
  const canImg = stage?.querySelector('img');
  let width = 0;
  let height = 0;
  let imgTopRatio = 0.2;
  let imgBottomRatio = 1;
  let running = true;
  let visible = true;
  const bubbles = [];

  function updateSpawnZone() {
    if (!stage || !canImg || width < 1 || height < 1) {
      imgTopRatio = 0.2;
      imgBottomRatio = 1;
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    const imgRect = canImg.getBoundingClientRect();
    imgTopRatio = (imgRect.top - stageRect.top) / height;
    imgBottomRatio = (imgRect.bottom - stageRect.top) / height;
  }

  function spawn() {
    if (bubbles.length >= MAX_BUBBLES || width < 1 || height < 1) return;

    const imgHeight = Math.max(0.05, imgBottomRatio - imgTopRatio);
    let y;

    // Mix: some spawn visible above the lip, most spawn mid-can and rise up through it.
    if (Math.random() < 0.3) {
      y = height * (imgTopRatio * (0.1 + Math.random() * 0.85));
    } else {
      y = height * (imgTopRatio + imgHeight * (0.12 + Math.random() * 0.62));
    }

    bubbles.push({
      x: width * (0.34 + Math.random() * 0.32),
      y,
      r: 1.2 + Math.random() * 3.2,
      vy: 0.55 + Math.random() * 1.05,
      vx: (Math.random() - 0.5) * 0.16,
      a: 0.28 + Math.random() * 0.32,
    });
  }

  function resize() {
    const rect = stage?.getBoundingClientRect();
    if (!rect || rect.width < 1 || rect.height < 1) return;

    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * devicePixelRatio);
    canvas.height = Math.round(height * devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    updateSpawnZone();
  }

  function draw() {
    if (running && visible && width > 0 && height > 0) {
      ctx.clearRect(0, 0, width, height);

      for (let i = bubbles.length - 1; i >= 0; i -= 1) {
        const b = bubbles[i];
        b.x += b.vx;
        b.y -= b.vy;
        b.a -= 0.00055;

        if (b.a <= 0 || b.y < -6) {
          bubbles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 228, 255, ${b.a})`;
        ctx.fill();
      }

      if (Math.random() < 0.4) spawn();
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);

  if (canImg && !canImg.complete) {
    canImg.addEventListener('load', resize, { once: true });
  }

  if (stage) {
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    if (canImg) resizeObserver.observe(canImg);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01, rootMargin: '10% 0px' },
    );
    intersectionObserver.observe(stage);

    requestAnimationFrame(draw);

    return () => {
      running = false;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
  }

  requestAnimationFrame(draw);
  return () => {
    running = false;
    window.removeEventListener('resize', resize);
  };
}
