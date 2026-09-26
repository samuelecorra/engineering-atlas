import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT, loadModel, runCLI, json, coursePath, modulePath, unitPath, lessonPath, writeArtifacts } from './lib/repository.mjs';
import { validateMetadata } from './validate-metadata.mjs';
import { validateGraph } from './validate-graph.mjs';
import { markdownLinks, headingAnchors, prose } from './validate-links.mjs';
import { personalPath } from './validate-provenance.mjs';
import { secretLooking } from './lib/content-safety.mjs';

export const WEB_DATA_PATH = 'apps/web/src/generated/atlas.json';
const sorted = values => [...values].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

export function createWebData(m) {
  const errors = [...validateMetadata(m), ...validateGraph(m)];
  if (errors.length) throw new Error(`web-data: fonti incoerenti\n${errors.join('\n')}`);
  const routes = [{ path: '/', kind: 'dashboard', id: 'atlas' }, { path: '/roadmaps', kind: 'roadmap-index', id: 'roadmaps' },
    { path: '/graph', kind: 'graph', id: 'graph' }, { path: '/progress', kind: 'progress', id: 'progress' }];
  const sourceRoutes = {}, documents = [];
  const route = (kind, id, p, source) => { routes.push({ kind, id, path: p }); if (source) sourceRoutes[source] = p; return p; };
  const doc = (id, title, source, p, status = 'reference') => {
    if (!m.files.includes(source)) throw new Error(`web-data: documento mancante ${source}`);
    const markdown = fs.readFileSync(path.join(m.root, source), 'utf8');
    const document = { id, title, source_path: source, route: p, status, markdown, links: {}, headings: [] };
    // Reader anchors use the same algorithm as the repository link gate, including duplicate headings.
    const anchors = [...headingAnchors(markdown)];
    document.headings = [...prose(markdown).matchAll(/^ {0,3}(#{1,6})\s+(.+?)\s*#*$/gm)]
      .map((h, i) => ({ level: h[1].length, text: h[2], id: anchors[i] }));
    documents.push(document); sourceRoutes[source] = p;
    return id;
  };
  const courses = sorted(m.courses).map(c => ({ ...c, source_path: coursePath(c), route: route('course', c.id, `/courses/${c.id}`, coursePath(c)), module_ids: m.modules.filter(mod => mod.course_id === c.id).map(mod => mod.id).sort() }));
  const modules = sorted(m.modules).map(mod => {
    const source = modulePath(mod, m), p = route('module', mod.id, `/modules/${mod.id}`, source);
    const lab = doc(`${mod.id}.lab`, `Lab — ${mod.title}`, source.replace(/module.json$/, 'lab.md'), p + '?view=lab', mod.status);
    const assessment = doc(`${mod.id}.assessment`, `Assessment — ${mod.title}`, source.replace(/module.json$/, 'assessment.md'), p + '?view=assessment', mod.status);
    sourceRoutes[source.replace(/module.json$/, 'assessment.json')] = p + '?view=assessment';
    return { ...mod, source_path: source, route: p, lab_document_id: lab, assessment_document_id: assessment };
  });
  const units = sorted(m.units).map(u => ({ ...u, source_path: unitPath(u, m), route: route('unit', u.id, `/units/${u.id}`, unitPath(u, m)) }));
  const lessons = sorted(m.lessons).map(l => {
    const source = lessonPath(l, m), p = route('lesson', l.id, `/lessons/${l.id}`, source);
    return { ...l, source_path: source, route: p, document_id: doc(l.id, l.title, source.replace(/lesson.json$/, 'lesson.md'), p, l.status) };
  });
  const reading = route('document', 'ironmath-reading-map', '/documents/ironmath-reading-map');
  doc('ironmath-reading-map', 'Mappa di lettura IronMath', 'projects/ironmath-reading-map.md', reading);
  const practical = route('document', 'practical-engineering', '/documents/practical-engineering');
  doc('practical-engineering', 'Da dove iniziare: il percorso pratico', 'projects/practical-engineering.md', practical);
  const roadmapId = 'atlas-maintainer';
  const roadmaps = [{ id: roadmapId, title: 'Dalle basi alla manutenzione', description: 'Inizia da VS Code, poi segui i venti corsi del percorso di manutenzione. I rami rispettano i prerequisiti e possono essere studiati in parallelo.',
    route: route('roadmap', roadmapId, `/roadmaps/${roadmapId}`), course_ids: [...m.courses].sort((a, b) => (a.id === 'EAT-021' ? -1 : b.id === 'EAT-021' ? 1 : a.order - b.order)).map(c => c.id), generated: true }];
  for (const document of documents) for (const raw of markdownLinks(document.markdown)) {
    if (/^https?:\/\//.test(raw) || raw.startsWith('#')) { document.links[raw] = raw; continue; }
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('/')) throw new Error(`web-data: link non consentito ${document.id}`);
    const [relative, anchor] = decodeURIComponent(raw).split('#');
    const source = path.posix.normalize(path.posix.join(path.posix.dirname(document.source_path), relative));
    if (!sourceRoutes[source]) throw new Error(`web-data: riferimento non risolvibile ${document.id}: ${raw}`);
    document.links[raw] = sourceRoutes[source] + (anchor ? '#' + anchor : '');
  }
  const payload = { schema_version: '1.0.0', generated: true, regenerate: 'npm run build:web-data',
    sources: ['curriculum/courses/', 'catalog/skills/', 'graph/knowledge-graph.json', 'sources/taxonomies/roadmap-sh.json', 'projects/ironmath-reading-map.md', 'projects/practical-engineering.md'],
    courses, modules, units, lessons, assessments: sorted(m.assessments), skills: sorted(m.skills), taxonomy: m.taxonomy,
    graph: { ...m.graph, nodes: sorted(m.graph.nodes), edges: [...m.graph.edges].sort((a, b) => `${a.type}|${a.from}|${a.to}`.localeCompare(`${b.type}|${b.from}|${b.to}`, 'en')) },
    roadmaps, documents: sorted(documents), routes: routes.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0),
    learning_semantics: { ssri_coverage: 'source-coverage', ironmath_requirement: 'target-requirement', learner_mastery: 'not-evaluated', local_progress: 'reading-only' } };
  const serialized = json(payload);
  if (personalPath(serialized) || secretLooking(serialized) || /learner-profile\.json/.test(serialized)) throw new Error('web-data: contenuto personale o sensibile');
  return { ...payload, content_sha256: createHash('sha256').update(serialized).digest('hex') };
}
export function renderWebData(m) { return { [WEB_DATA_PATH]: json(createWebData(m)) }; }
runCLI(import.meta, () => { writeArtifacts(ROOT, renderWebData(loadModel())); });
