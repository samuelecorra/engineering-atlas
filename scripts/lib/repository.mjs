import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const ignored = new Set(['.git', '.work', '.lab-runs', '.DS_Store', 'node_modules', '.venv', '__pycache__']);
export const posix = p => p.split(path.sep).join('/');
export const json = value => JSON.stringify(value, null, 2) + '\n';
export const readJSON = (root, p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
export function walk(root, dir = '') {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : 1)
    .flatMap(entry => {
      if (ignored.has(entry.name) || entry.name.endsWith('.egg-info')) return [];
      const p = posix(path.join(dir, entry.name));
      if (p === '.agents/skills/impeccable') return []; // Local third-party tool, never curriculum or generated data.
      if (p === 'progress/learner-profile.json') return [];
      // Symlinks are reported, never followed into another repository or private data.
      return entry.isDirectory() ? walk(root, p) : [p];
    });
}
export function loadModel(root = ROOT) {
  const files = walk(root);
  const groups = {
    skills: files.filter(p => /^catalog\/skills\/.*\.json$/.test(p)),
    courses: files.filter(p => /^curriculum\/courses\/[^/]+\/course\.json$/.test(p)),
    modules: files.filter(p => /^curriculum\/courses\/[^/]+\/modules\/[^/]+\/module\.json$/.test(p)),
    units: files.filter(p => /^curriculum\/courses\/[^/]+\/modules\/[^/]+\/units\/[^/]+\/unit\.json$/.test(p)),
    lessons: files.filter(p => /^curriculum\/courses\/[^/]+\/modules\/[^/]+\/units\/[^/]+\/lessons\/[^/]+\/lesson\.json$/.test(p)),
    assessments: files.filter(p => /^curriculum\/courses\/[^/]+\/modules\/[^/]+\/assessment\.json$/.test(p)),
  };
  const model = { root, files, paths: groups };
  for (const [key, paths] of Object.entries(groups)) model[key] = paths.map(p => readJSON(root, p));
  for (const [key, p] of Object.entries({ repositories: 'sources/repositories.json', scope: 'governance/scope.json',
    taxonomy: 'sources/taxonomies/roadmap-sh.json', allowlist: 'catalog/taxonomy-allowlist.json',
    graph: 'graph/knowledge-graph.json', profile: 'progress/learner-profile.example.json' })) model[key] = readJSON(root, p);
  model.sourceCollections = ['sources/evidence/ssri-coverage.json', 'sources/evidence/ironmath-requirements.json'].map(p => readJSON(root, p));
  model.evidence = model.sourceCollections.flatMap(c => c.records);
  model.schemas = Object.fromEntries(files.filter(p => /^schemas\/.*\.schema\.json$/.test(p)).map(p => [path.basename(p, '.schema.json'), readJSON(root, p)]));
  return model;
}
export function runCLI(meta, fn) {
  if (!process.argv[1] || pathToFileURL(path.resolve(process.argv[1])).href !== meta.url) return;
  try {
    if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Richiesto Node 24.');
    const errors = fn() ?? [];
    if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
    else console.log(`${path.basename(process.argv[1])}: OK`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
export function writeArtifacts(root, artifacts) {
  for (const [p, content] of Object.entries(artifacts)) {
    fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
    fs.writeFileSync(path.join(root, p), content);
  }
}
export const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const coursePath = c => `curriculum/courses/${c.id}-${c.slug}/course.json`;
export function modulePath(m, model) {
  const course = model.courses.find(c => c.id === m.course_id);
  const slice = model.scope.starter_modules.find(s => s.id === m.id);
  return course && slice ? `${path.posix.dirname(coursePath(course))}/modules/${slice.directory}/module.json` : null;
}
export function unitPath(unit, model) {
  const parent = model.modules.find(m => m.id === unit.module_id);
  const p = parent && modulePath(parent, model);
  return p ? `${path.posix.dirname(p)}/units/${unit.id}-${unit.slug}/unit.json` : null;
}
export function lessonPath(lesson, model) {
  const parent = model.units.find(u => u.id === lesson.unit_id);
  const p = parent && unitPath(parent, model);
  return p ? `${path.posix.dirname(p)}/lessons/${lesson.id}-${lesson.slug}/lesson.json` : null;
}
