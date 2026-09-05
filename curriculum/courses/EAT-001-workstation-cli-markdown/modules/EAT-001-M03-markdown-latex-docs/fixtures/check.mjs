import fs from 'node:fs';
import path from 'node:path';
export function checkDocument(file) {
  const text = fs.readFileSync(file, 'utf8'), errors = [];
  const levels = [...text.matchAll(/^(#{1,6}) /gm)].map(m => m[1].length);
  if (levels[0] !== 1 || levels.some((l, i) => i > 0 && l > levels[i - 1] + 1)) errors.push('Heading: salto gerarchico.');
  for (const [, target] of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) if (!fs.existsSync(path.resolve(path.dirname(file), target))) errors.push('Link locale assente.');
  const blocks = text.split(/\r?\n/).filter(l => l.trim() === '$$').length;
  if (blocks !== 2) errors.push('Formula block: servono due delimitatori su righe proprie.');
  for (const line of text.split(/\r?\n/).filter(l => l.includes('La media'))) if ((line.match(/(?<!\\)\$/g) ?? []).length !== 2) errors.push('Formula inline: delimitatori incoerenti.');
  return errors;
}
if (process.argv[2]) {
  const errors = checkDocument(path.resolve(process.argv[2]));
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; } else console.log('Documento fixture coerente.');
}
