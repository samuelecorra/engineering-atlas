import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModel, lessonPath } from '../scripts/lib/repository.mjs';
import { validateMetadata } from '../scripts/validate-metadata.mjs';
import { validateGraph } from '../scripts/validate-graph.mjs';
const base = loadModel();
const mutate = fn => { const m = structuredClone(base); fn(m); return validateMetadata(m).join('\n'); };
test('hierarchy: estensione VS Code limita unità e lezioni agli ID autorizzati', () => {
  assert.match(mutate(m => { m.modules.find(x => x.id === 'EAT-021-M01').unit_ids.push('EAT-021-M01-U99'); }), /unit fuori scope autorizzato/);
  assert.match(mutate(m => { m.units.find(x => x.id === 'EAT-021-M01-U01').lesson_ids.push('EAT-021-M01-U01-L99'); }), /lesson fuori scope autorizzato/);
});
test('hierarchy: il corso VS Code non rende facoltativa la ownership degli starter', () => {
  assert.match(mutate(m => { m.courses.find(x => x.id === 'EAT-001').primary_skill_ids = []; }), /ownership primaria vuota non autorizzata/);
  assert.match(mutate(m => { m.modules.find(x => x.id === 'EAT-001-M01').teaches_skill_ids = []; }), /modulo senza skill insegnata/);
  assert.match(mutate(m => { m.courses.find(x => x.id === 'EAT-021').reinforced_skill_ids = []; }), /ownership primaria vuota non autorizzata/);
});
test('hierarchy: sette U01/L01 valide, ownership e grafo coerenti', () => {
  assert.equal(base.units.filter(u => !u.id.startsWith('EAT-021')).length, 7); assert.equal(base.lessons.filter(l => !l.id.startsWith('EAT-021')).length, 7);
  assert.equal(base.units.length, 9); assert.equal(base.lessons.length, 11);
  assert.deepEqual(validateMetadata(base), []); assert.deepEqual(validateGraph(base), []);
});
test('hierarchy: unit ID e lesson ID rispettano pattern stabili', () => {
  assert.match(mutate(m => { m.units[0].id = 'EAT-001-U1'; }), /pattern invalido/);
  assert.match(mutate(m => { m.lessons[0].id = 'EAT-001-L1'; }), /pattern invalido/);
});
test('hierarchy: unit orfana rifiutata', () => assert.match(mutate(m => { m.units[0].module_id = 'EAT-020-M99'; }), /unit orfana/));
test('hierarchy: lesson orfana rifiutata', () => assert.match(mutate(m => { m.lessons[0].unit_id = 'EAT-020-M99-U01'; }), /lesson orfana/));
test('hierarchy: ownership reciproca obbligatoria anche con parent esistente', () => {
  assert.match(mutate(m => { m.units[0].module_id = m.modules[1].id; }), /ownership/);
  assert.match(mutate(m => { m.lessons[0].unit_id = m.units[1].id; }), /ownership/);
});
test('hierarchy: lesson duplicata respinta', () => assert.match(mutate(m => { m.lessons.push(structuredClone(m.lessons[0])); m.paths.lessons.push(m.paths.lessons[0]); }), /duplicate ID/));
test('hierarchy: path unit e lesson devono corrispondere a ID e slug', () => {
  assert.match(mutate(m => { [m.paths.units[0], m.paths.units[1]] = [m.paths.units[1], m.paths.units[0]]; }), /path unit incoerente/);
  assert.match(mutate(m => { [m.paths.lessons[0], m.paths.lessons[1]] = [m.paths.lessons[1], m.paths.lessons[0]]; }), /path lesson incoerente/);
});
test('hierarchy: lesson Markdown mancante', () => assert.match(mutate(m => { m.files = m.files.filter(p => p !== lessonPath(m.lessons[0], m).replace(/lesson.json$/, 'lesson.md')); }), /lesson Markdown mancante/));
test('hierarchy: nessuna promozione implicita di unit o lesson', () => {
  assert.match(mutate(m => { m.units[0].status = 'reviewed'; }), /status fuori tranche/);
  assert.match(mutate(m => { m.lessons[0].status = 'validated'; }), /status fuori tranche/);
});
test('hierarchy: planned module senza directory resta valido', () => {
  const inactive = base.courses.flatMap(c => c.planned_modules).filter(p => !base.modules.some(m => m.id === p.id));
  assert.ok(inactive.length > 100);
  for (const p of inactive) assert.equal(base.files.some(f => f.includes('/modules/' + p.id + '-')), false);
  assert.deepEqual(validateMetadata(base), []);
});
test('hierarchy: ownership grafica mancante o doppia viene rifiutata', () => {
  const m = structuredClone(base), edge = m.graph.edges.find(e => e.from === m.lessons[0].id && e.type === 'PART_OF');
  edge.to = m.units[1].id;
  assert.match(validateGraph(m).join(), /relazione canonica mancante/);
  m.graph.edges.push({ ...edge, to: m.units[2].id });
  assert.match(validateGraph(m).join(), /non sostenuta dai metadata/);
});
