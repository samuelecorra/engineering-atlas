import { Component } from 'react';
import type { ReactNode } from 'react';
export class ContentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <section className="state-page"><h1>Contenuto non disponibile</h1><p>Il documento non è stato caricato correttamente. Ricarica l’atlante per riprovare.</p><button className="primary-button" onClick={() => window.location.reload()}>Ricarica l’atlante</button></section> : this.props.children;
  }
}
