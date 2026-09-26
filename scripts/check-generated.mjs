import fs from 'node:fs';
import path from 'node:path';
import { loadModel, ROOT, runCLI } from './lib/repository.mjs';
import { renderIndexes } from './build-indexes.mjs';
import { renderReports } from './build-reports.mjs';
import { renderWebData } from './build-web-data.mjs';
export function checkGenerated(root = ROOT, m = loadModel(root)) {
  const errors = [], artifacts = { ...renderIndexes(m), ...renderReports(m), ...renderWebData(m) };
  for (const [p, text] of Object.entries(artifacts)) {
    const actual = fs.existsSync(path.join(root, p)) ? fs.readFileSync(path.join(root, p)) : null;
    if (!actual?.equals(Buffer.from(text))) errors.push(`${p}: generated obsoleto o assente`);
  }
  for (const dir of ['reports', 'catalog/indexes', 'apps/web/src/generated']) if (fs.existsSync(path.join(root, dir))) {
    for (const f of fs.readdirSync(path.join(root, dir))) if (f !== '.DS_Store' && !(dir + '/' + f in artifacts)) errors.push(`${dir}/${f}: generated inatteso`);
  }
  return errors;
}
runCLI(import.meta, () => checkGenerated());
