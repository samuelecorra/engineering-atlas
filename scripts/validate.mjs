import { loadModel, ROOT, runCLI } from './lib/repository.mjs';
import { validateMetadata } from './validate-metadata.mjs';
import { validateGraph } from './validate-graph.mjs';
import { validateLinks } from './validate-links.mjs';
import { validateContent } from './validate-content.mjs';
import { validatePolicy } from './lib/policy.mjs';
import { checkGenerated } from './check-generated.mjs';
runCLI(import.meta, () => {
  const model = loadModel();
  const errors = validateMetadata(model);
  if (errors.length) return errors;
  return [...validateGraph(model), ...validateLinks(), ...validateContent(ROOT, model), ...validatePolicy(), ...checkGenerated(ROOT, model)];
});
