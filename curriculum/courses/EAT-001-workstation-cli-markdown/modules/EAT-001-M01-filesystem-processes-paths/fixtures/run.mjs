import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { ROOT, runCLI } from '../../../../../../scripts/lib/repository.mjs';
import { createLab, cleanupLab, run, write, gitFactory, configureClone, pythonCommand } from '../../../../../../scripts/lib/lab.mjs';
const HERE = fileURLToPath(new URL('.', import.meta.url));

export function setup() {
  const dir = createLab('filesystem'); fs.cpSync(HERE, path.join(dir, 'fixture'), { recursive: true }); return dir;
}
export function verify(dir) {
  const cwd = path.join(dir, 'fixture');
  const before = fs.readFileSync(path.join(cwd, 'data/input.txt'));
  const ok = run(process.execPath, ['inspect.mjs', 'data/input.txt'], cwd);
  assert.match(ok.stdout, /3 righe/); assert.equal(ok.stderr, '');
  const missing = run(process.execPath, ['inspect.mjs', 'missing.txt'], cwd, { expected: 2 });
  assert.equal(missing.stdout, ''); assert.match(missing.stderr, /ENOENT/);
  assert.ok(before.equals(fs.readFileSync(path.join(cwd, 'data/input.txt'))));
}

runCLI(import.meta, () => {
  const dir = setup();
  if (process.argv.includes('--verify')) {
    try { verify(dir); } finally { cleanupLab(dir); }
  } else console.log('Fixture: ' + path.relative(ROOT, dir).split(path.sep).join('/'));
});
