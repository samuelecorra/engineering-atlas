import fs from 'node:fs';
import path from 'node:path';
import { loadModel, ROOT, runCLI, walk } from './lib/repository.mjs';
import { prose } from './validate-links.mjs';

export const SECTIONS = {
  'lesson.md': ['Perché questa skill serve', 'Outcome osservabili', 'Prerequisiti', 'Modello mentale', 'Concetti e comandi essenziali', 'Esempio svolto', 'Failure mode e recovery', 'Collegamenti a IronMath', 'Esercizio senza LLM', 'Domande di autoverifica', 'Glossario', 'Fonti e versioni'],
  'lab.md': ['Obiettivo', 'Setup e sicurezza', 'Fixture locale', 'Passi', 'Acceptance criteria', 'Diagnosi di errori attesi', 'Recovery/rollback', 'Cleanup sicuro', 'Evidenza da conservare', 'Riflessione senza LLM', 'Review opzionale con agente'],
  'assessment.md': ['Target mastery', 'Task autentici', 'Vincoli', 'Evidenza richiesta', 'Rubric analitica', 'Pass rule', 'Errori bloccanti', 'Retry policy', 'Autovalutazione separata dalla valutazione'],
};
export function checkContentFiles(files, scope, { requireSlice = true } = {}) {
  const errors = [], found = new Map();
  const allowed = new Set(scope.starter_modules.map(s => s.directory));
  for (const [file, text] of Object.entries(files)) {
    if (!text.trim()) errors.push(`${file}: file vuoto`);
    const name = path.posix.basename(file);
    if (!SECTIONS[name]) continue;
    const dir = path.posix.basename(path.posix.dirname(file));
    const owner = scope.starter_modules.find(s => s.directory === dir);
    if (!allowed.has(dir) || !/^curriculum\/courses\/[^/]+\/modules\/[^/]+\//.test(file)
      || !file.split('/')[2]?.startsWith(owner?.course_id + '-')) errors.push(`${file}: contenuto fuori starter slice`);
    const existing = found.get(dir) ?? new Set(); existing.add(name); found.set(dir, existing);
    const headings = new Set([...prose(text).matchAll(/^## (.+)$/gm)].map(m => m[1].trim()));
    for (const section of SECTIONS[name]) if (!headings.has(section)) errors.push(`${file}: sezione mancante ${section}`);
    for (const section of SECTIONS[name]) {
      const start = text.indexOf(`## ${section}\n`);
      if (start >= 0 && !text.slice(start + section.length + 4).split(/\n## /)[0].trim()) errors.push(`${file}: sezione vuota ${section}`);
    }
    if (/\b(?:TODO|TBD)\b|contenuto da scrivere/i.test(text)) errors.push(`${file}: placeholder generico`);
    if (/\b(?:mastered|completed)\b/i.test(text)) errors.push(`${file}: claim personale senza evidence di assessment`);
    if (name === 'lesson.md' && text.split(/\s+/).length > scope.lesson_word_limit) errors.push(`${file}: lesson oltre ${scope.lesson_word_limit} parole`);
  }
  if (requireSlice) for (const dir of allowed) for (const name of Object.keys(SECTIONS)) if (!found.get(dir)?.has(name)) errors.push(`${dir}: contenuto richiesto assente ${name}`);
  return errors;
}
export const sensitiveName = p => /(^|\/)\.env(?:\..*)?$/.test(p) && !p.endsWith('/.env.example') && p !== '.env.example'
  || /\.(?:pem|key|p12|pfx|crt|cer)$/i.test(p) || /(^|\/)(?:credentials(?:\.json)?|id_rsa|id_ed25519|\.npmrc|\.pypirc|\.netrc)$/i.test(p);
export function secretLooking(text) {
  return /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)
    || /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{35,}|AKIA[A-Z0-9]{16}|sk-(?:proj-)?[A-Za-z0-9_-]{24,})\b/.test(text)
    || /(?:password|api[_-]?key|access[_-]?token|secret)\s*[=:]\s*["'][A-Za-z0-9+/=_-]{24,}["']/i.test(text);
}
export function validateContent(root = ROOT, m = loadModel(root)) {
  const errors = [], textFiles = {};
  for (const p of walk(root)) {
    const full = path.join(root, p);
    if (sensitiveName(p)) { errors.push(`${p}: file sensibile vietato (contenuto non letto)`); continue; }
    if (fs.lstatSync(full).isSymbolicLink()) { errors.push(`${p}: symlink vietato`); continue; }
    const text = fs.readFileSync(full, 'utf8');
    if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text)) errors.push(`${p}: carattere di controllo inatteso`);
    if (secretLooking(text)) errors.push(`${p}: secret-looking value`);
    textFiles[p] = text;
  }
  errors.push(...checkContentFiles(textFiles, m.scope));
  const canonicalContentPaths = new Set(m.paths.modules.flatMap(p => Object.keys(SECTIONS).map(name => p.replace(/module.json$/, name))));
  for (const p of Object.keys(textFiles)) if (SECTIONS[path.posix.basename(p)] && !canonicalContentPaths.has(p)) errors.push(`${p}: contenuto senza module canonico nella posizione attesa`);
  if (m.modules.length !== 7 || m.assessments.length !== 7) errors.push('richiesti 7 module e 7 assessment metadata');
  for (const [i, a] of m.assessments.entries()) {
    const file = m.paths.assessments[i].replace(/\.json$/, '.md'), md = textFiles[file] ?? '';
    if (!md.includes(`Assessment ID: ${a.id}`) || !md.includes(`Module ID: ${a.module_id}`)) errors.push(`${file}: assessment ID/module incoerente`);
    if (!md.includes(`Target: ${a.target_mastery}`)) errors.push(`${file}: target mastery incoerente`);
    for (const e of a.evidence_required) if (!md.includes(e)) errors.push(`${file}: evidenza richiesta assente: ${e}`);
    for (const r of a.rubric) if (![r.id, r.criterion, r.anchors.zero, r.anchors.partial, r.anchors.full].every(t => md.includes(t))) errors.push(`${file}: rubric incoerente ${r.id}`);
    if (!md.includes(`Soglia: ${a.pass_rule.minimum_score}/`) || !md.includes(a.retry_policy)) errors.push(`${file}: pass/retry incoerente`);
    for (const e of a.pass_rule.blocking_errors) if (!md.includes(e)) errors.push(`${file}: errore bloccante assente`);
  }
  return errors;
}
runCLI(import.meta, () => validateContent());
