import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Reader } from './Reader';
import data from './generated/atlas.json';

function reader(markdown: string) {
  return render(<MemoryRouter><Reader document={{ ...data.documents[0], markdown, headings: [], links: {} }} /></MemoryRouter>);
}
describe('Reader avanzato', () => {
  it('evidenzia il codice conservando indentazione, simboli e newline', () => {
    const code = 'const tags = ["<script>", "$PATH"];\n  console.log(tags);\n';
    const { container } = reader(`\`\`\`javascript\n${code}\`\`\``);
    expect(container.querySelector('pre code')?.textContent).toBe(code);
    expect(container.querySelector('.hljs-keyword')).toHaveTextContent('const');
    expect(container.querySelector('script')).toBeNull();
  });
  it('distingue codice inline e blocco senza linguaggio, senza dedurre una grammatica', () => {
    const { container } = reader('`x < y`\n\n```\nx < y\n```');
    expect(container.querySelectorAll('pre')).toHaveLength(1);
    expect(container.querySelector('.hljs-keyword')).toBeNull();
    expect(screen.getByLabelText('Esempio di codice')).toHaveTextContent('x < y');
  });
  it('preserva codice e matematica annidati nel callout didattico', () => {
    const { container } = reader('> [!WARNING] Prima del comando\n>\n> Leggi $x^2$.\n>\n> ```bash\n> echo "ok"\n> ```');
    expect(container.querySelector('.callout-warning')).toHaveTextContent('Prima del comando');
    expect(container.querySelector('.callout-warning .katex math')).not.toBeNull();
    expect(container.querySelector('.callout-warning pre code')?.textContent).toBe('echo "ok"\n');
    expect(container.querySelector('blockquote')?.textContent).not.toContain('[!WARNING]');
  });
  it('mantiene leggibile una formula errata senza far sparire la lezione', () => {
    const { container } = reader('Prima $\\undefinedAtlas{x}$ dopo.');
    expect(screen.getByText('Formula da correggere:', { exact: false })).toBeInTheDocument();
    expect(container.querySelector('article')).toHaveTextContent('dopo.');
  });
  it('non abilita comandi HTML e link arbitrari tramite LaTeX', () => {
    const { container } = reader(String.raw`$\href{https://example.invalid/track}{x}$ $\htmlClass{injected}{x}$`);
    expect(container.querySelector('a[href="https://example.invalid/track"]')).toBeNull();
    expect(container.querySelector('.injected')).toBeNull();
    expect(container.querySelector('article')).toHaveTextContent('x');
  });
});
