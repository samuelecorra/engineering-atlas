import { useState } from 'react';
import { clearProgress, emptyProgress, readProgress, saveProgress } from './progress';
import type { AtlasData } from './data';

const storage = () => window.localStorage;
export function useReading(data: AtlasData) {
  const [initial] = useState(() => readProgress(storage, data.lessons.map(l => l.id)));
  const [progress, setProgress] = useState(initial.progress), [issue, setIssue] = useState(initial.issue);
  const [preserveStored, setPreserveStored] = useState(Boolean(initial.issue));
  function toggle(id: string) {
    if (!data.lessons.some(l => l.id === id)) return;
    const next = { ...progress, read_lesson_ids: progress.read_lesson_ids.includes(id) ? progress.read_lesson_ids.filter(value => value !== id) : [...progress.read_lesson_ids, id].sort() };
    setProgress(next);
    if (!preserveStored) setIssue(saveProgress(storage, next));
  }
  function reset() {
    const error = clearProgress(storage);
    setIssue(error);
    if (!error) { setProgress(emptyProgress()); setPreserveStored(false); }
  }
  return { progress, issue, toggle, reset };
}
export type ReadingState = ReturnType<typeof useReading>;
