import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModel } from '../scripts/lib/repository.mjs';
import { validateMetadata } from '../scripts/validate-metadata.mjs';
import { checkSchema, validateSchema } from '../scripts/lib/schema.mjs';
const base = loadModel();
const mutate = fn => { const m = structuredClone(base); fn(m); return validateMetadata(m).join('\n'); };
test('metadata: fixture canonica valida', () => assert.deepEqual(validateMetadata(base), []));
test('metadata: nuovo JSON canonico non può eludere lo schema', () => assert.match(mutate(m => { m.files.push('sources/unknown.json'); }), /JSON canonico senza contratto/));
test('metadata: duplicate ID', () => assert.match(mutate(m => m.skills.push(structuredClone(m.skills[0]))), /duplicate ID/));
test('metadata: enum invalida', () => assert.match(mutate(m => { m.skills[0].priority = 'P9'; }), /enum invalida/));
test('metadata: required e tipo annidato sono verificati', () => {
  assert.match(mutate(m => { delete m.skills[0].title; }), /required/);
  assert.match(mutate(m => { m.skills[0].ssri_coverage.evidence_ids = 'evidence'; }), /tipo atteso array/);
});
test('metadata: evidence mancante', () => assert.match(mutate(m => { m.skills[0].ssri_coverage.evidence_ids = ['ev.ssri.missing']; }), /evidence mancante/));
test('metadata: coverage e requirement non scambiano fonti', () => assert.match(mutate(m => { m.skills[0].ssri_coverage.evidence_ids = m.skills[0].ironmath_requirement.evidence_ids; }), /fonte errata/));
test('metadata: taxonomy fuori allowlist', () => assert.match(mutate(m => { m.skills[0].roadmap_taxonomy = ['Unauthorized taxonomy']; }), /taxonomy fuori allowlist/));
test('metadata: course/module mismatch nel piano', () => assert.match(mutate(m => { m.courses[0].planned_modules[0].id = 'EAT-020-M99'; }), /course\/module mismatch/));
test('metadata: baseline non promuove coverage implicitamente', () => assert.match(mutate(m => { m.skills[0].ssri_coverage.level = 'C4'; }), /baseline modificato/));
test('metadata: target maintainer non può essere ridotto a operatore', () => assert.match(mutate(m => { m.skills.find(s => s.id === 'skill.git.internals').ironmath_requirement.level = 'M3'; }), /target non coerente/));
test('metadata: ID pattern e proprietà extra falliscono', () => {
  assert.match(mutate(m => { m.skills[0].id = 'wrong'; }), /pattern invalido/);
  assert.match(mutate(m => { m.skills[0].learner_mastery = 'M4'; }), /proprietà non consentita/);
});
test('schema: keyword non implementata fallisce anche annidata', () => assert.match(checkSchema({ type: 'object', properties: { n: { type: 'number', multipleOf: 2 } } }).join(), /keyword non supportata/));
test('schema: date, min/max e additionalProperties realmente applicati', () => {
  assert.ok(validateSchema('2026-02-30', { type: 'string', format: 'date' }).length);
  assert.ok(validateSchema(-1, { type: 'integer', minimum: 0 }).length);
  assert.ok(validateSchema([1, 1], { type: 'array', uniqueItems: true, items: { type: 'integer' } }).length);
});
