import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { ROOT, loadModel, writeArtifacts } from '../scripts/lib/repository.mjs';
import { validatePolicy } from '../scripts/lib/policy.mjs';
import { gitFactory } from '../scripts/lib/lab.mjs';
import { renderIndexes } from '../scripts/build-indexes.mjs';
import { renderReports } from '../scripts/build-reports.mjs';
import { checkGenerated } from '../scripts/check-generated.mjs';
import { temporary, write } from './helpers.mjs';
function policyFixture(t) {
  const dir = temporary(t);
  for (const f of ['AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md', 'package.json', 'package-lock.json', '.gitignore']) write(dir, f, fs.readFileSync(path.join(ROOT, f), 'utf8'));
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
test('policy: path assoluto personale rifiutato', t => { const dir = policyFixture(t); write(dir, 'catalog/skills/invalid.json', JSON.stringify({ path: '/' + 'Users/example/project' })); assert.match(validatePolicy(dir).join(), /path assoluto personale/); });
test('policy: dipendenza runtime dal sibling rifiutata', t => { const dir = policyFixture(t); write(dir, 'scripts/invalid.mjs', 'import x from ' + JSON.stringify('../' + 'ironmath/index.mjs') + ';\n'); assert.match(validatePolicy(dir).join(), /import runtime sibling/); });
test('generated: determinismo, freschezza byte e check senza mutazioni', t => {
  const dir = temporary(t), m = loadModel(), artifacts = { ...renderIndexes(m), ...renderReports(m) };
  assert.deepEqual({ ...renderIndexes(m), ...renderReports(m) }, artifacts);
  writeArtifacts(dir, artifacts); assert.deepEqual(checkGenerated(dir, m), []);
  const p = 'reports/gap-analysis.md', changed = artifacts[p] + '\n'; write(dir, p, changed);
  assert.match(checkGenerated(dir, m).join(), /generated obsoleto/);
  assert.equal(fs.readFileSync(path.join(dir, p), 'utf8'), changed);
});
