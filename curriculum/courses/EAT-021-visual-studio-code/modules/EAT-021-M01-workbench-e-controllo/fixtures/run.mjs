import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { ROOT, runCLI } from '../../../../../../scripts/lib/repository.mjs';
import { createLab, checkedLab, cleanupLab } from '../../../../../../scripts/lib/lab.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const files = ['workbench-note.md', 'settings-example.jsonc'];
export function setup() {
  const dir = createLab('vscode-workbench');
  for (const file of files) fs.copyFileSync(path.join(HERE, file), path.join(dir, file));
  return dir;
}
// Checks the exercise material, not the learner's GUI actions or competence.
export function verify(input) {
  const dir = checkedLab(input);
  for (const file of files) {
    const target = path.join(dir, file);
    assert.ok(fs.lstatSync(target).isFile() && !fs.lstatSync(target).isSymbolicLink());
    assert.deepEqual(fs.readFileSync(target), fs.readFileSync(path.join(HERE, file)));
  }
  const note = fs.readFileSync(path.join(dir, files[0]), 'utf8');
  assert.match(note, /osservazione/);
  assert.ok(note.split('\n').some(line => line.length > 120), 'serve una riga lunga per il confronto word wrap');
  // This fixture contains only full-line comments, so no general JSONC parser is needed.
  const settings = JSON.parse(fs.readFileSync(path.join(dir, files[1]), 'utf8').replace(/^\s*\/\/.*$/gm, ''));
  assert.equal(settings['editor.wordWrap'], 'off');
  assert.equal(settings['[markdown]']['editor.wordWrap'], 'on');
  assert.equal(fs.existsSync(path.join(dir, '.vscode')), false, 'il setup non deve applicare impostazioni');
}
runCLI(import.meta, () => {
  const dir = setup();
  if (process.argv.includes('--verify')) {
    try { verify(dir); } finally { cleanupLab(dir); }
  } else console.log('Fixture: ' + path.relative(ROOT, dir).split(path.sep).join('/'));
});
