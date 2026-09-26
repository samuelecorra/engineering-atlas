import type generated from './generated/atlas.json';

export type AtlasData = typeof generated;
export type Course = AtlasData['courses'][number];
export type Module = AtlasData['modules'][number];
export type Unit = AtlasData['units'][number];
export type Lesson = AtlasData['lessons'][number];
export type Document = AtlasData['documents'][number];
export type Skill = AtlasData['skills'][number];
export type GraphNode = AtlasData['graph']['nodes'][number];

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
export function assertAtlasData(value: unknown): asserts value is AtlasData {
  if (!record(value) || value.generated !== true || value.schema_version !== '1.0.0' || typeof value.content_sha256 !== 'string'
    || !/^[a-f0-9]{64}$/.test(value.content_sha256)) throw new Error('Il catalogo locale non è valido.');
  for (const group of ['courses', 'modules', 'units', 'lessons', 'skills', 'documents', 'roadmaps', 'routes']) {
    const entries = value[group];
    if (!Array.isArray(entries) || entries.some(entry => !record(entry) || typeof entry.id !== 'string')) throw new Error('Il catalogo locale è incompleto.');
  }
  const data = value as unknown as AtlasData;
  if (!record(data.graph) || !Array.isArray(data.graph.nodes) || !Array.isArray(data.graph.edges)
    || !record(data.taxonomy) || !Array.isArray(data.taxonomy.records) || !record(data.learning_semantics)
    || data.learning_semantics.learner_mastery !== 'not-evaluated') throw new Error('Le relazioni del catalogo non sono disponibili.');
  const ids = new Set([...data.courses, ...data.modules, ...data.units, ...data.lessons].map(item => item.id));
  if (ids.size !== data.courses.length + data.modules.length + data.units.length + data.lessons.length
    || data.modules.some(m => !data.courses.some(c => c.id === m.course_id))
    || data.units.some(u => !data.modules.some(m => m.id === u.module_id))
    || data.lessons.some(l => !data.units.some(u => u.id === l.unit_id) || !data.documents.some(d => d.id === l.document_id))) throw new Error('Un collegamento del catalogo non è disponibile.');
  if (data.documents.some(d => typeof d.markdown !== 'string' || !record(d.links) || !Array.isArray(d.headings))) throw new Error('Un documento locale non è disponibile.');
  const strings = (items: unknown): items is string[] => Array.isArray(items) && items.every(item => typeof item === 'string');
  const localRoute = (route: unknown) => typeof route === 'string' && route.startsWith('/') && !route.startsWith('//') && !route.includes('\\');
  if (!data.courses.length || !data.roadmaps.length
    || data.courses.some(c => typeof c.title !== 'string' || !localRoute(c.route) || !strings(c.module_ids) || !strings(c.outcomes)
      || !strings(c.primary_skill_ids) || !strings(c.required_prerequisite_course_ids) || !strings(c.recommended_prerequisite_course_ids)
      || !Array.isArray(c.planned_modules) || c.planned_modules.some(m => !record(m) || typeof m.id !== 'string' || typeof m.title !== 'string' || typeof m.outcome !== 'string'))
    || data.modules.some(m => typeof m.title !== 'string' || !localRoute(m.route) || !strings(m.unit_ids) || !strings(m.outcomes)
      || !data.documents.some(d => d.id === m.lab_document_id) || !data.documents.some(d => d.id === m.assessment_document_id))
    || data.units.some(u => typeof u.title !== 'string' || !localRoute(u.route) || !strings(u.lesson_ids))
    || data.lessons.some(l => typeof l.title !== 'string' || !localRoute(l.route))) throw new Error('La struttura del catalogo è incompleta.');
  if (data.courses.some(c => c.module_ids.some(id => !data.modules.some(m => m.id === id && m.course_id === c.id)))
    || data.modules.some(m => m.unit_ids.some(id => !data.units.some(u => u.id === id && u.module_id === m.id)))
    || data.units.some(u => u.lesson_ids.some(id => !data.lessons.some(l => l.id === id && l.unit_id === u.id)))
    || data.roadmaps.some(r => typeof r.title !== 'string' || !strings(r.course_ids) || r.course_ids.some(id => !data.courses.some(c => c.id === id)))
    || data.routes.some(r => !localRoute(r.path))) throw new Error('Un percorso del catalogo non è risolvibile.');
  if (data.skills.some(s => typeof s.title !== 'string' || !record(s.ssri_coverage) || !record(s.ironmath_requirement)
    || !/^C[0-4]$/.test(s.ssri_coverage.level) || !/^M[0-4]$/.test(s.ironmath_requirement.level)
    || !record(s.gap) || typeof s.gap.note !== 'string')
    || data.learning_semantics.ssri_coverage !== 'source-coverage' || data.learning_semantics.ironmath_requirement !== 'target-requirement'
    || data.learning_semantics.local_progress !== 'reading-only') throw new Error('Le dimensioni di apprendimento non sono valide.');
  if (data.graph.nodes.some(n => !record(n) || typeof n.id !== 'string' || typeof n.title !== 'string' || typeof n.type !== 'string' || typeof n.path !== 'string')) throw new Error('Un nodo del grafo non è valido.');
  const graphIds = new Set(data.graph.nodes.map(n => n.id));
  if (graphIds.size !== data.graph.nodes.length || data.graph.edges.some(e => !record(e) || !graphIds.has(e.from) || !graphIds.has(e.to) || typeof e.type !== 'string')) throw new Error('Una relazione del grafo non è valida.');
  if (data.documents.some(d => !localRoute(d.route) || d.headings.some(h => !record(h) || typeof h.id !== 'string' || typeof h.text !== 'string' || ![1, 2, 3, 4, 5, 6].includes(h.level))
    || Object.values(d.links).some(target => typeof target !== 'string' || !(localRoute(target) || target.startsWith('#') || /^https:\/\/[^/\s]+/.test(target))))) throw new Error('Un collegamento del documento non è valido.');
}
export async function loadAtlas(loader: () => Promise<unknown> = async () => (await import('./generated/atlas.json')).default): Promise<AtlasData> {
  const value = await loader(); assertAtlasData(value); return value;
}

export function searchAtlas(data: AtlasData, query: string) {
  const terms = query.toLocaleLowerCase('it').trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const entries = [
    ...data.courses.map(c => ({ id: c.id, title: c.title, route: c.route, kind: 'Corso', status: c.status, text: c.outcomes.join(' ') })),
    ...data.modules.map(m => ({ id: m.id, title: m.title, route: m.route, kind: 'Modulo', status: m.status, text: m.outcomes.join(' ') })),
    ...data.lessons.map(l => ({ id: l.id, title: l.title, route: l.route, kind: 'Lezione', status: l.status, text: data.documents.find(d => d.id === l.document_id)?.markdown ?? '' })),
  ];
  return entries.filter(e => terms.every(term => `${e.id} ${e.title} ${e.text}`.toLocaleLowerCase('it').includes(term))).slice(0, 30);
}
