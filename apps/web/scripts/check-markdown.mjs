import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { remarkPlugins, rehypePlugins } from '../src/markdown.ts';

// Uses the reader's syntax and KaTeX options; code is never executed.
export function checkMarkdown(markdown) {
  const processor = unified().use(remarkParse).use(remarkPlugins).use(remarkRehype).use(rehypePlugins);
  const tree = processor.parse(markdown), issues = [];
  function walk(node) {
    const start = node.position?.start;
    const raw = start ? markdown.slice(start.offset, node.position.end.offset) : '';
    const report = message => issues.push({ line: start?.line ?? 1, message });
    if (node.type === 'text') {
      // Literal currency/shell dollars belong in inline code or must be escaped.
      if (/(^|[^\\])(?:\\\\)*\$/.test(raw)) report('Dollaro non delimitato: correggi la formula oppure usa \\$ / codice inline.');
    }
    if (node.type === 'code' || node.type === 'math') {
      const lines = raw.split('\n');
      const fence = lines[0].trim().match(/^(`{3,}|~{3,}|\${2,})/);
      const last = lines.at(-1).replace(/^(?: {0,3}> ?)+/, '');
      if (fence && (lines.length < 2 || !new RegExp(`^\\s*${fence[1][0] === '$' ? '\\$' : fence[1][0]}{${fence[1].length},}\\s*$`).test(last))) report('Blocco senza delimitatore di chiusura.');
    }
    node.children?.forEach(walk);
  }
  walk(tree);
  const file = { value: markdown, messages: [] };
  const rendered = processor.runSync(tree, file);
  for (const message of file.messages) issues.push({ line: message.line ?? 1, message: message.cause?.message ?? message.message });
  // Untrusted KaTeX commands can be rendered as error ink without throwing.
  function checkRendered(node) {
    if (node.properties?.className?.includes('katex-error')) issues.push({ line: 1, message: 'Formula non renderizzabile.' });
    node.children?.forEach(checkRendered);
  }
  checkRendered(rendered);
  return issues;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const data = JSON.parse(fs.readFileSync(new URL('../src/generated/atlas.json', import.meta.url), 'utf8'));
  let errors = 0;
  for (const doc of data.documents) for (const issue of checkMarkdown(doc.markdown)) {
    console.error(`${doc.source_path}:${issue.line}: ${issue.message}`); errors++;
  }
  console.log(`Markdown: ${data.documents.length} documenti, ${errors} errori.`);
  process.exitCode = errors ? 1 : 0;
}
