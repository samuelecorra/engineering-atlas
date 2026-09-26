import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { remarkPlugins, rehypePlugins } from './markdown';
import { Link, useLocation } from 'react-router-dom';
import type { Document } from './data';
import 'katex/dist/katex.min.css';

type HeadingTree = { tagName?: string; properties?: Record<string, unknown>; children?: HeadingTree[] };
export function Reader({ document: doc }: { document: Document }) {
  const location = useLocation();
  const [indexOpen, setIndexOpen] = useState(() => window.matchMedia?.('(min-width: 768px)').matches ?? true);
  useEffect(() => {
    if (!location.hash) return;
    let id: string; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    document.getElementById(id)?.scrollIntoView();
  }, [location.hash, doc.id]);
  function headingIds() {
    return (tree: HeadingTree) => {
      let cursor = 0;
      function walk(node: HeadingTree) {
        if (node.tagName && /^h[1-6]$/.test(node.tagName)) {
          const heading = doc.headings[cursor++];
          if (heading) node.properties = { ...node.properties, id: heading.id, tabIndex: -1 };
        }
        node.children?.forEach(walk);
      }
      walk(tree);
    };
  }
  const links = doc.links as Record<string, string>;
  return <div className="reader-layout"><article className="prose" aria-label={doc.title}><Markdown remarkPlugins={remarkPlugins} rehypePlugins={[headingIds, ...rehypePlugins]} skipHtml components={{
    a: ({ href, children }) => {
      const target = href ? links[href] ?? (href.startsWith('#') ? href : null) : null;
      if (!target) return <span>{children}</span>;
      return target.startsWith('https://') ? <a href={target} rel="noreferrer">{children}</a> : <Link to={target}>{children}</Link>;
    },
    img: ({ alt }) => <span>{alt}</span>,
    table: ({ children }) => <div className="table-scroll" role="region" aria-label="Tabella del documento" tabIndex={0}><table>{children}</table></div>,
    pre: ({ children }) => <pre tabIndex={0} aria-label="Esempio di codice">{children}</pre>,
    span: ({ node, ...props }) => {
      void node;
      return props.className?.includes('katex-error')
        ? <span className="math-error" title={props.title}>Formula da correggere: <code>{props.children}</code></span>
        : <span {...props} />;
    },
  }}>{doc.markdown}</Markdown></article><aside className="reader-index" aria-label="Indice del documento"><details open={indexOpen} onToggle={event => setIndexOpen(event.currentTarget.open)}><summary>In questa pagina</summary><ol>{doc.headings.filter(h => h.level === 2).map(h => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol></details><p className="muted">{doc.status === 'draft' ? 'Contenuto draft. Review tecnica e didattica ancora da svolgere.' : 'Documento di riferimento.'}</p></aside></div>;
}
