import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';
import { Reader } from './Reader';
import data from './generated/atlas.json';
import { PROGRESS_KEY } from './progress';

beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });
function app(path = '/') { return render(<MemoryRouter initialEntries={[path]}><App initialData={data} /></MemoryRouter>); }

describe('Atlas study journeys', () => {
  it('renders landmarks, canonical map nodes and keyboard selection', async () => {
    const user = userEvent.setup(); app();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Navigazione principale' })).toBeInTheDocument();
    const first = screen.getByRole('button', { name: /^Seleziona EAT-001:/ }); first.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: /^Seleziona EAT-002:/ })).toHaveFocus();
    expect(within(screen.getByRole('complementary', { name: 'Corso selezionato' })).getByRole('heading', { name: data.courses[1].title })).toBeInTheDocument();
  });
  it('opens the roadmap and all 21 canonical courses', async () => {
    const user = userEvent.setup(); app();
    await user.click(screen.getByRole('link', { name: 'Roadmap' }));
    await user.click(screen.getByRole('link', { name: 'Esplora la roadmap' }));
    expect(screen.getByRole('heading', { name: 'Dalle basi alla manutenzione' })).toBeInTheDocument();
    for (const c of data.courses) expect(screen.getByRole('link', { name: new RegExp(c.id) })).toHaveAttribute('href', c.route);
  });
  it('navigates course, module, unit, lesson and authored lab without duplicating lesson paths', async () => {
    const user = userEvent.setup(); app('/courses/EAT-001');
    await user.click(screen.getByRole('link', { name: /EAT-001-M01 Filesystem/ }));
    expect(screen.getByRole('heading', { name: 'Cosa imparerai a fare' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /EAT-001-M01-U01 Filesystem/ }));
    await user.click(screen.getByRole('link', { name: /EAT-001-M01-U01-L01 Filesystem/ }));
    expect(await screen.findByRole('article')).toHaveTextContent('Distinguere terminale, shell, comando e processo');
    expect(screen.getByRole('heading', { name: 'Modello mentale' })).toHaveAttribute('id', 'modello-mentale');
    await user.click(screen.getByRole('link', { name: 'Apri il lab' }));
    expect(screen.getByRole('link', { name: 'Lab' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('article')).toHaveTextContent('lab');
  });
  it('keeps planned modules honest and distinguishes source coverage, target and mastery', () => {
    app('/courses/EAT-012');
    expect(screen.getByText('Questo corso è pianificato. Non ci sono ancora lezioni da aprire.')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /EAT-012-M01/ })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Coverage SSRI' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Target IronMath' })).toBeInTheDocument();
    expect(screen.getAllByText('Non valutata').length).toBeGreaterThan(0);
  });
  it('searches local lesson text, follows a result, and offers a recoverable empty state', async () => {
    const user = userEvent.setup(); app();
    await user.type(screen.getByRole('searchbox'), 'EAT-001-M01-U01-L01');
    await user.click(within(screen.getByRole('region', { name: 'Risultati della ricerca' })).getByRole('link'));
    expect(await screen.findByRole('article')).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox'), 'zzzzinesistente');
    expect(screen.getByRole('status')).toHaveTextContent('Nessun risultato');
    await user.keyboard('{Escape}'); expect(screen.queryByRole('region', { name: 'Risultati della ricerca' })).not.toBeInTheDocument();
  });
  it('records only reading on an explicit action and supports cancellation and reset', async () => {
    const user = userEvent.setup(); app('/lessons/EAT-001-M01-U01-L01');
    expect(localStorage.getItem(PROGRESS_KEY)).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Segna come letta' }));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!)).toEqual({ version: 1, read_lesson_ids: ['EAT-001-M01-U01-L01'] });
    await user.click(screen.getByRole('link', { name: 'Il mio studio' }));
    expect(screen.getByRole('heading', { name: '1 di 11 lezioni segnate come lette' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Azzera il progresso di lettura' }));
    await user.click(screen.getByRole('button', { name: 'Annulla' }));
    expect(localStorage.getItem(PROGRESS_KEY)).not.toBeNull();
    await user.click(screen.getByRole('button', { name: 'Azzera il progresso di lettura' }));
    await user.click(screen.getByRole('button', { name: 'Azzera i segni' }));
    expect(localStorage.getItem(PROGRESS_KEY)).toBeNull();
  });
  it('preserves incompatible saved data until an explicit reset', async () => {
    localStorage.setItem(PROGRESS_KEY, '{broken');
    const user = userEvent.setup(); app('/lessons/EAT-001-M01-U01-L01');
    await user.click(screen.getByRole('button', { name: 'Segna come letta' }));
    expect(screen.getByRole('status')).toHaveTextContent('progresso locale non è disponibile');
    expect(localStorage.getItem(PROGRESS_KEY)).toBe('{broken');
  });
  it('explores all graph node types and canonical relations', async () => {
    const user = userEvent.setup(); app('/graph?node=skill.agents.repo-workflows');
    expect(screen.getByText('218 nodi e 490 relazioni.', { exact: false })).toBeInTheDocument();
    const detail = screen.getByRole('complementary', { name: 'Dettaglio del nodo' });
    expect(within(detail).getByRole('heading', { name: 'Agenti e workflow repository' })).toBeInTheDocument();
    expect(detail).toHaveTextContent('M4 · Requisito');
    await user.type(screen.getByRole('searchbox', { name: 'Filtra i nodi' }), 'non-esiste');
    expect(screen.getByRole('status')).toHaveTextContent('0 nodi');
  });
  it.each(['/courses/unknown', '/modules/unknown', '/units/unknown', '/lessons/unknown', '/roadmaps/unknown', '/missing'])('recovers from unavailable direct route %s', path => {
    app(path); expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('non disponibile');
    expect(screen.getByRole('link', { name: 'Apri le roadmap' })).toHaveAttribute('href', '/roadmaps');
  });
  it('shows loading, handles missing catalog, and retries a failed loader', async () => {
    const user = userEvent.setup(), loader = vi.fn().mockRejectedValueOnce(new Error('missing')).mockResolvedValue(data);
    const reload = vi.fn();
    const view = render(<MemoryRouter><App loader={loader} onReload={reload} /></MemoryRouter>);
    expect(screen.getByRole('status')).toHaveTextContent('Caricamento');
    expect(await screen.findByRole('heading', { name: 'Catalogo non disponibile' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Riprova' }));
    expect(reload).toHaveBeenCalledOnce();
    view.unmount(); render(<MemoryRouter><App loader={loader} /></MemoryRouter>);
    expect(await screen.findByRole('heading', { name: 'Esplora il percorso' })).toBeInTheDocument();
  });
  it('renders Markdown, GFM and real KaTeX while excluding raw HTML and executable links', () => {
    const doc = { ...data.documents[0], markdown: '# Formula\n\n$x^2 + y^2$\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n<script>alert(1)</script>\n\n[bad](javascript:alert(1))', headings: [{ level: 1, text: 'Formula', id: 'formula' }], links: {} };
    const { container } = render(<MemoryRouter><Reader document={doc} /></MemoryRouter>);
    expect(container.querySelector('.katex math')).not.toBeNull();
    expect(container.querySelector('annotation')?.textContent).toBe('x^2 + y^2');
    expect(screen.getByRole('table')).toHaveTextContent('1');
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
  });
});
