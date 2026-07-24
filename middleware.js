import { rewrite } from '@vercel/edge';
import {
  COOKIE_NAME,
  isInsidePath,
  isInsidePublicPath,
  isInsideStaticAsset,
  isValidSessionToken,
  parseCookies,
} from './lib/inside-auth.js';

export const config = {
  matcher: ['/Inside', '/Inside/(.*)'],
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (!isInsidePath(pathname) || isInsidePublicPath(pathname) || isInsideStaticAsset(pathname)) {
    return;
  }

  if (!getBrandPasswordSafe()) {
    return new Response('Brand bible gate is not configured (missing BRAND_PASSWORD).', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const cookies = parseCookies(request.headers.get('cookie') || '');
  const token = cookies[COOKIE_NAME];

  if (await isValidSessionToken(token)) {
    return;
  }

  const loginUrl = new URL('/Inside/login.html', request.url);
  if (url.searchParams.get('error') === '1') {
    loginUrl.searchParams.set('error', '1');
  }
  return rewrite(loginUrl);
}

function getBrandPasswordSafe() {
  return Boolean(process.env.BRAND_PASSWORD);
}
