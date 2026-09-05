import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { ROOT, runCLI } from '../../../../../../scripts/lib/repository.mjs';
import { createLab, cleanupLab, run, write, gitFactory, configureClone, pythonCommand } from '../../../../../../scripts/lib/lab.mjs';
const HERE = fileURLToPath(new URL('.', import.meta.url));

function npmCLI() {
  const candidates = [process.env.npm_execpath, path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js')];
  for (const entry of (process.env.PATH ?? '').split(path.delimiter)) {
    candidates.push(path.join(entry, 'node_modules/npm/bin/npm-cli.js'));
    if (process.platform !== 'win32' && fs.existsSync(path.join(entry, 'npm'))) candidates.push(fs.realpathSync(path.join(entry, 'npm')));
  }
  const candidate = candidates.find(p => p && p.endsWith('.js') && fs.existsSync(p));
  if (!candidate) throw new Error('npm CLI non trovata: eseguire tramite npm test o installare npm con Node 24.');
  return candidate;
}
export function setup() {
  const dir = createLab('node'); fs.cpSync(HERE, path.join(dir, 'fixture'), { recursive: true }); return dir;
}
export function verify(dir) {
  const cwd = path.join(dir, 'fixture'), cli = npmCLI(), env = { ...process.env, npm_config_cache: path.join(dir, 'npm-cache'), npm_config_update_notifier: 'false' };
  const npm = args => run(process.execPath, [cli, ...args], cwd, { env });
  const before = fs.readFileSync(path.join(cwd, 'package-lock.json'));
  npm(['ci', '--offline', '--ignore-scripts', '--no-audit', '--no-fund']);
  assert.ok(before.equals(fs.readFileSync(path.join(cwd, 'package-lock.json'))));
  assert.match(run(process.execPath, ['--test', '--test-reporter=tap', 'sum.test.mjs'], cwd).stdout, /# pass 1/);
  const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')); pkg.version = '1.0.1'; write(cwd, 'package.json', JSON.stringify(pkg, null, 2) + '\n');
  npm(['install', '--package-lock-only', '--offline', '--ignore-scripts', '--no-audit', '--no-fund']);
  const lock = JSON.parse(fs.readFileSync(path.join(cwd, 'package-lock.json'), 'utf8'));
  assert.equal(lock.packages[''].version, '1.0.1'); assert.deepEqual(Object.keys(lock.packages), ['']);
  npm(['ci', '--offline', '--ignore-scripts', '--no-audit', '--no-fund']);
}

runCLI(import.meta, () => {
  const dir = setup();
  if (process.argv.includes('--verify')) {
    try { verify(dir); } finally { cleanupLab(dir); }
  } else console.log('Fixture: ' + path.relative(ROOT, dir).split(path.sep).join('/'));
});
