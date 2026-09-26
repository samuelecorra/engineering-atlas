import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { loadAtlas, searchAtlas } from './data';
import type { AtlasData } from './data';
import { Icon } from './Icon';
import AtlasRoutes from './AtlasRoutes';

export function App({ initialData, loader = loadAtlas, onReload = () => window.location.reload() }: { initialData?: AtlasData; loader?: () => Promise<AtlasData>; onReload?: () => void }) {
  const [data, setData] = useState(initialData), [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => { try { return localStorage.getItem('engineering-atlas.theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; } });
  const location = useLocation();
  useEffect(() => {
    if (initialData) return;
    let active = true;
    loader().then(value => { if (active) { setData(value); setError(false); } }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [initialData, loader]);
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('engineering-atlas.theme', theme); } catch { /* Theme remains usable for this session. */ } }, [theme]);
  useEffect(() => { document.title = 'Engineering Atlas'; document.getElementById('main-content')?.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }, [location.pathname]);
  const results = data ? searchAtlas(data, query) : [];
  return <div className="app-shell"><a className="skip-link" href="#main-content">Salta al contenuto</a>
    <header className="masthead"><Link className="brand" to="/" aria-label="Engineering Atlas, panoramica"><Icon name="atlas" size={30} /><span>Engineering Atlas</span></Link><div className="search-area"><form role="search" onSubmit={e => e.preventDefault()}><Icon name="search" size={21} /><label className="sr-only" htmlFor="atlas-search">Cerca nel percorso</label><input id="atlas-search" type="search" placeholder="Cerca nel percorso" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setQuery(''); }} autoComplete="off" /></form>{query.trim() && <section className="search-results" aria-label="Risultati della ricerca"><p role="status">{results.length ? `${results.length} risultati` : 'Nessun risultato. Prova un ID o una parola diversa.'}</p><ul>{results.map(result => <li key={result.id}><Link to={result.route} onClick={() => setQuery('')}><span className="mono">{result.id}</span><strong>{result.title}</strong><span>{result.kind} · {result.status}</span></Link></li>)}</ul><button className="quiet-button" onClick={() => setQuery('')}>Chiudi ricerca<Icon name="close" size={18} /></button></section>}</div><button className="theme-button" aria-label={theme === 'dark' ? 'Attiva tema chiaro' : 'Attiva tema scuro'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button></header>
    <nav className="primary-nav" aria-label="Navigazione principale"><NavLink to="/" end><Icon name="map" size={29} />Mappa</NavLink><NavLink to="/roadmaps"><Icon name="roadmap" size={29} />Roadmap</NavLink><NavLink to="/progress"><Icon name="book" size={29} />Il mio studio</NavLink></nav>
    <main id="main-content" tabIndex={-1}>{error ? <section className="state-page"><h1>Catalogo non disponibile</h1><p>Non è stato possibile aprire i dati locali. Riprova; se il problema continua, verifica la generazione del catalogo dalla root del progetto.</p><button className="primary-button" onClick={onReload}>Riprova</button></section> : !data ? <section className="state-page" aria-busy="true"><h1>Preparazione dell’atlante</h1><p role="status">Caricamento del catalogo locale…</p></section> : <AtlasRoutes data={data} />}</main>
  </div>;
}
