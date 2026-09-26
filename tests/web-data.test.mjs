import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModel, writeArtifacts } from '../scripts/lib/repository.mjs';
import { createWebData, renderWebData, WEB_DATA_PATH } from '../scripts/build-web-data.mjs';
import { personalPath } from '../scripts/validate-provenance.mjs';
import { checkGenerated } from '../scripts/check-generated.mjs';
import { renderIndexes } from '../scripts/build-indexes.mjs';
import { renderReports } from '../scripts/build-reports.mjs';
import { temporary, write } from './helpers.mjs';
const model = loadModel();
test('web-data: tutte le lezioni della stessa unità arrivano a report e reader', () => {
  const d = createWebData(model), report = renderReports(model)['reports/curriculum-roadmap.md'];
  for (const lesson of model.lessons.filter(l => l.unit_id === 'EAT-021-M01-U01')) {
    assert.ok(report.includes(lesson.id), lesson.id);
    const document = d.documents.find(doc => doc.id === lesson.id);
    assert.ok(document?.markdown.includes('## Modello mentale'), lesson.id);
    assert.equal(document.route, '/lessons/' + lesson.id);
  }
});
test('web-data: output deterministico con hash e ordinamento stabili', () => {
  assert.deepEqual(createWebData(model), createWebData(model));
  const data = createWebData(model); assert.match(data.content_sha256, /^[a-f0-9]{64}$/);
  assert.equal(data.generated, true); assert.equal(data.courses.length, 21); assert.equal(data.lessons.length, 11);
});
test('web-data: ogni parent e route ID risolve, nessun orphan', () => {
  const d = createWebData(model), routes = new Set(d.routes.map(r => r.path));
  assert.equal(routes.size, d.routes.length);
  for (const c of [...d.courses, ...d.modules, ...d.units, ...d.lessons, ...d.roadmaps]) assert.ok(routes.has(c.route));
  for (const l of d.lessons) { assert.ok(d.units.some(u => u.id === l.unit_id)); assert.ok(d.documents.some(doc => doc.id === l.document_id)); }
  for (const doc of d.documents) for (const target of Object.values(doc.links)) if (target.startsWith('/')) assert.ok(routes.has(target.split(/[?#]/)[0]), target);
});
test('web-data: stato draft, coverage e target conservati; nessun profilo personale', () => {
  const d = createWebData(model);
  for (const item of [...d.modules, ...d.units, ...d.lessons]) assert.equal(item.status, 'draft');
  assert.deepEqual(d.skills, [...model.skills].sort((a, b) => a.id < b.id ? -1 : 1));
  assert.equal(d.learning_semantics.learner_mastery, 'not-evaluated');
  assert.equal(d.learning_semantics.local_progress, 'reading-only');
  assert.equal('profile' in d, false); assert.equal(personalPath(JSON.stringify(d)), false);
});
test('web-data: dati mancanti/incoerenti falliscono prima di generare', () => {
  const m = structuredClone(model); m.modules[0].unit_ids = ['EAT-020-M99-U01'];
  assert.throws(() => createWebData(m), /fonti incoerenti/);
  const missing = structuredClone(model); missing.files = missing.files.filter(p => p !== 'projects/ironmath-reading-map.md');
  assert.throws(() => createWebData(missing), /documento mancante/);
});
test('web-data: path personale in metadata non esportato', () => {
  const m = structuredClone(model), title = '/' + 'Users/example/private';
  m.courses[0].title = title; m.graph.nodes.find(n => n.id === m.courses[0].id).title = title;
  assert.throws(() => createWebData(m), /personale o sensibile/);
});
test('web-data: manifest obsoleto e assente rilevati senza scrivere', t => {
  const root = temporary(t); writeArtifacts(root, { ...renderIndexes(model), ...renderReports(model), ...renderWebData(model) });
  assert.deepEqual(checkGenerated(root, model), []);
  write(root, WEB_DATA_PATH, '{}\n');
  assert.match(checkGenerated(root, model).join(), /atlas.json: generated obsoleto o assente/);
});
test('web-data: titoli nel code fence non diventano indice del reader', () => {
  const d = createWebData(model), doc = d.documents.find(doc => doc.id === 'EAT-001-M03-U01-L01');
  assert.ok(doc.headings.every(h => typeof h.id === 'string'));
  assert.ok(doc.headings.some(h => h.text === 'Modello mentale'));
});
