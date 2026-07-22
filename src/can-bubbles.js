const MAX_BUBBLES = 120;

export function startCanBubbles(canvas) {
  if (!canvas) return () => {};

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let running = true;
  let visible = true;
  const bubbles = [];

  function resize() {
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    width = rect.width;
    height = rect.height;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function spawn() {
    if (bubbles.length >= MAX_BUBBLES) return;
    bubbles.push({
      x: width * (0.35 + Math.random() * 0.3),
      y: height * (0.55 + Math.random() * 0.25),
      r: 1 + Math.random() * 3,
      vy: 0.25 + Math.random() * 0.6,
      vx: (Math.random() - 0.5) * 0.2,
      a: 0.15 + Math.random() * 0.25,
    });
  }

  function draw() {
    if (!running || !visible) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = bubbles.length - 1; i >= 0; i -= 1) {
      const b = bubbles[i];
      b.x += b.vx;
      b.y -= b.vy;
      b.a -= 0.0015;

      if (b.a <= 0 || b.y < height * 0.1) {
        bubbles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(190, 228, 255, ${b.a})`;
      ctx.fill();
    }

    if (Math.random() < 0.35) spawn();
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();

  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    },
    { threshold: 0.05 },
  );
  observer.observe(canvas);

  return () => {
    running = false;
    observer.disconnect();
    window.removeEventListener('resize', resize);
  };
}
