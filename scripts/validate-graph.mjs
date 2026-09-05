import { loadModel, runCLI, coursePath, modulePath, unitPath, lessonPath, slug } from './lib/repository.mjs';
import { validateSchema } from './lib/schema.mjs';

export const edgeKey = e => `${e.type}|${e.from}|${e.to}`;
const strengths = { PREREQUISITE_OF: 'required', RECOMMENDED_BEFORE: 'recommended', PART_OF: 'structural',
  REINFORCES: 'supporting', EVIDENCED_BY: 'supporting', REQUIRES_MASTERY: 'required', MAPS_TO_TAXONOMY: 'supporting' };
export function checkGraph(graph, courseOrders = new Map()) {
  const errors = [], ids = new Set(graph.nodes.map(n => n.id)), seen = new Set();
  if (ids.size !== graph.nodes.length) errors.push('node ID duplicati');
  const adj = new Map([...ids].map(id => [id, []]));
  for (const e of graph.edges) {
    if (!ids.has(e.from) || !ids.has(e.to)) errors.push(`endpoint assente: ${edgeKey(e)}`);
    if (e.from === e.to) errors.push(`self-loop: ${e.from}`);
    if (seen.has(edgeKey(e))) errors.push(`arco duplicato: ${edgeKey(e)}`);
    seen.add(edgeKey(e));
    if (!strengths[e.type] || e.strength !== strengths[e.type]) errors.push(`edge type/strength invalidi: ${edgeKey(e)}`);
    if (typeof e.rationale !== 'string' || !e.rationale.trim()) errors.push('rationale vuota');
    if (e.type === 'PREREQUISITE_OF') {
      adj.get(e.from)?.push(e.to);
      if (courseOrders.has(e.from) && courseOrders.has(e.to) && courseOrders.get(e.from) >= courseOrders.get(e.to)) errors.push(`prerequisite viola ordine: ${e.from} → ${e.to}`);
    }
  }
  const visiting = new Set(), visited = new Set();
  function visit(id) {
    if (visiting.has(id)) { errors.push(`ciclo required: ${id}`); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const child of adj.get(id) ?? []) visit(child);
    visiting.delete(id); visited.add(id);
  }
  for (const id of ids) visit(id);
  return errors;
}
export function expectedGraph(m) {
  const nodes = [], edges = [];
  const node = (id, type, title, path) => nodes.push({ id, type, title, path });
  const edge = (from, to, type) => edges.push({ from, to, type });
  for (const c of m.courses) {
    node(c.id, 'course', c.title, coursePath(c));
    for (const p of c.required_prerequisite_course_ids) edge(p, c.id, 'PREREQUISITE_OF');
    for (const p of c.recommended_prerequisite_course_ids) edge(p, c.id, 'RECOMMENDED_BEFORE');
    for (const s of c.reinforced_skill_ids) edge(c.id, s, 'REINFORCES');
    for (const t of c.roadmap_taxonomy) edge(c.id, 'taxonomy.' + slug(t), 'MAPS_TO_TAXONOMY');
  }
  for (const s of m.skills) {
    node(s.id, 'skill', s.title, `catalog/skills/${s.id}.json`);
    edge(s.id, s.primary_course_id, 'PART_OF');
    edge(s.id, s.ironmath_requirement.level, 'REQUIRES_MASTERY');
    for (const e of [...s.ssri_coverage.evidence_ids, ...s.ironmath_requirement.evidence_ids]) edge(s.id, e, 'EVIDENCED_BY');
    for (const t of s.roadmap_taxonomy) edge(s.id, 'taxonomy.' + slug(t), 'MAPS_TO_TAXONOMY');
  }
  for (const e of m.evidence) node(e.id, 'evidence', e.claim, `sources/evidence/${e.repository_id === 'ssri' ? 'ssri-coverage' : 'ironmath-requirements'}.json`);
  for (const t of m.taxonomy.records) node('taxonomy.' + slug(t.label), 'taxonomy', t.label, 'sources/taxonomies/roadmap-sh.json');
  for (const level of ['M0', 'M1', 'M2', 'M3', 'M4']) node(level, 'mastery', level, 'governance/MASTERY_MODEL.md');
  for (const mod of m.modules) {
    node(mod.id, 'module', mod.title, modulePath(mod, m));
    edge(mod.id, mod.course_id, 'PART_OF');
    for (const s of [...mod.teaches_skill_ids, ...mod.reinforces_skill_ids]) edge(mod.id, s, 'REINFORCES');
  }
  for (const u of m.units) {
    node(u.id, 'unit', u.title, unitPath(u, m));
    edge(u.id, u.module_id, 'PART_OF');
  }
  for (const l of m.lessons) {
    node(l.id, 'lesson', l.title, lessonPath(l, m));
    edge(l.id, l.unit_id, 'PART_OF');
  }
  for (const a of m.assessments) {
    const mod = m.modules.find(v => v.id === a.module_id);
    node(a.id, 'assessment', a.id, mod ? modulePath(mod, m)?.replace(/module.json$/, 'assessment.json') : null);
    edge(a.id, a.module_id, 'PART_OF');
  }
  return { nodes, edges };
}
export function validateGraph(m) {
  const errors = validateSchema(m.graph, m.schemas.graph, 'graph');
  if (errors.length) return errors;
  errors.push(...checkGraph(m.graph, new Map(m.courses.map(c => [c.id, c.order]))));
  const expected = expectedGraph(m), nodes = new Map(m.graph.nodes.map(n => [n.id, n]));
  for (const n of expected.nodes) {
    const actual = nodes.get(n.id);
    if (!actual || ['type', 'title', 'path'].some(k => actual[k] !== n[k])) errors.push(`${n.id}: nodo canonico mancante o incoerente`);
  }
  for (const n of m.graph.nodes) {
    if (!expected.nodes.some(e => e.id === n.id)) errors.push(`${n.id}: nodo non canonico`);
    if (!m.files.includes(n.path)) errors.push(`${n.id}: path locale nodo assente`);
  }
  const desired = new Set(expected.edges.map(edgeKey)), actual = new Set(m.graph.edges.map(edgeKey));
  for (const k of desired) if (!actual.has(k)) errors.push(`relazione canonica mancante: ${k}`);
  for (const k of actual) if (!desired.has(k)) errors.push(`relazione non sostenuta dai metadata: ${k}`);
  const reachable = new Set(m.courses.map(c => c.id));
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of m.graph.edges) if (e.type === 'PART_OF' && reachable.has(e.to) && !reachable.has(e.from)) { reachable.add(e.from); changed = true; }
  }
  for (const s of [...m.skills, ...m.modules, ...m.units, ...m.lessons]) if (['planned', 'draft', 'reviewed', 'validated'].includes(s.status) && !reachable.has(s.id)) errors.push(`${s.id}: ${m.skills.includes(s) ? 'skill' : 'entità'} non raggiungibile da corso`);
  return errors;
}
runCLI(import.meta, () => validateGraph(loadModel()));
