import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { ROOT, runCLI } from '../../../../../../scripts/lib/repository.mjs';
import { createLab, cleanupLab, run, write, gitFactory, configureClone, pythonCommand } from '../../../../../../scripts/lib/lab.mjs';
const HERE = fileURLToPath(new URL('.', import.meta.url));

export function setup() {
  const dir = createLab('python'); fs.cpSync(HERE, path.join(dir, 'fixture'), { recursive: true });
  const py = pythonCommand(); run(py.command, [...py.args, '-m', 'venv', path.join(dir, 'fixture/.venv')], dir);
  return dir;
}
export function verify(dir) {
  const cwd = path.join(dir, 'fixture'), py = path.join(cwd, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
  const env = { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }; delete env.PYTHONPATH; delete env.PYTHONHOME;
  const context = run(py, ['-c', 'import sys; assert sys.prefix != sys.base_prefix; print("venv isolated")'], cwd, { env });
  assert.match(context.stdout, /venv isolated/);
  assert.match(run(py, ['-m', 'pip', '--version'], cwd, { env }).stdout, /pip/);
  const missing = run(py, ['-I', '-c', 'import atlas_fixture'], cwd, { expected: 1, env });
  assert.match(missing.stderr, /ModuleNotFoundError/);
  assert.match(run(py, ['run_tests.py'], cwd, { env }).stderr, /Ran 2 tests/);
  const moduleRun = run(py, ['-m', 'atlas_fixture'], path.join(cwd, 'src'), { env }); assert.match(moduleRun.stdout, /mean=4.0/);
}

runCLI(import.meta, () => {
  const dir = setup();
  if (process.argv.includes('--verify')) {
    try { verify(dir); } finally { cleanupLab(dir); }
  } else console.log('Fixture: ' + path.relative(ROOT, dir).split(path.sep).join('/'));
});
