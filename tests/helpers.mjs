import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../scripts/lib/repository.mjs';
export function temporary(t, prefix = 'test-') {
  const parent = path.join(ROOT, '.lab-runs');
  fs.mkdirSync(parent, { recursive: true });
  const dir = fs.mkdtempSync(path.join(parent, prefix));
  t.after(() => { fs.rmSync(dir, { recursive: true, force: true }); });
  return dir;
}
export function write(root, p, text) {
  fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
  fs.writeFileSync(path.join(root, p), text);
}
