import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { ROOT, runCLI } from '../../../../../../scripts/lib/repository.mjs';
import { createLab, cleanupLab, run, write, gitFactory, configureClone, pythonCommand } from '../../../../../../scripts/lib/lab.mjs';
const HERE = fileURLToPath(new URL('.', import.meta.url));

export function setup() { const dir = createLab('shell'); fs.cpSync(HERE, path.join(dir, 'fixture'), { recursive: true }); return dir; }
export function verify(dir) {
  const cwd = path.join(dir, 'fixture');
  assert.match(run(process.execPath, ['read.mjs', 'data/Missing Notes.txt'], cwd, { expected: 2 }).stderr, /ENOENT/);
  assert.match(run(process.execPath, ['read.mjs', 'data/My', 'Notes.txt'], cwd, { expected: 2 }).stderr, /un argomento/);
  const env = { ...process.env }; delete env.ATLAS_DEMO_MODE;
  assert.match(run(process.execPath, ['check-env.mjs'], cwd, { expected: 2, env }).stderr, /non impostata/);
  assert.match(run(process.execPath, ['read.mjs', 'data/My Notes.txt'], cwd).stdout, /innocuo/);
  assert.match(run(process.execPath, ['check-env.mjs'], cwd, { env: { ...env, ATLAS_DEMO_MODE: 'practice' } }).stdout, /configurata/);
}

runCLI(import.meta, () => {
  const dir = setup();
  if (process.argv.includes('--verify')) {
    try { verify(dir); } finally { cleanupLab(dir); }
  } else console.log('Fixture: ' + path.relative(ROOT, dir).split(path.sep).join('/'));
});
