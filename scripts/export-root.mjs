/**
 * Mirrors the static export from `out/` into the repository root so that
 * `index.html` is servable directly from the project root folder.
 */
import { cp, readdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'out');

// Entries inside `out` that get mirrored to the repo root.
const MIRRORED = ['index.html', '404.html', '_next', '_not-found'];

async function main() {
  if (!existsSync(out)) {
    console.error('No `out/` directory found. Run `next build` first.');
    process.exit(1);
  }

  const entries = await readdir(out);
  for (const entry of MIRRORED) {
    if (!entries.includes(entry)) continue;
    const from = path.join(out, entry);
    const to = path.join(root, entry);
    await rm(to, { recursive: true, force: true });
    const info = await stat(from);
    await cp(from, to, { recursive: info.isDirectory() });
    console.log(`mirrored ${entry}`);
  }

  console.log('root index.html ready');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
