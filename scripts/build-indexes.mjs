import { loadModel, ROOT, runCLI, json, coursePath, modulePath, writeArtifacts } from './lib/repository.mjs';
export function renderIndexes(m) {
  const index = entries => json({ generated: true, source: 'canonical course/module metadata', regenerate: 'npm run build:indexes', entries });
  return {
    'catalog/indexes/courses.json': index([...m.courses].sort((a, b) => a.order - b.order).map(c => ({ id: c.id, title: c.title, status: c.status, path: coursePath(c) }))),
    'catalog/indexes/modules.json': index([...m.modules].sort((a, b) => a.id < b.id ? -1 : 1).map(mod => ({ id: mod.id, title: mod.title, status: mod.status, path: modulePath(mod, m) }))),
  };
}
runCLI(import.meta, () => { writeArtifacts(ROOT, renderIndexes(loadModel())); });
