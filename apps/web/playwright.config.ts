import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
export default defineConfig({
  testDir: './e2e', fullyParallel: false, workers: 1, retries: 0,
  timeout: 45_000, reporter: 'list', outputDir: '../../.lab-runs/web-browser',
  use: { baseURL: 'http://127.0.0.1:5174', browserName: 'chromium', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' },
  webServer: { command: 'npm run dev --workspace apps/web -- --port 5174', cwd: root, url: 'http://127.0.0.1:5174', reuseExistingServer: false, timeout: 30_000 },
});
