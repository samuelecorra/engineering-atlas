import test from 'node:test';
import assert from 'node:assert/strict';
import { checkMarkdown } from './check-markdown.mjs';

test('Markdown: formule inline/display, aligned, matrici e callout usano il parser del reader', () => {
  assert.deepEqual(checkMarkdown(String.raw`# Formule

Una somma $\sum_{k=1}^{n} k$.

$$
\begin{aligned}
f(x)&=x^2 \\
f'(x)&=2x
\end{aligned}
$$

> [!NOTE] Matrice
>
> $\begin{pmatrix}1&0\\0&1\end{pmatrix}$
`), []);
});
test('Markdown: comando sconosciuto e graffa aperta falliscono con posizione', () => {
  for (const text of [String.raw`$\commandAtlasUnknown{x}$`, String.raw`$\frac{1}{2$`]) {
    assert.ok(checkMarkdown(text).some(e => e.line === 1 && /KaTeX|Undefined|Expected/.test(e.message)));
  }
});
test('Markdown: codice e dollari escaped non sono formule', () => {
  assert.deepEqual(checkMarkdown('Costo: \\$5. `echo $PATH`\n\n```bash\necho "$PATH"\n```\n'), []);
  assert.deepEqual(checkMarkdown('````text\n```latex\n$\\broken{\n```\n````\n'), []);
});
test('Markdown: dollari, formule e fence non chiusi sono diagnosticati', () => {
  for (const text of ['$x+1', '$$\nx+1\n', '```js\nconst x = 1;\n']) assert.ok(checkMarkdown(text).length);
});
test('Markdown: linguaggio inesistente richiede correzione editoriale, testo semplice ammesso', () => {
  assert.ok(checkMarkdown('```atlas-unknown-language\nhello\n```').some(e => /not registered/.test(e.message)));
  assert.deepEqual(checkMarkdown('```text\nhello\n```'), []);
});
test('Markdown: le formule nei blocchi math vengono verificate come nel frontend', () => {
  assert.ok(checkMarkdown('```math\n\\undefinedAtlas\n```').length);
});
test('Markdown: fence annidati nel callout sono validi solo se chiusi', () => {
  assert.deepEqual(checkMarkdown('> [!NOTE]\n>\n> ```bash\n> echo "$PATH"\n> ```'), []);
  assert.ok(checkMarkdown('> [!NOTE]\n>\n> ```bash\n> echo "$PATH"').some(e => /senza delimitatore/.test(e.message)));
});
