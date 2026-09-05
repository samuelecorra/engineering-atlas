import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModel } from '../scripts/lib/repository.mjs';
import { checkContentFiles, SECTIONS, secretLooking, sensitiveName } from '../scripts/validate-content.mjs';
const scope = loadModel().scope;
function valid() {
  return Object.fromEntries(scope.starter_modules.flatMap(s => Object.entries(SECTIONS).map(([name, sections]) =>
    [`curriculum/courses/${s.course_id}-fixture/modules/${s.directory}/${name}`, sections.map(title => `## ${title}\n\nEvidenza osservabile: sessione delimitata e diagnosi motivata.\n`).join('\n')])));
}
test('content: i sette starter sono consentiti', () => assert.deepEqual(checkContentFiles(valid(), scope), []));
test('content: ottavo modulo fallisce', () => { const f = valid(); f['curriculum/courses/EAT-003-js/modules/EAT-003-M01-extra/lesson.md'] = Object.values(f)[0]; assert.match(checkContentFiles(f, scope).join(), /fuori starter slice/); });
test('content: stesso nome starter sotto un altro corso fallisce', () => { const f = valid(); const p = Object.keys(f)[0]; f[p.replace('EAT-001-fixture', 'EAT-020-fixture')] = f[p]; assert.match(checkContentFiles(f, scope).join(), /fuori starter slice/); });
test('content: planned con soli metadata non crea contenuto', () => {
  const f = valid(); f['curriculum/courses/EAT-003-js/modules/EAT-003-M01-metadata/module.json'] = JSON.stringify({ status: 'planned' });
  assert.deepEqual(checkContentFiles(f, scope), []); // Storage activation policy is stricter in validateMetadata.
});
test('content: placeholder e file vuoti falliscono', () => {
  const f = valid(), first = Object.keys(f)[0]; f[first] += '\n' + ['TO', 'DO'].join('');
  assert.match(checkContentFiles(f, scope).join(), /placeholder/); f[first] = ' \n'; assert.match(checkContentFiles(f, scope).join(), /file vuoto/);
});
test('content: sezioni mancanti e lesson eccessiva falliscono', () => {
  const f = valid(), first = Object.keys(f)[0]; f[first] = 'x '.repeat(2801);
  assert.match(checkContentFiles(f, scope).join(), /sezione mancante/); assert.match(checkContentFiles(f, scope).join(), /oltre 2800/);
});
test('content: claim mastery senza assessment fallisce', () => { const f = valid(); f[Object.keys(f)[0]] += '\n' + ['mas', 'tered'].join(''); assert.match(checkContentFiles(f, scope).join(), /claim personale/); });
test('content: secret e filename rilevati senza aprire credenziali', () => {
  assert.ok(secretLooking(['gh', 'p_', 'a'.repeat(36)].join('')));
  assert.ok(sensitiveName('.env')); assert.ok(sensitiveName('fixture/.env.local'));
  assert.equal(sensitiveName('fixture/.env.example'), false);
});
