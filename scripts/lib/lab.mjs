import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './repository.mjs';
export const LAB_ROOT = path.join(ROOT, '.lab-runs');
function ensureLabRoot() {
  fs.mkdirSync(LAB_ROOT, { recursive: true });
  if (fs.lstatSync(LAB_ROOT).isSymbolicLink() || path.dirname(fs.realpathSync(LAB_ROOT)) !== fs.realpathSync(ROOT)) throw new Error('La directory lab deve essere interna ad Atlas, senza symlink.');
}
export function createLab(label) {
  if (!/^[a-z0-9-]+$/.test(label)) throw new Error('Etichetta lab non valida.');
  ensureLabRoot();
  const dir = fs.mkdtempSync(path.join(LAB_ROOT, `lab-${label}-`));
  fs.writeFileSync(path.join(dir, '.atlas-lab.json'), JSON.stringify({ owner: 'engineering-atlas', label }) + '\n');
  return dir;
}
export function checkedLab(input) {
  ensureLabRoot();
  const dir = path.resolve(ROOT, input);
  if (path.dirname(dir) !== path.resolve(LAB_ROOT) || !path.basename(dir).startsWith('lab-') || fs.lstatSync(dir).isSymbolicLink()) throw new Error('Serve il path esatto di una directory lab creata da Atlas.');
  if (fs.realpathSync(path.dirname(dir)) !== fs.realpathSync(LAB_ROOT)) throw new Error('Parent lab non valido.');
  const marker = path.join(dir, '.atlas-lab.json');
  if (fs.lstatSync(marker).isSymbolicLink() || JSON.parse(fs.readFileSync(marker, 'utf8')).owner !== 'engineering-atlas') throw new Error('Marker lab assente o invalido.');
  return dir;
}
export function cleanupLab(input) { fs.rmSync(checkedLab(input), { recursive: true, force: false }); }
export function write(dir, p, text) {
  fs.mkdirSync(path.dirname(path.join(dir, p)), { recursive: true }); fs.writeFileSync(path.join(dir, p), text);
}
export function run(command, args, cwd, { expected = 0, env = process.env } = {}) {
  const childEnv = { ...env };
  // node:test marks its own worker processes. A separately invoked test suite must
  // not inherit that marker or Node can suppress the nested runner's execution/output.
  delete childEnv.NODE_TEST_CONTEXT;
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: childEnv, timeout: 45000, windowsHide: true });
  if (result.error) throw new Error(`${command}: ${result.error.message}`);
  if (expected !== null && result.status !== expected) throw new Error(`${command} ${args.join(' ')}: exit ${result.status}\n${result.stdout}\n${result.stderr}`);
  return result;
}
export function gitFactory(lab) {
  const home = path.join(lab, 'git-config'); fs.mkdirSync(home, { recursive: true });
  const empty = path.join(home, 'empty'); write(home, 'empty', '# Isolated lab configuration\n');
  const hooks = path.join(home, 'hooks'); fs.mkdirSync(hooks, { recursive: true });
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
  Object.assign(env, { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: empty, GIT_TERMINAL_PROMPT: '0', GIT_EDITOR: 'true', GIT_SEQUENCE_EDITOR: 'true' });
  return (cwd, args, expected = 0) => run('git', ['-c', 'user.name=Atlas Fixture', '-c', 'user.email=atlas@example.invalid', '-c', 'commit.gpgsign=false', '-c', `core.hooksPath=${hooks}`, '-c', 'core.autocrlf=false', '-c', 'protocol.allow=never', '-c', 'protocol.file.allow=always', ...args], cwd, { expected, env });
}
export function configureClone(git, dir) {
  git(dir, ['config', 'user.name', 'Atlas Fixture']);
  git(dir, ['config', 'user.email', 'atlas@example.invalid']);
  git(dir, ['config', 'commit.gpgsign', 'false']);
  git(dir, ['config', 'core.autocrlf', 'false']);
}
export function pythonCommand() {
  if (process.env.ATLAS_PYTHON) return { command: process.env.ATLAS_PYTHON, args: [] };
  for (const [command, args] of process.platform === 'win32' ? [['python', []], ['py', ['-3']]] : [['python3', []], ['python', []]]) {
    const probe = spawnSync(command, [...args, '-c', 'import sys; sys.exit(0 if sys.version_info >= (3,10) else 1)'], { encoding: 'utf8', timeout: 10000 });
    if (probe.status === 0) return { command, args };
  }
  throw new Error('Python 3.10+ necessario: impostare ATLAS_PYTHON al percorso interprete.');
}
