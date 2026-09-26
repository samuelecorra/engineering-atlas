import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const temp = path.join(root, '.work', 'tmp');
mkdirSync(temp, { recursive: true });
const env = { ...process.env, PLAYWRIGHT_BROWSERS_PATH: path.join(root, '.work', 'playwright-browsers'), TMPDIR: temp, TEMP: temp, TMP: temp };
// Playwright sets FORCE_COLOR in child processes even when the parent does not.
delete env.NO_COLOR;
const action = process.argv[2];
if (!['install', 'test'].includes(action)) throw new Error('Usage: node scripts/web-browser.mjs install|test');
const args = action === 'install' ? ['install', 'chromium'] : ['test', '--config', 'apps/web/playwright.config.ts'];
const result = spawnSync(process.execPath, [path.join(root, 'node_modules', '@playwright', 'test', 'cli.js'), ...args], { cwd: root, env, stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
