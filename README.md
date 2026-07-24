# Sato Sato — Brand Site

Launch-ready single page with Devil Up–inspired neo-brutalist layout, GSAP scroll choreography, and product grid — experimental visual direction.

## Setup

```bash
npm install
cp .env.example .env.local   # set BRAND_PASSWORD (required for /Inside)
npm run sync:bible           # pull brand bible from sibling codex pack
npm run dev                  # http://localhost:5190
npm run build
```

### Images

Locally, images symlink from the brand bible:

```text
public/images → ../sato-sato-codex-build-pack/public/images
```

Redesign assets live in `public/images/redesign/` (hero, bento, product cards).

**Vercel deploy:** symlinks may not resolve. Before deploy, either:
- Copy `public/images` into the repo, or
- Add the brand bible as a submodule and copy in a prebuild script

### Private brand bible (`/Inside`)

The strategy site from `sato-sato-codex-build-pack` is synced to `/Inside` (not linked from the public site).

- **URL:** `https://satosatoth.com/Inside`
- **Gate:** shared password via Vercel Edge Middleware + `/api/inside-login`
- **Env vars (Vercel + `.env.local`):**
  - `BRAND_PASSWORD` — shared password
  - `BRAND_AUTH_SECRET` — optional; used to sign the session cookie

Set both in the Vercel project **Settings → Environment Variables**, then redeploy.

`npm run sync:bible` copies `sato.html`, education, and campaigns into `public/Inside/`. **Run manually** when the codex pack changes — it is not part of `npm run build` (avoids overwriting deployed customisations).

## Sections

| Section | Interaction |
|---------|-------------|
| Hero | Surreal landscape, floating cans, central CTA card |
| Ticker | Infinite promo marquee |
| Bento A | Manifesto grid with floating cans |
| Bento B | Craft / sticky rice story |
| Range | 2×2 product card grid with diagonal splits |
| Serve | 3-step ritual cards |
| Find us | Venue bento tiles |

## Global FX (desktop)

- Lenis smooth scroll
- Custom cursor + magnetic pill buttons
- Disabled on touch / `prefers-reduced-motion`

## Visual direction

Experimental branch adapting Devil Up's bento grid, bold Archivo Black typography, and surreal product scenes with Sato Sato branding. Differs from the editorial direction in the brand bible.

## Stack

Vite · GSAP ScrollTrigger · Lenis · vanilla CSS (modular) · Vercel Edge Middleware (`/Inside`)
