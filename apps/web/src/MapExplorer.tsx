import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AtlasData } from './data';
import { Icon } from './Icon';

// Presentation coordinates only. Nodes, titles, ownership and edges come exclusively from the generated catalog.
const coordinates: Record<string, [number, number]> = {
  'EAT-021': [95, 155], 'EAT-001': [115, 320], 'EAT-002': [260, 130], 'EAT-003': [270, 310], 'EAT-004': [385, 235],
  'EAT-005': [380, 390], 'EAT-006': [510, 390], 'EAT-007': [645, 465], 'EAT-008': [510, 235],
  'EAT-009': [665, 175], 'EAT-010': [665, 290], 'EAT-011': [650, 370], 'EAT-012': [40, 600],
  'EAT-013': [425, 80], 'EAT-014': [795, 290], 'EAT-015': [795, 175], 'EAT-016': [265, 570],
  'EAT-017': [470, 570], 'EAT-018': [660, 570], 'EAT-019': [650, 90], 'EAT-020': [805, 90],
};
function annotation(title: string, point: [number, number], selected: string) {
  const lines: string[] = [];
  for (const word of title.split(' ')) {
    const previous = lines.at(-1);
    if (previous && `${previous} ${word}`.length <= 16) lines[lines.length - 1] += ` ${word}`;
    else lines.push(word);
  }
  const width = Math.max(...lines.map(line => line.length)) * 7, height = lines.length * 17;
  const candidates = [[point[0] - width - 22, point[1] + 24], [point[0] - width - 22, point[1] - height - 24], [point[0] + 24, point[1] + 24], [point[0] + 24, point[1] - height - 24]];
  const boxes = candidates.map(([x, y]) => ({ x: Math.max(8, Math.min(890 - width, x)), y: Math.max(28, Math.min(675 - height, y)) }));
  const score = (box: { x: number; y: number }) => Object.entries(coordinates).filter(([id, [x, y]]) => id !== selected && box.x < x + 100 && box.x + width > x - 20 && box.y - 14 < y + 20 && box.y + height > y - 20).length;
  const position = boxes.sort((a, b) => score(a) - score(b))[0];
  return { ...position, lines };
}
export function MapExplorer({ data }: { data: AtlasData }) {
  const [selected, setSelected] = useState('EAT-001'), [zoom, setZoom] = useState(1), [list, setList] = useState(() => window.matchMedia?.('(max-width: 1023px)').matches ?? false);
  const [recommended, setRecommended] = useState(false);
  const graphNodes = useRef(new Map<string, SVGGElement>());
  const course = data.courses.find(c => c.id === selected) ?? data.courses[0];
  const selectedName = annotation(course.title, coordinates[course.id] ?? [450, 350], course.id);
  const edges = data.graph.edges.filter(e => e.type === 'PREREQUISITE_OF' || (recommended && e.type === 'RECOMMENDED_BEFORE'));
  const children = data.graph.edges.filter(e => e.type === 'PREREQUISITE_OF' && e.from === course.id).map(e => e.to);
  const units = data.units.filter(u => course.module_ids.some(id => id === u.module_id));
  const lessons = data.lessons.filter(l => units.some(u => u.id === l.unit_id));
  return <div className="explorer">
    <section className={`map-panel ${list ? 'is-list' : ''}`} aria-labelledby="map-title">
      <div className="map-heading"><h1 id="map-title">Esplora il percorso</h1><p className="tallies">{data.courses.length} corsi <span aria-hidden="true">|</span> {data.skills.length} skill <span aria-hidden="true">|</span> {data.lessons.length} lezioni draft</p></div>
      <div className="map-controls"><button className="quiet-button view-switch" onClick={() => setList(!list)} aria-pressed={list}><Icon name={list ? 'map' : 'list'} size={18} />{list ? 'Vista mappa' : 'Vista elenco'}</button><label className="check-label"><input type="checkbox" checked={recommended} onChange={e => setRecommended(e.target.checked)} />Consigliati</label></div>
      {list ? <ul className="map-list">{data.courses.map(c => <li key={c.id}><button aria-pressed={c.id === selected} onClick={() => setSelected(c.id)}><span className="mono">{c.id}</span><span>{c.title}</span><Icon name="chevron" size={18} /></button><Link className="list-open" to={c.route} aria-label={`Apri ${c.id}: ${c.title}`}><Icon name="arrow" size={20} /></Link></li>)}</ul> : <div className="map-viewport">
        <svg className="course-map" viewBox={`${450 - 450 / zoom} ${350 - 350 / zoom} ${900 / zoom} ${700 / zoom}`} role="group" aria-label={`Mappa dei prerequisiti dei ${data.courses.length} corsi. Seleziona un corso; usa Tab o i tasti freccia.`}>
          <defs><marker id="arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="var(--map-line)" /></marker><marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="var(--accent)" /></marker></defs>
          <g className="map-grid" aria-hidden="true"><circle cx="450" cy="350" r="340" /><circle cx="450" cy="350" r="360" /><circle cx="450" cy="350" r="290" strokeDasharray="2 6" /><path d="M450 0v700M0 350h900" strokeDasharray="2 4" />{Array.from({ length: 60 }, (_, i) => <line key={i} x1="450" x2="450" y1="-10" y2={i % 5 ? '-2' : '6'} transform={`rotate(${i * 6} 450 350)`} />)}</g>
          <g aria-hidden="true">{edges.map(e => {
            const a = coordinates[e.from], b = coordinates[e.to]; if (!a || !b) return null;
            const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy), active = e.from === selected || e.to === selected;
            return <line key={`${e.type}-${e.from}-${e.to}`} x1={a[0] + dx / d * 13} y1={a[1] + dy / d * 13} x2={b[0] - dx / d * 14} y2={b[1] - dy / d * 14} className={active ? 'edge active-edge' : 'edge'} strokeDasharray={e.type === 'RECOMMENDED_BEFORE' ? '4 5' : undefined} markerEnd={`url(#arrow-${active ? 'active' : 'muted'})`} />;
          })}</g>
          {data.courses.map((c, i) => {
            const [x, y] = coordinates[c.id] ?? [450, 350], active = c.id === selected;
            return <g key={c.id} ref={node => { if (node) graphNodes.current.set(c.id, node); else graphNodes.current.delete(c.id); }} transform={`translate(${x},${y})`} role="button" tabIndex={0} aria-label={`Seleziona ${c.id}: ${c.title}`} aria-pressed={active} className={`course-node ${active ? 'selected' : ''}`} onClick={() => setSelected(c.id)} onFocus={() => setSelected(c.id)} onKeyDown={event => {
              if (['Enter', ' '].includes(event.key)) { event.preventDefault(); setSelected(c.id); }
              if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? data.courses.length - 1 : (i + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + data.courses.length) % data.courses.length;
                graphNodes.current.get(data.courses[next].id)?.focus();
              }
            }}><title>{c.title}</title><circle className="node-hit" r="28" /><circle className="node-ring" r="19" /><circle className="node-dot" r={active ? 10 : 6} /><text x={c.id === 'EAT-001' ? -24 : 13} y="5" textAnchor={c.id === 'EAT-001' ? 'end' : 'start'}>{c.id}</text></g>;
          })}
          <text className="selected-course-name" x={selectedName.x} y={selectedName.y} aria-hidden="true">{selectedName.lines.map((line, i) => <tspan key={i} x={selectedName.x} dy={i ? 17 : 0}>{line}</tspan>)}</text>
        </svg>
      </div>}
      <div className="map-footer"><div className="legend"><span><span className="legend-dot" />Corso selezionato</span><span><span className="legend-edge" />Prerequisito</span>{recommended && <span><span className="legend-edge recommended" />Consigliato</span>}</div><div className="zoom-tools" aria-label="Zoom della mappa"><button aria-label="Riduci zoom" disabled={list || zoom <= 0.8} onClick={() => setZoom(z => Math.max(0.8, z - 0.2))}><Icon name="minus" /></button><button aria-label="Aumenta zoom" disabled={list || zoom >= 1.6} onClick={() => setZoom(z => Math.min(1.6, z + 0.2))}><Icon name="plus" /></button><button aria-label="Adatta la mappa" disabled={list} onClick={() => setZoom(1)}><Icon name="fit" /></button></div></div>
    </section>
    <aside className="course-inspector" aria-label="Corso selezionato">
      <p className="selected-id mono">{course.id}</p><h2>{course.title}</h2><p className="muted">{lessons.length ? `${lessons.length} lezioni draft` : 'Contenuto pianificato'}</p><Link className="primary-button" to={course.route}>Apri il corso<Icon name="arrow" /></Link>
      <dl className="semantic-notes"><div><dt>Coverage SSRI</dt><dd>Copertura della fonte</dd></div><div><dt>Target IronMath</dt><dd>Requisito di manutenzione · {course.target_mastery}</dd></div><div className="mastery-note"><dt>Mastery personale:</dt><dd>non valutata</dd></div></dl>
      <div className="inspector-links"><h3>Prerequisiti</h3>{course.required_prerequisite_course_ids.length ? course.required_prerequisite_course_ids.map(id => <Link key={id} to={`/courses/${id}`}><span className="mono">{id}</span><Icon name="chevron" size={18} /></Link>) : <p className="muted">Nessuno</p>}<h3>Propedeutico a</h3>{children.length ? children.map(id => <Link key={id} to={`/courses/${id}`}><span className="mono">{id}</span><Icon name="chevron" size={18} /></Link>) : <p className="muted">Nessun corso successivo richiesto.</p>}</div>
    </aside>
  </div>;
}
