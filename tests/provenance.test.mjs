import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { ROOT, readJSON, json } from '../scripts/lib/repository.mjs';
import { AUDIT_DIR, AUDIT_JSON, AUDIT_GZIP, validateProvenance, compareCourseEdges, personalPath } from '../scripts/validate-provenance.mjs';
import { temporary, write } from './helpers.mjs';
function fixture(t) {
  const root = temporary(t);
  for (const p of ['sources/repositories.json', 'graph/knowledge-graph.json', 'sources/evidence/ssri-coverage.json', 'sources/evidence/ironmath-requirements.json', 'schemas/audit-manifest.schema.json', ...AUDIT_JSON, AUDIT_GZIP]) write(root, p, fs.readFileSync(path.join(ROOT, p)));
  write(root, `${AUDIT_DIR}/audit.md`, fs.readFileSync(path.join(ROOT, AUDIT_DIR, 'audit.md')));
  for (const p of ['catalog/skills', 'curriculum/courses']) fs.mkdirSync(path.join(root, p), { recursive: true });
  return root;
}
test('provenance: manifest, checksum, gzip e snapshot validi', () => assert.deepEqual(validateProvenance(), []));
test('provenance: checksum errato', t => {
  const root = fixture(t); fs.appendFileSync(path.join(root, AUDIT_DIR, 'audit.md'), '\n');
  assert.match(validateProvenance(root).join(), /checksum/);
});
test('provenance: artifact mancante', t => {
  const root = fixture(t); fs.unlinkSync(path.join(root, AUDIT_DIR, 'audit.md'));
  assert.match(validateProvenance(root).join(), /artifact mancante/);
});
test('provenance: gzip corrotto', t => {
  const root = fixture(t); write(root, AUDIT_GZIP, 'invalid gzip');
  assert.match(validateProvenance(root).join(), /gzip corrotto/);
});
test('provenance: natura non canonica obbligatoria', t => {
  const root = fixture(t), manifest = readJSON(root, AUDIT_JSON[0]); manifest.canonical = true;
  write(root, AUDIT_JSON[0], json(manifest)); assert.match(validateProvenance(root).join(), /canonical.*const/);
});
test('provenance: checksum originali non riscrivibili con il manifest', t => {
  const root = fixture(t), manifest = readJSON(root, AUDIT_JSON[0]); manifest.artifacts[0].expected_sha256 = '0'.repeat(64);
  write(root, AUDIT_JSON[0], json(manifest)); assert.match(validateProvenance(root).join(), /baseline incoerenti/);
});
test('provenance: proiezione esatta dei 51 archi con strength distinte', () => {
  const old = readJSON(ROOT, AUDIT_JSON[1]), current = readJSON(ROOT, 'graph/knowledge-graph.json');
  assert.deepEqual(compareCourseEdges(old, current), []);
  const edge = current.edges.find(e => e.type === 'RECOMMENDED_BEFORE'); edge.type = 'PREREQUISITE_OF';
  assert.match(compareCourseEdges(old, current).join(), /51 archi/);
});
test('provenance: path personali e secret rilevati anche nei byte archiviati', t => {
  const root = fixture(t);
  fs.appendFileSync(path.join(root, AUDIT_DIR, 'audit.md'), '\n' + '/' + 'Users/example/private\n' + ['gh', 'p_', 'a'.repeat(36)].join(''));
  const errors = validateProvenance(root).join(); assert.match(errors, /path personale/); assert.match(errors, /secret-looking/);
});
test('provenance: path relativo components/home ammesso; assoluti POSIX e Windows respinti', () => {
  assert.equal(personalPath('"apps/web/src/components/home/HeroTicker.css"'), false);
  assert.ok(personalPath('"' + '/' + 'home/example/data"'));
  assert.ok(personalPath('"' + 'C:' + String.fromCharCode(92) + 'Users' + String.fromCharCode(92) + 'example"'));
});
