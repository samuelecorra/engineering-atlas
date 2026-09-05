import fs from 'node:fs';
import path from 'node:path';
import { ROOT, walk, runCLI } from './lib/repository.mjs';

export function prose(markdown, { maskInlineCode = false } = {}) {
  let fence = null;
  return markdown.split(/\r?\n/).map(line => {
    const match = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (match) {
      if (!fence) fence = match[1];
      else if (match[1][0] === fence[0] && match[1].length >= fence.length) fence = null;
      return '';
    }
    return fence ? '' : line.replace(/(`+)(.*?)\1/g, maskInlineCode ? '' : '$2');
  }).join('\n');
}
export function headingAnchors(markdown) {
  const counts = new Map();
  return new Set([...prose(markdown).matchAll(/^ {0,3}#{1,6}\s+(.+?)\s*#*$/gm)].map(([, title]) => {
    const id = title.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/\s/g, '-');
    const count = counts.get(id) ?? 0;
    counts.set(id, count + 1);
    return id + (count ? `-${count}` : '');
  }));
}
export function markdownLinks(markdown) {
  // Supported: inline/image links, balanced destination parentheses, angle destinations,
  // explicit/collapsed reference links and definitions. Code fences do not contain live links.
  const text = prose(markdown, { maskInlineCode: true });
  const links = [], refs = new Map();
  const dest = value => value.trim().startsWith('<') ? value.trim().slice(1).split('>')[0] : value.trim().split(/\s+["']/)[0].trim();
  for (const match of text.matchAll(/^ {0,3}\[([^\]]+)\]:\s*(.+)$/gm)) {
    refs.set(match[1].toLowerCase(), dest(match[2])); links.push(dest(match[2]));
  }
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== ']' || text[i + 1] !== '(') continue;
    let depth = 1, end = i + 2, angle = false;
    for (; end < text.length; end++) {
      if (text[end] === '\\') { end++; continue; }
      if (text[end] === '<') angle = true;
      if (text[end] === '>') angle = false;
      if (!angle && text[end] === '(') depth++;
      if (!angle && text[end] === ')' && --depth === 0) break;
    }
    if (!depth) links.push(dest(text.slice(i + 2, end)));
    i = end;
  }
  for (const [, title, id] of text.matchAll(/\[([^\]]+)\]\[([^\]]*)\]/g)) {
    const key = (id || title).toLowerCase();
    links.push(refs.get(key) ?? `UNRESOLVED-REFERENCE:${key}`);
  }
  return links;
}
export function exactPath(root, relative) {
  let current = root;
  for (const part of relative.split('/').filter(Boolean)) {
    if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) return false;
    if (!fs.readdirSync(current).includes(part)) return false;
    current = path.join(current, part);
    if (fs.lstatSync(current).isSymbolicLink()) return false;
  }
  return fs.existsSync(current);
}
export function checkMarkdownLinks(root, file, markdown) {
  const errors = [];
  for (let link of markdownLinks(markdown)) {
    if (link.startsWith('UNRESOLVED-REFERENCE:')) { errors.push(`${file}: ${link}`); continue; }
    if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('//')) continue;
    if (link.startsWith('/')) { errors.push(`${file}: link assoluto locale non portabile ${link}`); continue; }
    try { link = decodeURIComponent(link.replace(/\\([() ])/g, '$1')); }
    catch { errors.push(`${file}: URL encoding invalido`); continue; }
    const [destination, anchor] = link.split('#');
    const target = destination ? path.posix.normalize(path.posix.join(path.posix.dirname(file), destination.split('?')[0])) : file;
    if (target === '..' || target.startsWith('../') || !exactPath(root, target)) { errors.push(`${file}: link locale rotto/case-sensitive ${link}`); continue; }
    if (anchor && target.endsWith('.md') && !headingAnchors(fs.readFileSync(path.join(root, target), 'utf8')).has(anchor)) errors.push(`${file}: anchor assente ${link}`);
  }
  return errors;
}
export function validateLinks(root = ROOT) {
  return walk(root).filter(p => p.endsWith('.md')).flatMap(p => {
    if (fs.lstatSync(path.join(root, p)).isSymbolicLink()) return [`${p}: symlink non consentito`];
    let markdown = fs.readFileSync(path.join(root, p), 'utf8');
    // Resolve the single preserved historical filename without rewriting archival bytes.
    if (p === 'sources/audits/2026-09-05-initial/audit.md') markdown = markdown.replaceAll('(./engineering-atlas-source-inventory.csv)', '(source-inventory.csv.gz)');
    return checkMarkdownLinks(root, p, markdown);
  });
}
runCLI(import.meta, () => validateLinks());
