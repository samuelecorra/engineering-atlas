import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { AtlasData, Course } from './data';
import { Icon } from './Icon';
import { lazy } from 'react';
const Reader = lazy(() => import('./Reader').then(module => ({ default: module.Reader })));
import type { ReadingState } from './useReading';

export function Unavailable({ title = 'Percorso non disponibile' }: { title?: string }) {
  return <section className="state-page"><h1>{title}</h1><p>Questo indirizzo non corrisponde a un contenuto dell’atlante. Puoi ritrovarlo dalla roadmap o dalla ricerca.</p><Link className="primary-button" to="/roadmaps">Apri le roadmap<Icon name="arrow" /></Link></section>;
}
export function Breadcrumbs({ items }: { items: { title: string; route?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Percorso di studio"><ol><li><Link to="/roadmaps">Roadmap</Link></li>{items.map((item, i) => <li key={i}>{item.route ? <Link to={item.route}>{item.title}</Link> : <span aria-current="page">{item.title}</span>}</li>)}</ol></nav>;
}
export function Status({ value }: { value: string }) {
  return <span className={`content-status status-${value}`}>{({ draft: 'draft', planned: 'Pianificato', in_progress: 'In preparazione', reviewed: 'reviewed', validated: 'validated' } as Record<string, string>)[value] ?? value}</span>;
}
function PageHeading({ title, id, status, children }: { title: string; id?: string; status?: string; children?: ReactNode }) {
  return <header className="page-heading"><h1>{title}</h1><div className="page-meta">{id && <span className="mono">{id}</span>}{status && <Status value={status} />}</div>{children}</header>;
}
function CourseRows({ courses }: { courses: Course[] }) {
  return <ol className="course-rows">{courses.map(c => <li key={c.id}><Link to={c.route}><span className="mono row-id">{c.id}</span><div><h2>{c.title}</h2><p>{c.module_ids.length ? `${c.module_ids.length} moduli draft disponibili` : 'Contenuti pianificati'}</p></div><Icon name="arrow" /></Link></li>)}</ol>;
}
export function Roadmaps({ data, detail = false }: { data: AtlasData; detail?: boolean }) {
  const { roadmapId } = useParams();
  const roadmap = data.roadmaps.find(r => r.id === roadmapId);
  if (detail && !roadmap) return <Unavailable title="Roadmap non disponibile" />;
  return <div className="content-page"><Breadcrumbs items={detail ? [{ title: roadmap!.title }] : []} /><PageHeading title={detail ? roadmap!.title : 'Le tue roadmap'}><p>Una vista ordinata dei prerequisiti. Ogni corso conserva un unico contenuto, anche quando compare in percorsi diversi.</p></PageHeading>{detail ? <><p className="section-intro">{roadmap!.description}</p><CourseRows courses={roadmap!.course_ids.map(id => data.courses.find(c => c.id === id)!)} /></> : <><section className="roadmap-entry"><h2>{data.roadmaps[0].title}</h2><p>{data.roadmaps[0].description}</p><p className="muted">{data.courses.length} corsi · {data.lessons.length} lezioni draft</p><Link className="primary-button" to={data.roadmaps[0].route}>Esplora la roadmap<Icon name="arrow" /></Link></section><section className="plain-section"><h2>Da dove iniziare</h2><p>VS Code, poi Git e la manutenzione pratica di IronMath: obiettivi, fonti e prossime tranche in una sola mappa di studio.</p><Link className="text-link" to="/documents/practical-engineering">Apri il punto della situazione<Icon name="arrow" size={20} /></Link></section><section className="plain-section"><h2>Leggi le relazioni</h2><p>La mappa evidenzia i prerequisiti fra corsi. Il knowledge graph include anche skill, evidenze, unità, lezioni e assessment.</p><Link className="text-link" to="/graph">Esplora il knowledge graph<Icon name="arrow" size={20} /></Link></section></>}</div>;
}
export function CoursePage({ data }: { data: AtlasData }) {
  const { courseId } = useParams(), course = data.courses.find(c => c.id === courseId);
  if (!course) return <Unavailable title="Corso non disponibile" />;
  const skills = data.skills.filter(s => [...course.primary_skill_ids, ...course.reinforced_skill_ids].includes(s.id));
  return <div className="content-page"><Breadcrumbs items={[{ title: course.id }]} /><PageHeading title={course.title} id={course.id} status={course.status}><p>{course.outcomes.join(' ')}</p></PageHeading>
    <section className="plain-section"><h2>Moduli del corso</h2>{!course.module_ids.length && <p className="empty-note">Questo corso è pianificato. Non ci sono ancora lezioni da aprire.</p>}<ol className="curriculum-rows">{course.planned_modules.map(m => <li key={m.id}>{course.module_ids.some(id => id === m.id) ? <Link to={`/modules/${m.id}`}><div><span className="mono">{m.id}</span><h3>{m.title}</h3><p>{m.outcome}</p></div><Status value={m.status} /><Icon name="arrow" size={20} /></Link> : <div className="planned-row"><div><span className="mono">{m.id}</span><h3>{m.title}</h3><p>{m.outcome}</p></div><Status value="planned" /></div>}</li>)}</ol></section>
    <section className="plain-section"><h2>Prerequisiti e collegamenti</h2><div className="prerequisite-columns"><div><h3>Richiesti</h3>{course.required_prerequisite_course_ids.length ? <ul>{course.required_prerequisite_course_ids.map(id => <li key={id}><Link to={`/courses/${id}`}>{id} · {data.courses.find(c => c.id === id)!.title}</Link></li>)}</ul> : <p className="muted">Nessun prerequisito richiesto.</p>}</div><div><h3>Consigliati</h3>{course.recommended_prerequisite_course_ids.length ? <ul>{course.recommended_prerequisite_course_ids.map(id => <li key={id}><Link to={`/courses/${id}`}>{id} · {data.courses.find(c => c.id === id)!.title}</Link></li>)}</ul> : <p className="muted">Nessun collegamento consigliato.</p>}</div></div></section>
    <section className="plain-section"><h2>Fonti, obiettivi e competenza</h2><p className="section-intro">La coverage SSRI descrive le fonti documentate. Il target IronMath indica la competenza richiesta. La mastery personale resta non valutata finché non ci sono assessment ed evidenze osservabili.</p><div className="table-scroll" role="region" aria-label="Copertura e obiettivi delle skill" tabIndex={0}><table><caption>Skill collegate a {course.id}</caption><thead><tr><th scope="col">Skill</th><th scope="col">Coverage SSRI</th><th scope="col">Target IronMath</th><th scope="col">Mastery personale</th></tr></thead><tbody>{skills.map(s => <tr key={s.id}><th scope="row"><Link to={`/graph?node=${s.id}`}>{s.title}</Link></th><td>{s.ssri_coverage.level}</td><td>{s.ironmath_requirement.level}</td><td>Non valutata</td></tr>)}</tbody></table></div></section>
  </div>;
}
export function ModulePage({ data }: { data: AtlasData }) {
  const { moduleId } = useParams(), [search] = useSearchParams(), module = data.modules.find(m => m.id === moduleId);
  if (!module) return <Unavailable title="Modulo non disponibile" />;
  const course = data.courses.find(c => c.id === module.course_id)!, view = search.get('view');
  const docId = view === 'lab' ? module.lab_document_id : view === 'assessment' ? module.assessment_document_id : null;
  const tabs = <nav className="document-tabs" aria-label="Contenuti del modulo"><Link to={module.route} aria-current={!view ? 'page' : undefined}>Unità</Link><Link to={`${module.route}?view=lab`} aria-current={view === 'lab' ? 'page' : undefined}>Lab</Link><Link to={`${module.route}?view=assessment`} aria-current={view === 'assessment' ? 'page' : undefined}>Assessment</Link></nav>;
  const crumbs = <Breadcrumbs items={[{ title: course.id, route: course.route }, { title: module.id, route: docId ? module.route : undefined }, ...(docId ? [{ title: view === 'lab' ? 'Lab' : 'Assessment' }] : [])]} />;
  if (view && !docId) return <Unavailable title="Documento non disponibile" />;
  if (docId) return <div className="reader-page">{crumbs}{tabs}<Reader document={data.documents.find(d => d.id === docId)!} /></div>;
  return <div className="content-page">{crumbs}<PageHeading title={module.title} id={module.id} status={module.status}><p>Contenuto in bozza · Stima di studio: {module.estimated_hours} ore</p></PageHeading>{tabs}<section className="plain-section"><h2>Cosa imparerai a fare</h2><ul className="outcome-list">{module.outcomes.map(o => <li key={o}>{o}</li>)}</ul></section><section className="plain-section"><h2>Unità</h2><ol className="curriculum-rows">{module.unit_ids.map(id => { const unit = data.units.find(u => u.id === id)!; return <li key={id}><Link to={unit.route}><div><span className="mono">{unit.id}</span><h3>{unit.title}</h3><p>{unit.lesson_ids.length} {unit.lesson_ids.length === 1 ? 'lezione draft' : 'lezioni draft'}</p></div><Icon name="arrow" /></Link></li>; })}</ol></section></div>;
}
export function UnitPage({ data }: { data: AtlasData }) {
  const { unitId } = useParams(), unit = data.units.find(u => u.id === unitId);
  if (!unit) return <Unavailable title="Unità non disponibile" />;
  const module = data.modules.find(m => m.id === unit.module_id)!, course = data.courses.find(c => c.id === module.course_id)!;
  return <div className="content-page"><Breadcrumbs items={[{ title: course.id, route: course.route }, { title: module.id, route: module.route }, { title: unit.id }]} /><PageHeading title={unit.title} id={unit.id} status={unit.status} /><section className="plain-section"><h2>Lezioni</h2><ol className="curriculum-rows">{unit.lesson_ids.map(id => { const lesson = data.lessons.find(l => l.id === id)!; return <li key={id}><Link to={lesson.route}><div><span className="mono">{lesson.id}</span><h3>{lesson.title}</h3></div><Status value={lesson.status} /><Icon name="arrow" /></Link></li>; })}</ol></section><Link className="text-link" to={`${module.route}?view=lab`}>Apri il lab del modulo<Icon name="arrow" size={20} /></Link></div>;
}
export function LessonPage({ data, reading }: { data: AtlasData; reading: ReadingState }) {
  const { lessonId } = useParams(), lesson = data.lessons.find(l => l.id === lessonId);
  if (!lesson) return <Unavailable title="Lezione non disponibile" />;
  const unit = data.units.find(u => u.id === lesson.unit_id)!, module = data.modules.find(m => m.id === unit.module_id)!, course = data.courses.find(c => c.id === module.course_id)!;
  const read = reading.progress.read_lesson_ids.includes(lesson.id);
  return <div className="reader-page"><Breadcrumbs items={[{ title: course.id, route: course.route }, { title: module.id, route: module.route }, { title: unit.id, route: unit.route }, { title: 'Lezione' }]} /><div className="reader-actions"><span className="mono">{lesson.id}</span><button className="secondary-button" aria-pressed={read} onClick={() => reading.toggle(lesson.id)}><Icon name={read ? 'check' : 'book'} size={20} />{read ? 'Segnata come letta' : 'Segna come letta'}</button></div>{reading.issue && <p className="storage-note" role="status">{reading.issue} <Link to="/progress">Gestisci il progresso locale</Link></p>}<Reader document={data.documents.find(d => d.id === lesson.document_id)!} /><footer className="reader-end"><h2>Metti alla prova ciò che hai letto</h2><p>Il segno di lettura ti aiuta a ritrovare il punto. La competenza richiede una prova osservabile.</p><Link className="primary-button" to={`${module.route}?view=lab`}>Apri il lab<Icon name="arrow" /></Link><Link className="text-link" to={`${module.route}?view=assessment`}>Leggi l’assessment<Icon name="arrow" size={20} /></Link></footer></div>;
}
export function DocumentPage({ data }: { data: AtlasData }) {
  const { documentId } = useParams(), document = data.documents.find(d => d.route === `/documents/${documentId}`);
  return document ? <div className="reader-page"><Breadcrumbs items={[{ title: document.title }]} /><Reader document={document} /></div> : <Unavailable title="Documento non disponibile" />;
}
