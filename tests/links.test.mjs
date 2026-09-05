import test from 'node:test';
import assert from 'node:assert/strict';
import { checkMarkdownLinks } from '../scripts/validate-links.mjs';
import { temporary, write } from './helpers.mjs';
test('links: relativo valido', t => { const dir = temporary(t); write(dir, 'docs/target.md', '# Titolo\n'); assert.deepEqual(checkMarkdownLinks(dir, 'README.md', '[Vai](docs/target.md)'), []); });
test('links: rotto e case-sensitive errato', t => {
  const dir = temporary(t); write(dir, 'Target.md', '# Titolo\n');
  assert.match(checkMarkdownLinks(dir, 'README.md', '[Vai](missing.md)').join(), /link locale rotto/);
  assert.match(checkMarkdownLinks(dir, 'README.md', '[Vai](target.md)').join(), /case-sensitive/);
});
test('links: anchor, percent encoding, spazi e parentesi', t => {
  const dir = temporary(t); write(dir, 'notes/My File (1).md', '# Titolo uno\n\n## Secondo\n');
  assert.deepEqual(checkMarkdownLinks(dir, 'README.md', '[A](<notes/My File (1).md#titolo-uno>)\n[B](notes/My%20File%20(1).md#secondo)'), []);
  assert.match(checkMarkdownLinks(dir, 'README.md', '[A](<notes/My File (1).md#missing>)').join(), /anchor assente/);
});
test('links: URL esterno non richiede rete', t => {
  const dir = temporary(t), previous = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Network forbidden'); };
  try { assert.deepEqual(checkMarkdownLinks(dir, 'README.md', '[Remote](https://unresolvable.invalid/a#b)\n[email](mailto:example@example.invalid)'), []); }
  finally { globalThis.fetch = previous; }
});
test('links: reference link e code fence', t => {
  const dir = temporary(t); write(dir, 'ok.md', '# OK\n');
  assert.deepEqual(checkMarkdownLinks(dir, 'README.md', '[Vai][ref]\n\n[ref]: ok.md\n\n```md\n[Broken](missing.md)\n```'), []);
  assert.match(checkMarkdownLinks(dir, 'README.md', '[Vai][missing]').join(), /UNRESOLVED-REFERENCE/);
});
test('links: traversal fuori repository vietato', t => assert.match(checkMarkdownLinks(temporary(t), 'README.md', '[Sibling](../ironmath/README.md)').join(), /link locale rotto/));
test('links: sintassi link in inline code non è un link attivo', t => assert.deepEqual(checkMarkdownLinks(temporary(t), 'README.md', 'Scrivi `[esempio](missing.md)` come testo.'), []));
