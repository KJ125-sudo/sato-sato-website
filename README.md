# Sato Sato — Brand Site

Launch-ready single page with GSAP scroll choreography, custom desktop cursor, and product interactions — no 3D video required.

## Setup

```bash
npm install
npm run dev    # http://localhost:5190
npm run build
```

### Images

Locally, images symlink from the brand bible:

```text
public/images → ../sato-sato-codex-build-pack/public/images
```

**Vercel deploy:** symlinks may not resolve. Before deploy, either:
- Copy `public/images` into the repo, or
- Add the brand bible as a submodule and copy in a prebuild script

## Sections

| Section | Interaction |
|---------|-------------|
| Hero | GSAP stagger, can mouse-tilt, CO₂ bubbles |
| Manifesto | Scroll-pinned copy scrub |
| Serve | 3-step ritual (scroll + click dots) |
| Range | Flavour explorer (hover/click) |
| Find us | Venue stagger reveal |

## Global FX (desktop)

- Lenis smooth scroll
- Custom cursor + magnetic pill buttons
- Disabled on touch / `prefers-reduced-motion`

## Future: 3D pour video

When a proper MP4 exists, add a `#film` scroll-scrub section between Manifesto and Serve. Pattern documented in git history (`scroll-film.js`).

## Stack

Vite · GSAP ScrollTrigger · Lenis · vanilla CSS
