import type { CSSProperties } from 'react';
const paths = {
  atlas: 'M3 3h18v15l-9 5-9-5V3Zm5 5h8v6h-5l-3 3V8Z',
  map: 'M12 2v3m0 14v3M2 12h3m14 0h3M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  roadmap: 'M7 12 17 5M7 12l10 7M7 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM21 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM21 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  book: 'M12 5v16M12 5C8 2 4 2 2 4v15c3-2 7-1 10 2 3-3 7-4 10-2V4c-2-2-6-2-10 1Z',
  search: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  arrow: 'M3 12h18m-7-7 7 7-7 7',
  chevron: 'm9 5 7 7-7 7',
  sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  moon: 'M20 16A9 9 0 0 1 8 4a9 9 0 1 0 12 12Z',
  plus: 'M12 4v16M4 12h16', minus: 'M4 12h16', fit: 'M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5',
  close: 'm5 5 14 14M5 19 19 5', check: 'm4 12 5 5L20 6', list: 'M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1',
} as const;
export function Icon({ name, size = 24, style }: { name: keyof typeof paths; size?: number; style?: CSSProperties }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}><path d={paths[name]} /></svg>;
}
