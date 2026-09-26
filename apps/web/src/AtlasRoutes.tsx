import { Suspense } from 'react';
import { ContentBoundary } from './ContentBoundary';
import { Route, Routes } from 'react-router-dom';
import type { AtlasData } from './data';
import { MapExplorer } from './MapExplorer';
import { CoursePage, DocumentPage, LessonPage, ModulePage, Roadmaps, UnitPage, Unavailable } from './Curriculum';
import { GraphPage } from './GraphPage';
import { ProgressPage } from './ProgressPage';
import { useReading } from './useReading';
export default function AtlasRoutes({ data }: { data: AtlasData }) {
  const reading = useReading(data);
  return <ContentBoundary><Suspense fallback={<section className="state-page" aria-busy="true"><p role="status">Caricamento del documento…</p></section>}><Routes><Route path="/" element={<MapExplorer data={data} />} /><Route path="/roadmaps" element={<Roadmaps data={data} />} /><Route path="/roadmaps/:roadmapId" element={<Roadmaps data={data} detail />} /><Route path="/courses/:courseId" element={<CoursePage data={data} />} /><Route path="/modules/:moduleId" element={<ModulePage data={data} />} /><Route path="/units/:unitId" element={<UnitPage data={data} />} /><Route path="/lessons/:lessonId" element={<LessonPage data={data} reading={reading} />} /><Route path="/documents/:documentId" element={<DocumentPage data={data} />} /><Route path="/graph" element={<GraphPage data={data} />} /><Route path="/progress" element={<ProgressPage data={data} reading={reading} />} /><Route path="*" element={<Unavailable />} /></Routes></Suspense></ContentBoundary>;
}
