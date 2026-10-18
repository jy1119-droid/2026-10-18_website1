/**
 * Zero-dependency static file server for the exported site.
 * Used by `npm start` because `next start` does not support `output: 'export'`.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'out');
const PORT = Number(process.env.PORT ?? 12000);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const candidates = [clean, `${clean}.html`, path.join(clean, 'index.html')];
  for (const candidate of candidates) {
    const target = path.join(ROOT, candidate);
    // Never serve anything outside the export directory.
    if (!target.startsWith(ROOT)) continue;
    try {
      const info = await stat(target);
      if (info.isFile()) return { target, size: info.size };
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const found = await resolveFile(req.url ?? '/');
  if (!found) {
    const notFound = await resolveFile('/404.html');
    if (notFound) {
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      createReadStream(notFound.target).pipe(res);
      return;
    }
    res.writeHead(404, { 'content-type': TYPES['.txt'] });
    res.end('Not found');
    return;
  }

  res.writeHead(200, {
    'content-type': TYPES[path.extname(found.target)] ?? 'application/octet-stream',
    'content-length': found.size,
    'cache-control': found.target.includes('/_next/static/')
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
  });
  createReadStream(found.target).pipe(res);
}).listen(PORT, () => {
  console.log(`Fighter Ready static export served at http://localhost:${PORT}`);
});
