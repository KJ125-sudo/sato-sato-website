import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

/**
 * Local stand-in for Vercel Edge Middleware + /api/inside-login
 * so /Inside is gated during `npm run dev`.
 * Production auth is enforced by middleware.js on Vercel.
 */
function insidePasswordGate() {
  return {
    name: 'inside-password-gate',
    configureServer(server) {
      // Login API (mirrors /api/inside-login on Vercel)
      server.middlewares.use(async (req, res, next) => {
        const host = req.headers.host || 'localhost';
        const url = new URL(req.url || '/', `http://${host}`);

        if (url.pathname !== '/api/inside-login') {
          next();
          return;
        }

        const env = loadEnv(server.config.mode, server.config.root, '');
        if (!process.env.BRAND_PASSWORD && env.BRAND_PASSWORD) {
          process.env.BRAND_PASSWORD = env.BRAND_PASSWORD;
        }
        if (!process.env.BRAND_AUTH_SECRET && env.BRAND_AUTH_SECRET) {
          process.env.BRAND_AUTH_SECRET = env.BRAND_AUTH_SECRET;
        }

        const { handleInsideLogin } = await import('./api/inside-login.js');
        await handleInsideLogin(req, res);
      });

      // Password gate for /Inside/*
      server.middlewares.use(async (req, res, next) => {
        const host = req.headers.host || 'localhost';
        const url = new URL(req.url || '/', `http://${host}`);
        const path = url.pathname;

        if (path !== '/Inside' && !path.startsWith('/Inside/')) {
          next();
          return;
        }

        if (
          path === '/Inside/login' ||
          path === '/Inside/login.html' ||
          path === '/api/inside-login' ||
          path.startsWith('/Inside/audio/')
        ) {
          next();
          return;
        }

        const env = loadEnv(server.config.mode, server.config.root, '');
        const password = env.BRAND_PASSWORD || process.env.BRAND_PASSWORD || '';
        if (!password) {
          res.statusCode = 503;
          res.setHeader('content-type', 'text/plain; charset=utf-8');
          res.end('Set BRAND_PASSWORD in .env.local to unlock /Inside locally.');
          return;
        }

        if (!process.env.BRAND_PASSWORD) process.env.BRAND_PASSWORD = password;
        if (!process.env.BRAND_AUTH_SECRET && env.BRAND_AUTH_SECRET) {
          process.env.BRAND_AUTH_SECRET = env.BRAND_AUTH_SECRET;
        }

        const { COOKIE_NAME, isValidSessionToken, parseCookies } = await import(
          './lib/inside-auth.js'
        );

        const cookies = parseCookies(req.headers.cookie || '');
        if (await isValidSessionToken(cookies[COOKIE_NAME])) {
          // Vite does not auto-map /Inside/ → /Inside/index.html
          if (path === '/Inside' || path === '/Inside/') {
            req.url = '/Inside/index.html';
          } else if (path === '/Inside/education') {
            req.url = '/Inside/education.html';
          } else if (path === '/Inside/campaigns') {
            req.url = '/Inside/campaigns.html';
          }
          next();
          return;
        }

        const error = url.searchParams.get('error') === '1' ? '?error=1' : '';
        req.url = `/Inside/login.html${error}`;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [insidePasswordGate()],
  server: {
    port: 5190,
    open: '/',
  },
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger.js', 'lenis'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
