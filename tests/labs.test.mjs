import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { loadModel, ROOT } from '../scripts/lib/repository.mjs';
import { cleanupLab, checkedLab, createLab } from '../scripts/lib/lab.mjs';
const model = loadModel();
for (const [i, mod] of model.modules.entries()) {
  test(`lab offline: ${mod.id}`, { timeout: 45000 }, async t => {
    const entry = path.join(ROOT, path.dirname(model.paths.modules[i]), 'fixtures/run.mjs');
    const lab = await import(pathToFileURL(entry).href);
    const dir = lab.setup(); t.after(() => cleanupLab(dir));
    assert.equal(checkedLab(dir), dir);
    lab.verify(dir);
  });
}
test('lab processi: porta loopback associata al PID e shutdown', { timeout: 10000 }, async t => {
  const mod = model.modules.find(m => m.id === 'EAT-001-M01');
  const entry = path.join(ROOT, path.dirname(model.paths.modules[model.modules.indexOf(mod)]), 'fixtures/process-port.mjs');
  const child = spawn(process.execPath, [entry], { stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => { if (child.exitCode === null) child.kill(); });
  const info = await new Promise((resolve, reject) => {
    let text = '';
    child.on('error', reject); child.on('exit', code => reject(new Error(`processo terminato prima della porta: ${code}`)));
    child.stdout.on('data', chunk => { text += chunk; if (text.includes('\n')) resolve(JSON.parse(text.split('\n')[0])); });
  });
  assert.equal(info.pid, child.pid); assert.equal(info.address, '127.0.0.1');
  assert.ok(Number.isInteger(info.port) && info.port > 0);
  const response = await new Promise((resolve, reject) => {
    const client = net.connect({ host: info.address, port: info.port });
    let data = ''; client.on('data', chunk => { data += chunk; }); client.on('end', () => resolve(data)); client.on('error', reject);
  });
  assert.match(response, /atlas local fixture/);
  const stopped = new Promise(resolve => child.once('exit', resolve)); child.kill('SIGINT'); await stopped;
});
test('lab cleanup: rifiuta root e directory senza marker', () => {
  assert.throws(() => checkedLab(ROOT), /path esatto/);
  assert.throws(() => checkedLab(path.join(ROOT, '.lab-runs')), /path esatto/);
  const dir = createLab('cleanup-guard');
  fs.unlinkSync(path.join(dir, '.atlas-lab.json'));
  try { assert.throws(() => checkedLab(dir)); assert.ok(fs.existsSync(dir)); }
  finally { fs.rmdirSync(dir); }
});
