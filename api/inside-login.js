import {
  buildAuthCookie,
  createSessionToken,
  getBrandPassword,
} from '../lib/inside-auth.js';

function readPassword(req) {
  if (req.body && typeof req.body === 'object' && req.body.password != null) {
    return String(req.body.password);
  }
  if (typeof req.body === 'string' && req.body.length) {
    const params = new URLSearchParams(req.body);
    return params.get('password') || '';
  }
  return '';
}

function send(res, status, headers, body = '') {
  res.statusCode = status;
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.end(body);
}

/**
 * Vercel serverless handler + local Vite middleware handler.
 * Export default for Vercel; named handleInsideLogin for Vite.
 */
export async function handleInsideLogin(req, res) {
  if (req.method !== 'POST') {
    send(res, 405, { Allow: 'POST' }, 'Method Not Allowed');
    return;
  }

  const expected = getBrandPassword();
  if (!expected) {
    send(res, 503, { 'content-type': 'text/plain; charset=utf-8' }, 'BRAND_PASSWORD is not configured');
    return;
  }

  // Local Vite may not parse the body; read the raw stream when needed.
  let password = readPassword(req);
  if (!password && req.readable !== false && !req.body) {
    password = await readStreamPassword(req);
  }

  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

  if (password === expected) {
    const token = await createSessionToken(password);
    send(res, 302, {
      'Set-Cookie': buildAuthCookie(token, { secure }),
      Location: '/Inside/',
    });
    return;
  }

  send(res, 302, { Location: '/Inside/?error=1' });
}

async function readStreamPassword(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return new URLSearchParams(raw).get('password') || '';
}

export default async function handler(req, res) {
  await handleInsideLogin(req, res);
}
