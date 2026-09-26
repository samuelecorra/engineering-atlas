import { expect, it } from 'vitest';
import { readProgress, saveProgress, clearProgress, emptyProgress, PROGRESS_KEY } from './progress';
const lesson = 'EAT-001-M01-U01-L01';
function storage(initial: string | null = null) {
  const values = new Map<string, string>(); if (initial !== null) values.set(PROGRESS_KEY, initial);
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
}
it('progress: prima apertura senza mastery o letture inventate', () => {
  expect(readProgress(() => storage(), [lesson])).toEqual({ progress: emptyProgress(), issue: null });
});
it('progress: salva e recupera esclusivamente lezioni segnate come lette', () => {
  const s = storage(), p = { version: 1 as const, read_lesson_ids: [lesson] };
  expect(saveProgress(() => s, p)).toBeNull(); expect(readProgress(() => s, [lesson]).progress).toEqual(p);
  expect(clearProgress(() => s)).toBeNull(); expect(readProgress(() => s, [lesson]).progress).toEqual(emptyProgress());
});
it('progress: rifiuta formati futuri, ID inesistenti e falsi campi mastery', () => {
  for (const p of [{ version: 2, read_lesson_ids: [] }, { version: 1, read_lesson_ids: ['missing'] }, { version: 1, read_lesson_ids: [lesson, lesson] }, { version: 1, read_lesson_ids: [], learner_mastery: 'M4' }]) {
    const s = storage(JSON.stringify(p)); expect(readProgress(() => s, [lesson]).issue).not.toBeNull();
    expect(s.getItem(PROGRESS_KEY)).toBe(JSON.stringify(p));
  }
});
it('progress: JSON corrotto e storage negato hanno un errore recuperabile', () => {
  expect(readProgress(() => storage('{broken'), [lesson]).issue).not.toBeNull();
  const unavailable = () => { throw new Error('storage blocked'); };
  expect(readProgress(unavailable, [lesson]).issue).not.toBeNull();
  expect(saveProgress(unavailable, emptyProgress())).toContain('sessione');
  expect(clearProgress(unavailable)).toContain('Impossibile');
});
