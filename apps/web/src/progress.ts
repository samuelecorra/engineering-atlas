export const PROGRESS_KEY = 'engineering-atlas.reading.v1';
type StorageAccess = () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export type ReadingProgress = { version: 1; read_lesson_ids: string[] };
export type ProgressResult = { progress: ReadingProgress; issue: string | null };
export const emptyProgress = (): ReadingProgress => ({ version: 1, read_lesson_ids: [] });

export function readProgress(storage: StorageAccess, allowed: readonly string[]): ProgressResult {
  try {
    const raw = storage().getItem(PROGRESS_KEY);
    if (raw === null) return { progress: emptyProgress(), issue: null };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1 || !('read_lesson_ids' in parsed)
      || !Array.isArray(parsed.read_lesson_ids) || parsed.read_lesson_ids.some(id => typeof id !== 'string' || !allowed.includes(id))
      || new Set(parsed.read_lesson_ids).size !== parsed.read_lesson_ids.length
      || Object.keys(parsed).some(key => !['version', 'read_lesson_ids'].includes(key))) {
      return { progress: emptyProgress(), issue: 'Il progresso salvato non è compatibile. Puoi azzerarlo e iniziare di nuovo.' };
    }
    return { progress: { version: 1, read_lesson_ids: parsed.read_lesson_ids }, issue: null };
  } catch {
    return { progress: emptyProgress(), issue: 'Il progresso locale non è disponibile. Puoi continuare a studiare; nessuna lettura è stata recuperata.' };
  }
}
export function saveProgress(storage: StorageAccess, progress: ReadingProgress): string | null {
  try { storage().setItem(PROGRESS_KEY, JSON.stringify(progress)); return null; }
  catch { return 'Salvataggio locale non riuscito. La modifica resta in questa sessione.'; }
}
export function clearProgress(storage: StorageAccess): string | null {
  try { storage().removeItem(PROGRESS_KEY); return null; }
  catch { return 'Impossibile azzerare il progresso salvato in questo browser.'; }
}
