import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { ROOT, loadModel, writeArtifacts } from '../scripts/lib/repository.mjs';
import { validatePolicy } from '../scripts/lib/policy.mjs';
import { gitFactory } from '../scripts/lib/lab.mjs';
import { renderIndexes } from '../scripts/build-indexes.mjs';
import { renderReports } from '../scripts/build-reports.mjs';
import { renderWebData } from '../scripts/build-web-data.mjs';
import { checkGenerated } from '../scripts/check-generated.mjs';
import { temporary, write } from './helpers.mjs';
function policyFixture(t) {
  const dir = temporary(t);
  for (const f of ['AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md', 'package.json', 'package-lock.json', 'apps/web/package.json', '.gitignore']) write(dir, f, fs.readFileSync(path.join(ROOT, f), 'utf8'));
  return dir;
}
test('policy: repository, adapter sottili, progress ignorato e nessun runtime sibling', () => assert.deepEqual(validatePolicy(), []));
test('policy: funziona senza Git e senza remote richiesto', t => assert.deepEqual(validatePolicy(policyFixture(t)), []));
test('policy: origin ufficiale HTTPS e SSH permessi senza rete', t => {
  const dir = policyFixture(t), git = gitFactory(dir);
  git(dir, ['init', '-b', 'main']);
  for (const url of ['https://github.com/samuelecorra/engineering-atlas.git', 'git@github.com:samuelecorra/engineering-atlas.git', 'ssh://git@github.com/samuelecorra/engineering-atlas.git']) {
    git(dir, ['remote', 'add', 'origin', url]);
    assert.deepEqual(validatePolicy(dir), []);
    git(dir, ['remote', 'remove', 'origin']);
  }
});
test('policy: origin verso un altro repository rifiutato', t => {
  const dir = policyFixture(t), git = gitFactory(dir);
  git(dir, ['init', '-b', 'main']);
  git(dir, ['remote', 'add', 'origin', 'https://github.com/example/unrelated.git']);
  assert.match(validatePolicy(dir).join(), /repository GitHub ufficiale/);
});
test('policy: push URL separata deve restare ufficiale', t => {
  const dir = policyFixture(t), git = gitFactory(dir);
  git(dir, ['init', '-b', 'main']);
  git(dir, ['remote', 'add', 'origin', 'https://github.com/samuelecorra/engineering-atlas.git']);
  git(dir, ['remote', 'set-url', '--push', 'origin', 'https://github.com/example/unrelated.git']);
  assert.match(validatePolicy(dir).join(), /repository GitHub ufficiale/);
});
test('policy: remote aggiuntivo non autorizzato rifiutato', t => {
  const dir = policyFixture(t), git = gitFactory(dir);
  git(dir, ['init', '-b', 'main']);
  git(dir, ['remote', 'add', 'secondary', 'https://github.com/example/unrelated.git']);
  assert.match(validatePolicy(dir).join(), /Remote non previsto/);
});
test('policy: workflow e hosting rifiutati', t => {
  const dir = policyFixture(t); write(dir, '.github/workflows/publish.yml', 'name: forbidden\n'); write(dir, 'CNAME', 'example.invalid\n'); write(dir, '.openai/hosting.json', '{}\n');
  assert.equal(validatePolicy(dir).filter(e => /artifact vietato/.test(e)).length, 3);
});
test('policy: adapter divergente o senza riferimento fallisce', t => { const dir = policyFixture(t); write(dir, 'AGENTS.md', 'Una policy copiata. '.repeat(160)); assert.match(validatePolicy(dir).join(), /riferimento policy canonica mancante/); assert.match(validatePolicy(dir).join(), /adapter esteso/); });
test('policy: profilo deve essere ignorato', t => { const dir = policyFixture(t); write(dir, '.gitignore', 'node_modules/\n'); assert.match(validatePolicy(dir).join(), /progress privato non ignorato/); });
test('policy: lockfile root obsoleto fallisce', t => { const dir = policyFixture(t); const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')); pkg.version = '9.0.0'; write(dir, 'package.json', JSON.stringify(pkg)); assert.match(validatePolicy(dir).join(), /lockfile root non allineato/); });
test('policy: React ammesso nel solo workspace frontend', t => {
  const dir = policyFixture(t); assert.deepEqual(validatePolicy(dir), []);
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')); pkg.dependencies = { react: '19.2.8' };
  write(dir, 'package.json', JSON.stringify(pkg)); assert.match(validatePolicy(dir).join(), /package root: dependencies fuori scope/);
});
test('policy: workspace e package aggiuntivi respinti', t => {
  const dir = policyFixture(t), pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  pkg.workspaces.push('apps/other'); write(dir, 'package.json', JSON.stringify(pkg)); write(dir, 'apps/other/package.json', '{}\n');
  const errors = validatePolicy(dir).join(); assert.match(errors, /unico workspace/); assert.match(errors, /package fuori confine/);
});
test('policy: dipendenza frontend non motivata, mobile e URL installabili respinti', t => {
  const dir = policyFixture(t), pkg = JSON.parse(fs.readFileSync(path.join(dir, 'apps/web/package.json'), 'utf8'));
  pkg.dependencies['unrelated-cloud-sdk'] = '1.0.0'; pkg.dependencies.react = '^19.0.0';
  write(dir, 'apps/web/package.json', JSON.stringify(pkg)); assert.match(validatePolicy(dir).join(), /dipendenza non motivata o non fissata/);
});
test('policy: server pubblico e deploy frontend respinti', t => {
  const dir = policyFixture(t), pkg = JSON.parse(fs.readFileSync(path.join(dir, 'apps/web/package.json'), 'utf8'));
  pkg.scripts.dev = 'vite --host 0.0.0.0'; pkg.scripts.deploy = 'deploy';
  write(dir, 'apps/web/package.json', JSON.stringify(pkg)); assert.match(validatePolicy(dir).join(), /script rete\/hosting fuori scope/);
});
test('policy: import sibling in TypeScript e link lock fuori repository respinti', t => {
  const dir = policyFixture(t); write(dir, 'apps/web/src/invalid.ts', 'import x from ' + JSON.stringify('../../../' + 'ironmath/private.ts') + ';\n');
  assert.match(validatePolicy(dir).join(), /import runtime sibling/);
  const lock = JSON.parse(fs.readFileSync(path.join(dir, 'package-lock.json'), 'utf8'));
  lock.packages['node_modules/invalid'] = { resolved: '../outside', link: true }; write(dir, 'package-lock.json', JSON.stringify(lock));
  assert.match(validatePolicy(dir).join(), /link locale fuori frontend/);
});
test('policy: path assoluto personale rifiutato', t => { const dir = policyFixture(t); write(dir, 'catalog/skills/invalid.json', JSON.stringify({ path: '/' + 'Users/example/project' })); assert.match(validatePolicy(dir).join(), /path assoluto personale/); });
test('policy: dipendenza runtime dal sibling rifiutata', t => { const dir = policyFixture(t); write(dir, 'scripts/invalid.mjs', 'import x from ' + JSON.stringify('../' + 'ironmath/index.mjs') + ';\n'); assert.match(validatePolicy(dir).join(), /import runtime sibling/); });
test('generated: determinismo, freschezza byte e check senza mutazioni', t => {
  const dir = temporary(t), m = loadModel(), artifacts = { ...renderIndexes(m), ...renderReports(m), ...renderWebData(m) };
  assert.deepEqual({ ...renderIndexes(m), ...renderReports(m), ...renderWebData(m) }, artifacts);
  writeArtifacts(dir, artifacts); assert.deepEqual(checkGenerated(dir, m), []);
  const p = 'reports/gap-analysis.md', changed = artifacts[p] + '\n'; write(dir, p, changed);
  assert.match(checkGenerated(dir, m).join(), /generated obsoleto/);
  assert.equal(fs.readFileSync(path.join(dir, p), 'utf8'), changed);
});
