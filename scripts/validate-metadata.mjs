import { loadModel, runCLI, coursePath, modulePath, unitPath, lessonPath } from './lib/repository.mjs';
import { checkSchema, validateSchema } from './lib/schema.mjs';
import { AUDIT_JSON } from './validate-provenance.mjs';

export function validateMetadata(m) {
  const errors = [];
  const knownJSON = new Set([...AUDIT_JSON, ...Object.values(m.paths).flat(), 'sources/repositories.json', 'sources/evidence/ssri-coverage.json',
    'sources/evidence/ironmath-requirements.json', 'sources/taxonomies/roadmap-sh.json', 'catalog/taxonomy-allowlist.json',
    'governance/scope.json', 'graph/knowledge-graph.json', 'progress/learner-profile.example.json']);
  for (const p of m.files) {
    if (p.endsWith('.json') && /^(sources|catalog\/skills|curriculum\/courses|graph|governance|progress)\//.test(p)
      && !p.includes('/fixtures/') && !knownJSON.has(p)) errors.push(`${p}: JSON canonico senza contratto/validator`);
  }
  for (const [name, schema] of Object.entries(m.schemas)) {
    checkSchema(schema, name, errors);
    if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') errors.push(`${name}: draft 2020-12 richiesto`);
  }
  const check = (value, name, at) => {
    if (!m.schemas[name]) errors.push(`schema mancante: ${name}`);
    else validateSchema(value, m.schemas[name], at, errors);
  };
  for (const [group, name] of Object.entries({ skills: 'skill', courses: 'course', modules: 'module', units: 'unit', lessons: 'lesson', assessments: 'assessment', evidence: 'source', sourceCollections: 'evidence-collection' })) m[group].forEach((v, i) => check(v, name, `${group}[${i}]`));
  for (const key of ['repositories', 'scope', 'taxonomy', 'allowlist', 'profile', 'graph']) check(m[key], key, key);
  if (errors.length) return errors; // Semantic checks run only on well-typed records.
  const byID = group => new Map(m[group].map(v => [v.id, v]));
  const courses = byID('courses'), skills = byID('skills'), modules = byID('modules'), assessments = byID('assessments'), evidence = byID('evidence');
  const units = byID('units');
  const ids = [...m.skills, ...m.courses, ...m.modules, ...m.units, ...m.lessons, ...m.assessments, ...m.evidence].map(v => v.id);
  for (const id of new Set(ids)) if (ids.filter(v => v === id).length > 1) errors.push(`duplicate ID: ${id}`);
  if (m.skills.length !== 52) errors.push('richieste esattamente 52 skill');
  if (m.courses.length !== 20) errors.push('richiesti esattamente 20 corsi');
  const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
  if (!same(m.courses.map(c => c.id), m.scope.course_ids)) errors.push('course ID diversi dallo scope');
  if (!same(m.skills.map(s => s.id), m.scope.skill_baseline.map(s => s.id))) errors.push('skill ID diversi dallo scope');
  const labels = m.allowlist.labels;
  if (!same(labels, m.taxonomy.records.map(t => t.label))) errors.push('taxonomy e allowlist divergenti');
  for (const c of m.sourceCollections) for (const e of c.records) if (e.repository_id !== c.repository_id) errors.push(`${e.id}: repository evidence incoerente`);
  for (const e of m.evidence) {
    const r = m.repositories.repositories.find(r => r.id === e.repository_id);
    if (e.commit !== r?.audited_commit) errors.push(`${e.id}: commit diverso dall'audit`);
    if (e.provenance === 'local-audit-snapshot' && !r.audit_snapshot_available) errors.push(`${e.id}: verifica locale non sostenuta`);
  }
  for (const s of m.skills) {
    const baseline = m.scope.skill_baseline.find(b => b.id === s.id);
    if (baseline && (baseline.primary_course_id !== s.primary_course_id || baseline.coverage !== s.ssri_coverage.level || baseline.priority !== s.priority)) errors.push(`${s.id}: baseline modificato senza autorizzazione`);
    if (!courses.has(s.primary_course_id)) errors.push(`${s.id}: corso proprietario assente`);
    if (s.status !== 'planned') errors.push(`${s.id}: skill deve restare planned nella tranche`);
    if (!['M2', 'M3', 'M4'].includes(s.ironmath_requirement.level)) errors.push(`${s.id}: target attivo sotto M2`);
    const baselineM2 = ['skill.web.html-semantic', 'skill.db.sql-transactions', 'skill.native.tauri-capacitor'].includes(s.id);
    const maintainer = s.primary_course_id === 'EAT-002' || s.primary_course_id === 'EAT-020'
      || ['skill.testing.cross-layer', 'skill.cicd.github-actions', 'skill.llm.safety-evals', 'skill.agents.repo-workflows'].includes(s.id);
    const target = baselineM2 ? 'M2' : maintainer ? 'M4' : 'M3';
    if (s.ironmath_requirement.level !== target) errors.push(`${s.id}: target non coerente con la regola della tranche (${target})`);
    for (const [field, repository] of [['ssri_coverage', 'ssri'], ['ironmath_requirement', 'ironmath']]) for (const id of s[field].evidence_ids) {
      if (!evidence.has(id)) errors.push(`${s.id}: evidence mancante ${id}`);
      else if (evidence.get(id).repository_id !== repository) errors.push(`${s.id}: evidence di fonte errata ${id}`);
    }
    if (s.ssri_coverage.level === 'C0' && !s.ssri_coverage.evidence_ids.some(id => evidence.get(id)?.evidence_type === 'absence-check')) errors.push(`${s.id}: C0 richiede absence-check`);
  }
  const plannedIDs = [];
  for (const [i, c] of m.courses.entries()) {
    if (m.paths.courses[i] !== coursePath(c)) errors.push(`${c.id}: slug/path canonico incoerente`);
    if (c.order !== Number(c.id.slice(4))) errors.push(`${c.id}: ordine numerico incoerente`);
    if (c.status === 'in_progress' && !['EAT-001', 'EAT-002', 'EAT-004', 'EAT-016'].includes(c.id)) errors.push(`${c.id}: corso fuori slice in_progress`);
    const owned = m.skills.filter(s => s.primary_course_id === c.id).map(s => s.id);
    if (!same(owned, c.primary_skill_ids)) errors.push(`${c.id}: ownership skill divergente`);
    for (const s of c.reinforced_skill_ids) if (!skills.has(s) || owned.includes(s)) errors.push(`${c.id}: reinforced skill invalida ${s}`);
    for (const [field, scoped] of [['required_prerequisite_course_ids', m.scope.required_edges], ['recommended_prerequisite_course_ids', m.scope.recommended_edges]]) {
      if (!same(c[field], scoped.filter(([, to]) => to === c.id).map(([from]) => from))) errors.push(`${c.id}: prerequisiti divergenti dallo scope`);
      for (const p of c[field]) if (!courses.has(p) || p === c.id) errors.push(`${c.id}: prerequisito invalido ${p}`);
    }
    for (const planned of c.planned_modules) {
      plannedIDs.push(planned.id);
      if (!planned.id.startsWith(c.id + '-M')) errors.push(`${c.id}: course/module mismatch ${planned.id}`);
      const active = modules.get(planned.id);
      if (!active && planned.status !== 'planned') errors.push(`${planned.id}: stato senza file`);
      if (active && (active.status !== planned.status || active.title !== planned.title)) errors.push(`${planned.id}: planned/module metadata divergenti`);
    }
  }
  if (new Set(plannedIDs).size !== plannedIDs.length) errors.push('duplicate planned module ID');
  for (const [i, s] of m.skills.entries()) if (m.paths.skills[i] !== `catalog/skills/${s.id}.json`) errors.push(`${s.id}: filename skill incoerente`);
  for (const v of [...m.skills, ...m.courses]) for (const t of v.roadmap_taxonomy) if (!labels.includes(t)) errors.push(`${v.id}: taxonomy fuori allowlist ${t}`);
  for (const [i, mod] of m.modules.entries()) {
    const c = courses.get(mod.course_id), starter = m.scope.starter_modules.find(s => s.id === mod.id);
    if (!c?.planned_modules.some(p => p.id === mod.id) || !mod.id.startsWith(mod.course_id + '-')) errors.push(`${mod.id}: course/module mismatch`);
    if (mod.order !== Number(mod.id.slice(-2))) errors.push(`${mod.id}: ordine modulo incoerente`);
    if (starter && (starter.course_id !== mod.course_id || m.paths.modules[i] !== modulePath(mod, m))) errors.push(`${mod.id}: path/course starter incoerente`);
    if (!starter || mod.status !== 'draft') errors.push(`${mod.id}: modulo reale fuori starter draft`);
    for (const id of [...mod.prerequisite_skill_ids, ...mod.teaches_skill_ids, ...mod.reinforces_skill_ids]) if (!skills.has(id)) errors.push(`${mod.id}: skill assente ${id}`);
    for (const id of mod.teaches_skill_ids) if (!c?.primary_skill_ids.includes(id)) errors.push(`${mod.id}: teaches deve appartenere al corso`);
    if (assessments.get(mod.assessment_id)?.module_id !== mod.id) errors.push(`${mod.id}: assessment mismatch`);
    const dir = m.paths.modules[i].replace(/module.json$/, '');
    for (const file of ['lab.md', 'assessment.md', 'assessment.json', ...mod.artifacts]) if (!m.files.includes(dir + file)) errors.push(`${mod.id}: file/artifact mancante ${file}`);
    if (!same(mod.unit_ids, m.units.filter(u => u.module_id === mod.id).map(u => u.id))) errors.push(`${mod.id}: ownership unit divergente`);
    if (!same(mod.unit_ids, [mod.id + '-U01'])) errors.push(`${mod.id}: tranche limitata a U01`);
  }
  if (m.units.length !== 7 || m.lessons.length !== 7) errors.push('richieste 7 unit e 7 lesson nella tranche');
  for (const [i, u] of m.units.entries()) {
    if (!modules.get(u.module_id)?.unit_ids.includes(u.id) || !u.id.startsWith(u.module_id + '-U')) errors.push(`${u.id}: unit orfana/ownership module incoerente`);
    if (m.paths.units[i] !== unitPath(u, m)) errors.push(`${u.id}: path unit incoerente`);
    if (u.order !== Number(u.id.slice(-2)) || u.status !== 'draft') errors.push(`${u.id}: unit order/status fuori tranche`);
    if (!same(u.lesson_ids, m.lessons.filter(l => l.unit_id === u.id).map(l => l.id))) errors.push(`${u.id}: ownership lesson divergente`);
    if (!same(u.lesson_ids, [u.id + '-L01'])) errors.push(`${u.id}: tranche limitata a L01`);
  }
  const markdownPaths = [];
  for (const [i, l] of m.lessons.entries()) {
    if (!units.get(l.unit_id)?.lesson_ids.includes(l.id) || !l.id.startsWith(l.unit_id + '-L')) errors.push(`${l.id}: lesson orfana/ownership unit incoerente`);
    const p = lessonPath(l, m);
    if (m.paths.lessons[i] !== p) errors.push(`${l.id}: path lesson incoerente`);
    if (l.order !== Number(l.id.slice(-2)) || l.status !== 'draft') errors.push(`${l.id}: lesson order/status fuori tranche`);
    const md = p?.replace(/lesson.json$/, l.content_path);
    if (!md || !m.files.includes(md)) errors.push(`${l.id}: lesson Markdown mancante`);
    markdownPaths.push(md);
  }
  if (new Set(markdownPaths).size !== markdownPaths.length) errors.push('lesson duplicata in più record/path');
  for (const [i, a] of m.assessments.entries()) {
    const mod = modules.get(a.module_id);
    if (mod?.assessment_id !== a.id || a.id !== 'ASM-' + a.module_id) errors.push(`${a.id}: assessment/module mismatch`);
    if (mod && m.paths.assessments[i] !== modulePath(mod, m)?.replace(/module.json$/, 'assessment.json')) errors.push(`${a.id}: path assessment incoerente`);
    if (a.pass_rule.minimum_score > a.rubric.reduce((n, r) => n + r.max_score, 0)) errors.push(`${a.id}: pass rule irraggiungibile`);
    if (new Set(a.rubric.map(r => r.id)).size !== a.rubric.length) errors.push(`${a.id}: rubric ID duplicati`);
  }
  return errors;
}
runCLI(import.meta, () => validateMetadata(loadModel()));
