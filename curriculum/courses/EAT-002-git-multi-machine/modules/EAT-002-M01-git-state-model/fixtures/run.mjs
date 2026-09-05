import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { ROOT, runCLI } from '../../../../../../scripts/lib/repository.mjs';
import { createLab, cleanupLab, run, write, gitFactory, configureClone, pythonCommand } from '../../../../../../scripts/lib/lab.mjs';
const HERE = fileURLToPath(new URL('.', import.meta.url));

export function setup() {
  const dir = createLab('git-state'), repo = path.join(dir, 'repo'), git = gitFactory(dir);
  fs.mkdirSync(repo); git(repo, ['init', '-b', 'main']); configureClone(git, repo);
  write(repo, 'plan.txt', 'plan=base\n'); git(repo, ['add', 'plan.txt']); git(repo, ['commit', '-m', 'fixture: baseline']);
  write(repo, 'plan.txt', 'plan=staged\n'); git(repo, ['add', 'plan.txt']);
  write(repo, 'plan.txt', 'plan=working\n'); write(repo, 'notes.txt', 'untracked observation\n');
  return dir;
}
export function verify(dir) {
  const repo = path.join(dir, 'repo'), git = gitFactory(dir);
  const status = git(repo, ['status', '--short']).stdout;
  assert.match(status, /MM plan.txt/); assert.match(status, /\?\? notes.txt/);
  assert.match(git(repo, ['show', 'HEAD:plan.txt']).stdout, /base/);
  assert.match(git(repo, ['show', ':plan.txt']).stdout, /staged/);
  assert.match(git(repo, ['diff', '--staged']).stdout, /\+plan=staged/);
  git(repo, ['commit', '-m', 'fixture: staged snapshot']);
  assert.match(git(repo, ['show', 'HEAD:plan.txt']).stdout, /staged/);
  assert.match(fs.readFileSync(path.join(repo, 'plan.txt'), 'utf8'), /working/);
  assert.match(git(repo, ['status', '--short']).stdout, / M plan.txt/);
  assert.equal(git(repo, ['remote']).stdout, '');
}

runCLI(import.meta, () => {
  const dir = setup();
  if (process.argv.includes('--verify')) {
    try { verify(dir); } finally { cleanupLab(dir); }
  } else console.log('Fixture: ' + path.relative(ROOT, dir).split(path.sep).join('/'));
});
