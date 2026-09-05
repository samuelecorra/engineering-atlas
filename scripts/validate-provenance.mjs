import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { ROOT, readJSON, runCLI } from './lib/repository.mjs';
import { validateSchema } from './lib/schema.mjs';
import { secretLooking } from './lib/content-safety.mjs';

export const AUDIT_DIR = 'sources/audits/2026-09-05-initial';
export const AUDIT_JSON = [`${AUDIT_DIR}/manifest.json`, `${AUDIT_DIR}/course-dag.v0.1.json`];
export const AUDIT_GZIP = `${AUDIT_DIR}/source-inventory.csv.gz`;
const pinned = [
  ['audit', 'engineering-atlas-audit.md', 'audit.md', 'b9a63a07386c8bcacc0fafef3ea00d07db6bf66740a88e1279244d623c9d4000'],
  ['course-dag', 'engineering-atlas-knowledge-graph.json', 'course-dag.v0.1.json', '3caec4e92a6774b76c87af54b1c6676f70f1e0bfad9c6513f4495b9d98bb827b'],
  ['inventory', 'engineering-atlas-source-inventory.csv', 'source-inventory.csv.gz', '34807e5b882caa1454d7f5f7564c1c8503769af1b8f4508178b1ba9f1661934d'],
];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
// Match absolute paths at token/field boundaries; components/home is a relative product path.
export const personalPath = text => /(?:^|[\s"'`(=:,])(?:\/(?:Users|home)\/|[A-Za-z]:\\+(?:Users|Documents and Settings)\\+|file:\/\/)/m.test(text);

export function compareCourseEdges(historical, current) {
  const errors = [];
  const old = historical.edges.map(e => `${e.strength === 'required' ? 'PREREQUISITE_OF' : e.strength === 'recommended' ? 'RECOMMENDED_BEFORE' : 'INVALID'}|${e.from}|${e.to}`);
  const now = current.edges.filter(e => ['PREREQUISITE_OF', 'RECOMMENDED_BEFORE'].includes(e.type)).map(e => `${e.type}|${e.from}|${e.to}`);
  const courses = g => g.nodes.filter(n => n.type === 'course').map(n => n.id).sort();
  if (courses(historical).length !== 20 || JSON.stringify(courses(historical)) !== JSON.stringify(courses(current))) errors.push('baseline: 20 course node divergenti');
  if (historical.edges.some(e => e.type !== 'prerequisite') || old.length !== 51 || new Set(old).size !== 51
    || old.filter(k => k.startsWith('PREREQUISITE_OF|')).length !== 37 || old.filter(k => k.startsWith('RECOMMENDED_BEFORE|')).length !== 14
    || JSON.stringify(old.sort()) !== JSON.stringify(now.sort())) errors.push('baseline: proiezione 51 archi course-level divergente (37 required, 14 recommended)');
  return errors;
}

export function validateProvenance(root = ROOT, current = readJSON(root, 'graph/knowledge-graph.json')) {
  const errors = [], decoded = new Map();
  try {
    const manifest = readJSON(root, AUDIT_JSON[0]);
    errors.push(...validateSchema(manifest, readJSON(root, 'schemas/audit-manifest.schema.json'), 'audit-manifest'));
    if (errors.length) return errors;
    if (personalPath(JSON.stringify(manifest)) || secretLooking(JSON.stringify(manifest))) errors.push('audit-manifest: path personale o secret');
    for (const [role, original, filename, hash] of pinned) {
      const a = manifest.artifacts.find(v => v.role === role), p = `${AUDIT_DIR}/${filename}`;
      if (!a || a.archived_path !== p || a.original_name !== original || a.expected_sha256 !== hash || a.observed_sha256 !== hash
        || a.encoding !== (role === 'inventory' ? 'gzip' : 'identity')) { errors.push(`${role}: identità/checksum baseline incoerenti`); continue; }
      if (fs.existsSync(path.join(root, original))) errors.push(`${original}: residuo originale in root`);
      const full = path.join(root, p);
      if (!fs.existsSync(full)) { errors.push(`${p}: artifact mancante`); continue; }
      if (!fs.lstatSync(full).isFile()) { errors.push(`${p}: artifact deve essere un file regolare`); continue; }
      const stored = fs.readFileSync(full);
      if (sha(stored) !== a.archived_sha256 || stored.length !== a.archived_bytes) errors.push(`${p}: checksum/dimensione archivio errati`);
      let bytes = stored;
      if (role === 'inventory') {
        try { bytes = gunzipSync(stored, { maxOutputLength: 3_000_000 }); }
        catch { errors.push(`${p}: gzip corrotto`); continue; }
        if (stored.length < 10 || stored[3] !== 0 || stored.readUInt32LE(4) !== 0) errors.push(`${p}: gzip non deterministico (mtime/flags)`);
        if (a.archived_sha256 !== '9d1bb71964e7e291648fb111483bb9d44c7615f7f4076c24ecbe3234e8f0e134') errors.push(`${p}: checksum gzip storico modificato`);
      }
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      if (sha(bytes) !== a.observed_sha256 || bytes.length !== a.original_bytes || text.split('\n').length - 1 !== a.original_lines) errors.push(`${p}: checksum/dimensione originale errati`);
      if (personalPath(text)) errors.push(`${p}: path personale assoluto`);
      if (secretLooking(text)) errors.push(`${p}: secret-looking value`);
      decoded.set(role, text);
    }
    const repos = readJSON(root, 'sources/repositories.json').repositories;
    if (new Set(manifest.source_snapshots.map(s => s.repository_id)).size !== 2) errors.push('audit: snapshot duplicati');
    for (const s of manifest.source_snapshots) {
      const r = repos.find(r => r.id === s.repository_id);
      if (s.commit !== r?.audited_commit || s.inventoried_files !== r?.audited_tracked_files) errors.push('audit: snapshot divergente dalla baseline canonica');
    }
    for (const p of manifest.canonical_sources) {
      if (!['sources/repositories.json', 'sources/evidence/ssri-coverage.json', 'sources/evidence/ironmath-requirements.json', 'catalog/skills/', 'curriculum/courses/', 'graph/knowledge-graph.json'].includes(p)
        || !fs.existsSync(path.join(root, p))) errors.push('audit: riferimento canonico invalido');
    }
    if (decoded.has('course-dag')) {
      const old = JSON.parse(decoded.get('course-dag'));
      if (old.canonical === true || old.schemaVersion !== '0.1.0' || current === old) errors.push('audit: grafo storico non può essere canonico');
      errors.push(...compareCourseEdges(old, current));
    }
    if (decoded.has('inventory')) {
      // This immutable CSV uses quoted, single-line records. Reject shape drift instead of guessing a dialect.
      const lines = decoded.get('inventory').trimEnd().split('\n');
      if (lines.shift() !== '"repository","commit","path","bytes","category","review_scope"') errors.push('audit: header CSV invalido');
      if (lines.length !== manifest.inventoried_files) errors.push('audit: conteggio inventario errato');
      const counts = new Map();
      for (const line of lines) {
        const match = /^"([^"]+)","([a-f0-9]{40})","((?:[^"]|"")+)","(\d+)","([^"]+)","([^"]+)"$/.exec(line);
        if (!match) { errors.push('audit: record CSV invalido'); break; }
        const [, repository, commit, file] = match, r = repos.find(r => r.repository === repository);
        if (!r || r.audited_commit !== commit || /^(?:\/|[A-Za-z]:|\.\.(?:\/|$))/.test(file)) { errors.push('audit: snapshot/path CSV invalido'); break; }
        counts.set(r.id, (counts.get(r.id) ?? 0) + 1);
      }
      for (const s of manifest.source_snapshots) if (counts.get(s.repository_id) !== s.inventoried_files) errors.push(`audit: conteggio snapshot ${s.repository_id} errato`);
    }
  } catch (error) { errors.push(`provenance: ${error.message}`); }
  return errors;
}
runCLI(import.meta, () => validateProvenance());
