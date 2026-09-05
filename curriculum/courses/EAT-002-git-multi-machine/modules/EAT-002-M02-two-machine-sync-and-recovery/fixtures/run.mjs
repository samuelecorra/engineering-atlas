import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { ROOT, runCLI } from '../../../../../../scripts/lib/repository.mjs';
import { createLab, cleanupLab, run, write, gitFactory, configureClone, pythonCommand } from '../../../../../../scripts/lib/lab.mjs';
const HERE = fileURLToPath(new URL('.', import.meta.url));

function scenario(dir, label, git) {
  const base = path.join(dir, label); fs.mkdirSync(base);
  const remote = path.join(base, 'remote.git'), mac = path.join(base, 'mac'), windows = path.join(base, 'windows');
  git(base, ['init', '--bare', '-b', 'main', remote]); git(base, ['clone', remote, mac]); configureClone(git, mac);
  write(mac, 'choice.txt', 'choice=base\n'); git(mac, ['add', 'choice.txt']); git(mac, ['commit', '-m', 'fixture: baseline']); git(mac, ['push', '-u', 'origin', 'main']);
  git(base, ['clone', remote, windows]); configureClone(git, windows);
  return { mac, windows };
}
function commit(git, repo, file, text, message) { write(repo, file, text); git(repo, ['add', file]); git(repo, ['commit', '-m', message]); }
export function setup() {
  const dir = createLab('git-sync'), git = gitFactory(dir);
  const ff = scenario(dir, 'fast-forward', git);
  commit(git, ff.mac, 'mac.txt', 'mac contribution\n', 'fixture: mac work'); git(ff.mac, ['push']); git(ff.windows, ['fetch', 'origin']);
  const feature = scenario(dir, 'divergence', git);
  git(feature.mac, ['switch', '-c', 'feature']); commit(git, feature.mac, 'mac.txt', 'published contribution\n', 'fixture: published feature'); git(feature.mac, ['push', '-u', 'origin', 'feature']);
  git(feature.windows, ['switch', '-c', 'feature']); commit(git, feature.windows, 'windows.txt', 'private contribution\n', 'fixture: private feature'); git(feature.windows, ['fetch', 'origin']); git(feature.windows, ['branch', '--set-upstream-to=origin/feature']);
  const conflict = scenario(dir, 'conflict', git);
  commit(git, conflict.mac, 'choice.txt', 'choice=mac\n', 'fixture: mac choice'); git(conflict.mac, ['push']);
  commit(git, conflict.windows, 'choice.txt', 'choice=windows\n', 'fixture: windows choice'); git(conflict.windows, ['fetch', 'origin']);
  return dir;
}
export function verify(dir) {
  const git = gitFactory(dir), at = label => path.join(dir, label, 'windows');
  const ff = at('fast-forward');
  assert.match(git(ff, ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}']).stdout, /^0\s+1/);
  git(ff, ['pull', '--ff-only']); assert.equal(git(ff, ['rev-parse', 'HEAD']).stdout, git(ff, ['rev-parse', '@{upstream}']).stdout);
  const feature = at('divergence');
  assert.match(git(feature, ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}']).stdout, /^1\s+1/);
  assert.notEqual(git(feature, ['push'], null).status, 0);
  assert.notEqual(git(feature, ['pull', '--ff-only'], null).status, 0);
  const old = git(feature, ['rev-parse', 'HEAD']).stdout.trim(); git(feature, ['branch', 'rescue/before-rebase']);
  git(feature, ['rebase', 'origin/feature']); git(feature, ['push']);
  assert.ok(fs.existsSync(path.join(feature, 'mac.txt')) && fs.existsSync(path.join(feature, 'windows.txt')));
  assert.equal(git(feature, ['rev-parse', 'rescue/before-rebase']).stdout.trim(), old);
  assert.ok(git(feature, ['reflog', '--format=%H']).stdout.includes(old));
  const conflict = at('conflict'), before = git(conflict, ['rev-parse', 'HEAD']).stdout;
  const remoteHead = git(conflict, ['rev-parse', 'origin/main']).stdout.trim();
  assert.notEqual(git(conflict, ['merge', 'origin/main'], null).status, 0);
  assert.match(git(conflict, ['status', '--short']).stdout, /UU choice.txt/);
  git(conflict, ['merge', '--abort']); assert.equal(git(conflict, ['rev-parse', 'HEAD']).stdout, before);
  assert.equal(git(conflict, ['status', '--porcelain']).stdout, '');
  assert.notEqual(git(conflict, ['merge', 'origin/main'], null).status, 0);
  write(conflict, 'choice.txt', 'choice=mac+windows\n'); git(conflict, ['add', 'choice.txt']); git(conflict, ['commit', '-m', 'fixture: reconcile both choices']);
  git(conflict, ['merge-base', '--is-ancestor', before.trim(), 'HEAD']); git(conflict, ['merge-base', '--is-ancestor', remoteHead, 'HEAD']); git(conflict, ['push']);
  write(conflict, 'draft.txt', 'untracked work\n'); git(conflict, ['stash', 'push', '-u', '-m', 'fixture: temporary draft']);
  assert.equal(fs.existsSync(path.join(conflict, 'draft.txt')), false);
  git(conflict, ['stash', 'apply', '--index']); assert.match(fs.readFileSync(path.join(conflict, 'draft.txt'), 'utf8'), /untracked work/);
  git(conflict, ['stash', 'drop']);
  commit(git, conflict, 'draft.txt', 'untracked work\n', 'fixture: reversible change');
  const change = git(conflict, ['rev-parse', 'HEAD']).stdout.trim(); git(conflict, ['revert', '--no-edit', change]);
  assert.equal(fs.existsSync(path.join(conflict, 'draft.txt')), false);
  assert.equal(git(conflict, ['status', '--porcelain']).stdout, '');
}

runCLI(import.meta, () => {
  const dir = setup();
  if (process.argv.includes('--verify')) {
    try { verify(dir); } finally { cleanupLab(dir); }
  } else console.log('Fixture: ' + path.relative(ROOT, dir).split(path.sep).join('/'));
});
