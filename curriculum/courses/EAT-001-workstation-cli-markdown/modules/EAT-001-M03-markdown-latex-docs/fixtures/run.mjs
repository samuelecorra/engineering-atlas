import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { ROOT, runCLI } from '../../../../../../scripts/lib/repository.mjs';
import { createLab, cleanupLab, run, write, gitFactory, configureClone, pythonCommand } from '../../../../../../scripts/lib/lab.mjs';
const HERE = fileURLToPath(new URL('.', import.meta.url));

export function setup() { const dir = createLab('docs'); fs.cpSync(HERE, path.join(dir, 'fixture'), { recursive: true }); fs.copyFileSync(path.join(HERE, 'broken-document.txt'), path.join(dir, 'fixture/document.md')); return dir; }
export function verify(dir) {
  const cwd = path.join(dir, 'fixture');
  const result = run(process.execPath, ['check.mjs', 'document.md'], cwd, { expected: 1 });
  for (const expected of ['Heading', 'Link locale', 'Formula block', 'Formula inline']) assert.ok(result.stderr.includes(expected));
  // Minimal independent positive case: checker is deliberately specific to this exercise, not a LaTeX parser.
  write(cwd, 'positive.md', '# Sessione\n\n## Risultato\n\n[Nota](reference.txt)\n\nLa media è $x$.\n\n$$\nx=1\n$$\n');
  assert.match(run(process.execPath, ['check.mjs', 'positive.md'], cwd).stdout, /coerente/);
}

runCLI(import.meta, () => {
  const dir = setup();
  if (process.argv.includes('--verify')) {
    try { verify(dir); } finally { cleanupLab(dir); }
  } else console.log('Fixture: ' + path.relative(ROOT, dir).split(path.sep).join('/'));
});
