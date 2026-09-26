import { describe, expect, it } from 'vitest';
import generated from './generated/atlas.json';
import { assertAtlasData, loadAtlas, searchAtlas } from './data';

describe('catalogo statico', () => {
  it('carica i dati generati e risolve le undici lezioni autorizzate', async () => {
    const data = await loadAtlas(); expect(data.lessons).toHaveLength(11);
    for (const lesson of data.lessons) expect(data.documents.find(d => d.id === lesson.document_id)?.markdown).toContain('## Modello mentale');
  });
  it('segnala caricamento fallito e dati assenti o incoerenti', async () => {
    await expect(loadAtlas(async () => { throw new Error('missing'); })).rejects.toThrow('missing');
    expect(() => assertAtlasData(null)).toThrow('non è valido');
    const invalid = structuredClone(generated); invalid.lessons[0].unit_id = 'missing';
    expect(() => assertAtlasData(invalid)).toThrow('collegamento');
  });
  it('rifiuta gruppi vuoti, proprietà richieste mancanti e riferimenti strutturali errati', () => {
    const empty = structuredClone(generated); empty.courses = [];
    expect(() => assertAtlasData(empty)).toThrow();
    const incomplete = structuredClone(generated) as unknown as { courses: Record<string, unknown>[] };
    delete incomplete.courses[0].planned_modules;
    expect(() => assertAtlasData(incomplete)).toThrow('incompleta');
    const invalid = structuredClone(generated); invalid.modules[0].unit_ids = ['missing'];
    expect(() => assertAtlasData(invalid)).toThrow('risolvibile');
  });
  it('rifiuta relazioni invalide, semantica scambiata e link eseguibili', () => {
    const edge = structuredClone(generated); edge.graph.edges[0].to = 'missing';
    expect(() => assertAtlasData(edge)).toThrow('relazione');
    const semantic = structuredClone(generated); semantic.learning_semantics.ssri_coverage = 'learner-mastery';
    expect(() => assertAtlasData(semantic)).toThrow('dimensioni');
    const links = structuredClone(generated); (links.documents[0].links as Record<string, string>).bad = 'javascript:alert(1)';
    expect(() => assertAtlasData(links)).toThrow('collegamento');
  });
  it('ricerca localmente ID, titoli e testo delle lezioni', () => {
    expect(searchAtlas(generated, 'EAT-001-M01-U01-L01')[0].kind).toBe('Lezione');
    expect(searchAtlas(generated, 'rollback').length).toBeGreaterThan(0);
    expect(searchAtlas(generated, 'zznonpresentezz')).toEqual([]);
    expect(searchAtlas(generated, ' ')).toEqual([]);
  });
});
