import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import type { PluggableList } from 'unified';
import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import sql from 'highlight.js/lib/languages/sql';
import powershell from 'highlight.js/lib/languages/powershell';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import ini from 'highlight.js/lib/languages/ini';
import diff from 'highlight.js/lib/languages/diff';
import markdown from 'highlight.js/lib/languages/markdown';
import latex from 'highlight.js/lib/languages/latex';

type Node = {
  type: string;
  value?: string;
  children?: Node[];
  data?: { hProperties?: Record<string, unknown> };
};
const calloutNames: Record<string, string> = {
  note: 'Nota', info: 'Informazione', tip: 'Suggerimento', warning: 'Attenzione',
  danger: 'Pericolo', caution: 'Cautela', important: 'Importante', example: 'Esempio',
  abstract: 'Riepilogo', question: 'Domanda', success: 'Esito atteso', failure: 'Errore',
  bug: 'Difetto', quote: 'Citazione',
};

// Original implementation of the source curriculum's [!TYPE] convention.
// Transform the Markdown tree, preserving nested code/math and escaping via React.
export function remarkCallouts() {
  return (tree: Node) => {
    function visit(node: Node) {
      if (node.type === 'blockquote') {
        const paragraph = node.children?.[0], first = paragraph?.children?.[0];
        const match = first?.type === 'text' && first.value?.match(/^\[!(\w+)\]([^\n]*)(?:\n|$)/);
        if (match && paragraph && first) {
          const kind = match[1].toLowerCase();
          if (calloutNames[kind]) {
            first.value = first.value!.slice(match[0].length);
            if (!first.value) paragraph.children!.shift();
            if (!paragraph.children!.length) node.children!.shift();
            node.data = { hProperties: { className: ['callout', `callout-${kind}`] } };
            node.children!.unshift({ type: 'paragraph', data: { hProperties: { className: ['callout-title'] } },
              children: [{ type: 'text', value: match[2].trim() || calloutNames[kind] }] });
          }
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

export const katexOptions = { strict: 'error', trust: false, maxExpand: 1000, maxSize: 20 } as const;
export const remarkPlugins: PluggableList = [remarkGfm, remarkMath, remarkCallouts];
function rehypeMathFeedback() {
  return (tree: { children: unknown[] }, file: { messages: { source?: string }[] }) => {
    if (file.messages.some(message => message.source === 'rehype-katex')) tree.children.unshift({
      type: 'element', tagName: 'p', properties: { className: ['math-error'], role: 'status' },
      children: [{ type: 'text', value: 'Formula da correggere: il testo della lezione resta disponibile.' }],
    });
  };
}
export const rehypePlugins: PluggableList = [
  [rehypeKatex, katexOptions],
  rehypeMathFeedback,
  [rehypeHighlight, { detect: false,
    languages: { bash, javascript, typescript, json, yaml, python, css, xml, sql, powershell, dockerfile, ini, diff, markdown, latex },
    aliases: { json: ['jsonc'] }, plainText: ['text', 'plaintext', 'console', 'output', 'mermaid'] }],
];
