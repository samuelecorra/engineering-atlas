import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, walk, readJSON } from './repository.mjs';

export function validatePolicy(root = ROOT) {
  const errors = [], files = walk(root);
  const forbidden = /(^|\/)(?:CNAME|_config\.ya?ml|wrangler\.(?:toml|jsonc?)|railway\.(?:toml|json)|vercel\.json|netlify\.toml|firebase\.json|Dockerfile|docker-compose\.ya?ml|\.gitmodules)$/i;
  for (const p of files) {
    if (/^\.github\/workflows\/.*\.ya?ml$/i.test(p) || p.startsWith('.openai/') || p.startsWith('docs/_site/') || p.startsWith('_site/') || p.startsWith('dist/') || p.startsWith('public/') || p === 'index.html' || forbidden.test(p)) errors.push(`${p}: hosting/workflow/runtime artifact vietato`);
  }
  for (const [adapter, target] of [['AGENTS.md', 'governance/AGENT_POLICY.md'], ['CLAUDE.md', 'governance/AGENT_POLICY.md'], ['.github/copilot-instructions.md', '../governance/AGENT_POLICY.md']]) {
    const text = fs.readFileSync(path.join(root, adapter), 'utf8');
    if (!text.includes(`](${target})`)) errors.push(`${adapter}: riferimento policy canonica mancante`);
    if (text.split(/\s+/).length > 140 || text.split('\n').length > 18) errors.push(`${adapter}: adapter esteso, rischio copia divergente`);
    if (!['npm run validate', 'npm test', 'npm run check:generated', 'sette', 'secret', 'fratelli'].every(t => text.includes(t))) errors.push(`${adapter}: confini/comandi mancanti`);
  }
  const pkg = readJSON(root, 'package.json'), lock = readJSON(root, 'package-lock.json');
  if (pkg.private !== true || pkg.type !== 'module' || pkg.engines?.node !== '>=24 <25') errors.push('package: private/ESM/Node24 richiesti');
  for (const key of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'workspaces']) if (pkg[key] && Object.keys(pkg[key]).length) errors.push(`package: ${key} fuori scope`);
  if (Object.keys(lock.packages ?? {}).some(p => p !== '')) errors.push('lockfile contiene dipendenze');
  if (lock.name !== pkg.name || lock.version !== pkg.version || lock.packages?.['']?.version !== pkg.version || lock.packages?.['']?.engines?.node !== pkg.engines.node) errors.push('lockfile root non allineato al manifest');
  if (Object.values(pkg.scripts ?? {}).some(s => /ironmath|cybersec|\.\.\/|https?:|\b(?:deploy|publish|push|curl|wget)\b/.test(s))) errors.push('riferimento runtime/sibling/rete negli script');
  if (!fs.readFileSync(path.join(root, '.gitignore'), 'utf8').split(/\r?\n/).includes('progress/learner-profile.json')) errors.push('progress privato non ignorato');
  const git = spawnSync('git', ['-C', root, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  if (git.status === 0 && path.resolve(git.stdout.trim()) === path.resolve(root)) {
    const remotes = spawnSync('git', ['-C', root, 'remote'], { encoding: 'utf8' });
    if (remotes.status !== 0) errors.push('Impossibile verificare i remote Git');
    const names = remotes.stdout.trim().split(/\r?\n/).filter(Boolean);
    for (const name of names) {
      if (name !== 'origin') { errors.push('Remote non previsto dalla policy GitHub'); continue; }
      for (const flags of [[], ['--push']]) {
        const urls = spawnSync('git', ['-C', root, 'remote', 'get-url', '--all', ...flags, name], { encoding: 'utf8' });
        const targets = urls.stdout.trim().split(/\r?\n/).filter(Boolean);
        const official = /^(?:https:\/\/github\.com\/samuelecorra\/engineering-atlas|git@github\.com:samuelecorra\/engineering-atlas|ssh:\/\/git@github\.com\/samuelecorra\/engineering-atlas)(?:\.git)?$/;
        if (urls.status !== 0 || targets.length === 0 || targets.some(url => !official.test(url))) errors.push('Origin deve puntare alla repository GitHub ufficiale, per fetch e push');
      }
    }
    const ignored = spawnSync('git', ['-C', root, 'check-ignore', '--no-index', 'progress/learner-profile.json'], { encoding: 'utf8' });
    if (ignored.status !== 0) errors.push('Git non ignora progress reale');
  }
  for (const p of files.filter(p => p.endsWith('.json') && /^(catalog|sources|curriculum|graph|governance)\//.test(p) && !p.includes('/fixtures/'))) {
    const text = fs.readFileSync(path.join(root, p), 'utf8');
    if (/(?:\/Users\/|\/home\/|[A-Za-z]:\\\\Users\\\\|file:\/\/)/.test(text)) errors.push(`${p}: path assoluto personale`);
  }
  for (const p of files.filter(p => /\.(?:mjs|py)$/.test(p))) {
    const text = fs.readFileSync(path.join(root, p), 'utf8');
    if (/(?:from\s+["']|import\s*\(["']|require\s*\(["'])[^"']*(?:\.\.\/ironmath|\.\.\/cybersec)/.test(text)) errors.push(`${p}: import runtime sibling`);
  }
  return errors;
}
