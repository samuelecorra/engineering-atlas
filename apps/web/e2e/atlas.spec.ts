import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import data from '../src/generated/atlas.json' with { type: 'json' };
const require = createRequire(import.meta.url);
const review = fileURLToPath(new URL('../../../.impeccable/review/2026-09-08/', import.meta.url));
mkdirSync(review, { recursive: true });
async function settle(page: Page) { await page.locator('h1').waitFor(); await page.locator('[aria-busy="true"]').waitFor({ state: 'detached' }); await page.evaluate(() => document.fonts.ready); }
async function noOverflow(page: Page) { expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true); }
async function shot(page: Page, name: string, fullPage = true) { await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: `${review}/${name}.png`, fullPage, animations: 'disabled' }); }
async function axe(page: Page) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => (await (window as unknown as { axe: { run: (context: unknown, options: unknown) => Promise<{ violations: { id: string; impact: string; nodes: { target: string[]; failureSummary: string }[] }[] }> } }).axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations);
  expect(violations).toEqual([]);
}

test('map composition, responsive frames and no horizontal page overflow', async ({ page }) => {
  for (const [width, height, name] of [[1536, 1024, 'user-1536'], [1440, 1000, 'desktop'], [1280, 900, 'laptop'], [768, 1024, 'tablet'], [390, 844, 'mobile'], [360, 800, 'narrow-mobile'], [320, 800, 'zoom-reflow']] as const) {
    await page.setViewportSize({ width, height }); await page.goto('/'); await settle(page); await noOverflow(page); await shot(page, name);
    expect(await page.locator(width <= 1023 ? '.map-list > li' : '.course-node').count()).toBe(21);
  }
});
test('keyboard map, accessible list, prerequisites and real course opening', async ({ page }) => {
  await page.goto('/'); await settle(page);
  const first = page.getByRole('button', { name: /^Seleziona EAT-001:/ }); await first.focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: /^Seleziona EAT-002:/ })).toBeFocused();
  await page.getByRole('button', { name: 'Vista elenco' }).click();
  await page.getByRole('button', { name: /EAT-016 Production Python/ }).click();
  await page.getByRole('link', { name: 'Apri il corso' }).click();
  await expect(page).toHaveURL(/courses\/EAT-016$/);
  await expect(page.getByRole('main')).toBeFocused();
});
test('direct long lesson, math, local links and reading persistence', async ({ page }) => {
  const longest = data.documents.filter(d => d.route.startsWith('/lessons/')).sort((a, b) => b.markdown.length - a.markdown.length)[0];
  await page.goto(longest.route); await page.getByRole('article').waitFor(); await settle(page); await noOverflow(page); await shot(page, 'reader-desktop'); await shot(page, 'reader-desktop-top', false);
  await page.getByRole('button', { name: 'Segna come letta', exact: true }).click(); await page.reload();
  await expect(page.getByRole('button', { name: 'Segnata come letta' })).toHaveAttribute('aria-pressed', 'true');
  const heading = longest.headings.find(h => h.level === 2)!; await page.getByRole('link', { name: heading.text, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(encodeURI(heading.id)));
  await page.getByRole('link', { name: 'Apri il lab', exact: true }).click(); await expect(page.getByRole('link', { name: 'Lab', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto(longest.route); await page.getByRole('article').waitFor(); await settle(page); await noOverflow(page); await shot(page, 'reader-mobile'); await shot(page, 'reader-mobile-top', false);
  await page.goto('/lessons/EAT-001-M03-U01-L01'); await page.getByRole('article').waitFor();
  // The canonical Markdown lesson contains math syntax examples; rendering is verified separately with a valid expression in React tests.
  await expect(page.getByRole('article')).toContainText('LaTeX');
});
test('planned course, graph node detail and explicit local progress', async ({ page }) => {
  await page.goto('/courses/EAT-012'); await settle(page); await expect(page.getByText('Non ci sono ancora lezioni da aprire.', { exact: false })).toBeVisible(); await shot(page, 'planned-course');
  await page.goto('/graph?node=skill.agents.repo-workflows'); await settle(page); await expect(page.getByRole('complementary')).toContainText('M4 · Requisito');
  await page.setViewportSize({ width: 390, height: 844 }); await noOverflow(page); await shot(page, 'graph-mobile');
  await page.goto('/progress'); await settle(page); await expect(page.getByRole('heading', { name: '0 di 11 lezioni segnate come lette' })).toBeVisible(); await shot(page, 'progress-mobile');
});
test('search and unavailable route recover without errors', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/'); await settle(page); await page.getByRole('searchbox').fill('EAT-001-M02-U01-L01');
  await page.getByRole('region', { name: 'Risultati della ricerca' }).getByRole('link').click();
  await page.getByRole('article').waitFor(); await page.goto('/lessons/missing'); await expect(page.getByRole('heading', { name: 'Lezione non disponibile' })).toBeVisible();
  await page.getByRole('link', { name: 'Apri le roadmap' }).click(); await expect(page).toHaveURL(/\/roadmaps$/); expect(errors).toEqual([]);
});
test('dark and light accessibility, theme persistence and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['/', '/courses/EAT-001', '/lessons/EAT-001-M01-U01-L01', '/progress']) {
    await page.goto(route); await settle(page); if (route.includes('lessons')) await page.getByRole('article').waitFor(); await axe(page);
  }
  await page.getByRole('button', { name: 'Attiva tema chiaro' }).click(); await page.goto('/'); await settle(page); await axe(page); await shot(page, 'light-desktop');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.locator('.edge').first().evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
  await page.setViewportSize({ width: 360, height: 800 }); await page.goto('/lessons/EAT-001-M01-U01-L01'); await page.getByRole('article').waitFor(); await settle(page); await noOverflow(page); await axe(page); await shot(page, 'reader-light-mobile-top', false);
});
test('missing generated data and blocked storage have recoverable browser states', async ({ page }) => {
  await page.route('**/src/generated/atlas.json*', route => route.abort());
  await page.goto('/'); await expect(page.getByRole('heading', { name: 'Catalogo non disponibile' })).toBeVisible(); await shot(page, 'missing-catalog');
  await page.unroute('**/src/generated/atlas.json*'); await page.getByRole('button', { name: 'Riprova' }).click(); await expect(page.getByRole('heading', { name: 'Esplora il percorso' })).toBeVisible(); await settle(page);
  await page.evaluate(() => localStorage.setItem('engineering-atlas.reading.v1', '{broken'));
  await page.goto('/progress'); await expect(page.getByRole('status')).toContainText('progresso locale non è disponibile');
  await page.getByRole('button', { name: 'Azzera il progresso di lettura' }).click(); await page.getByRole('button', { name: 'Azzera i segni', exact: true }).click();
  await expect(page.getByRole('status')).toHaveCount(0);
});
test('blocked browser storage allows reading and keeps a visible recovery message', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage unavailable in this isolated test', 'SecurityError'); } }));
  await page.goto('/lessons/EAT-001-M01-U01-L01'); await page.getByRole('article').waitFor();
  await expect(page.getByRole('status')).toContainText('progresso locale non è disponibile');
  await page.getByRole('button', { name: 'Segna come letta', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Segnata come letta' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('article')).toBeVisible();
  await page.getByRole('link', { name: 'Il mio studio', exact: true }).click();
  await expect(page.getByRole('heading', { name: '1 di 11 lezioni segnate come lette' })).toBeVisible();
});

test('VS Code: corso, due unità, quattro lezioni e moduli pianificati distinguibili', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/courses/EAT-021'); await settle(page);
  await expect(page.locator('.curriculum-rows > li')).toHaveCount(12);
  await expect(page.locator('.planned-row')).toHaveCount(11);
  await expect(page.locator('.planned-row a')).toHaveCount(0);
  await shot(page, 'vscode-course');
  await page.locator('.curriculum-rows a').click();
  await expect(page).toHaveURL(/modules\/EAT-021-M01$/);
  await expect(page.locator('.curriculum-rows > li')).toHaveCount(2);
  await page.locator('.curriculum-rows a').first().click();
  await expect(page.locator('.curriculum-rows a')).toHaveCount(3);
  await page.locator('.curriculum-rows a').nth(2).click();
  await page.getByRole('article').waitFor(); await settle(page);
  await expect(page.locator('pre code.language-jsonc .hljs-attr').first()).toBeVisible();
  await axe(page); await noOverflow(page); await shot(page, 'vscode-settings-desktop');
  await page.setViewportSize({ width: 390, height: 844 });
  await noOverflow(page); await axe(page); await shot(page, 'vscode-settings-mobile');
  for (const lesson of data.lessons.filter(l => l.id.startsWith('EAT-021'))) {
    await page.goto(lesson.route); await page.getByRole('article').waitFor();
    await expect(page.getByRole('article').getByRole('heading', { name: 'Modello mentale', exact: true })).toBeVisible();
  }
  await page.goto('/documents/practical-engineering'); await page.getByRole('article').waitFor();
  await expect(page.getByRole('article')).toContainText('57b81c9');
  expect(errors).toEqual([]);
});

test('reader regression: matrici, callout, codice lungo e HTML letterale nei due temi', async ({ page }) => {
  // Synthetic regression document, injected only in this browser context.
  const fixture = structuredClone(data), doc = fixture.documents.find(d => d.id === 'EAT-021-M01-U01-L01')!;
  const code = 'const message = "<script>literal</script> ' + 'indentazione '.repeat(24) + '";\n  console.log(message);\n';
  doc.markdown = '# Verifica del renderer\n\n## Matematica e codice\n\n' + String.raw`Una somma $\sum_{k=1}^{n}k=\frac{n(n+1)}2$.

$$
\begin{aligned}
A &= \begin{pmatrix}1 & 0 \\ 0 & 1\end{pmatrix} \\
Ax &= x
\end{aligned}
$$

> [!WARNING] Controlla il risultato
>
> La formula $x^2$ e il codice mantengono il loro significato.

` + '```javascript\n' + code + '```\n\n| Azione | Risultato |\n| --- | --- |\n| Leggi | Spiega |\n';
  doc.headings = [{ level: 1, id: 'verifica-del-renderer', text: 'Verifica del renderer' }, { level: 2, id: 'matematica-e-codice', text: 'Matematica e codice' }];
  await page.route('**/src/generated/atlas.json*', route => route.fulfill({ contentType: 'application/javascript', body: 'export default ' + JSON.stringify(fixture) }));
  await page.goto(doc.route); await page.getByRole('article').waitFor(); await settle(page);
  await expect(page.locator('.katex math')).toHaveCount(3);
  await expect(page.locator('.callout-warning')).toContainText('Controlla il risultato');
  expect(await page.locator('pre code').textContent()).toBe(code);
  await expect(page.locator('article script')).toHaveCount(0);
  await expect(page.locator('.math-error, .katex-error')).toHaveCount(0);
  for (const theme of ['dark', 'light']) {
    if (theme === 'light') await page.getByRole('button', { name: 'Attiva tema chiaro' }).click();
    for (const width of [1440, 360]) {
      await page.setViewportSize({ width, height: 1000 }); await noOverflow(page); await axe(page);
      await shot(page, `reader-regression-${theme}-${width}`);
    }
  }
});
