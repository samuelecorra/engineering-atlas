import { loadModel, ROOT, runCLI, json, coursePath, modulePath, unitPath, lessonPath, writeArtifacts } from './lib/repository.mjs';
export function renderIndexes(m) {
  const index = entries => json({ generated: true, source: 'canonical course/module/unit/lesson metadata', regenerate: 'npm run build:indexes', entries });
  return {
    'catalog/indexes/courses.json': index([...m.courses].sort((a, b) => a.order - b.order).map(c => ({ id: c.id, title: c.title, status: c.status, path: coursePath(c) }))),
    'catalog/indexes/modules.json': index([...m.modules].sort((a, b) => a.id < b.id ? -1 : 1).map(mod => ({ id: mod.id, title: mod.title, status: mod.status, path: modulePath(mod, m) }))),
    'catalog/indexes/units.json': index([...m.units].sort((a, b) => a.id < b.id ? -1 : 1).map(u => ({ id: u.id, title: u.title, status: u.status, path: unitPath(u, m) }))),
    'catalog/indexes/lessons.json': index([...m.lessons].sort((a, b) => a.id < b.id ? -1 : 1).map(l => ({ id: l.id, title: l.title, status: l.status, path: lessonPath(l, m) }))),
  };
}
runCLI(import.meta, () => { writeArtifacts(ROOT, renderIndexes(loadModel())); });
