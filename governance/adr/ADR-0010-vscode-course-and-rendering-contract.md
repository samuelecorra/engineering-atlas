# ADR-0010 — Corso VS Code e contratto del reader

Data: 2026-09-08. Stato: accepted per la tranche locale richiesta dall’utente.

## Contesto

L’utente richiede una ricognizione remota esplicita di lezioni/renderer SSRI e Actions IronMath, poi l’avvio prioritario dello studio di VS Code con agenti. Il limite originario dei sette starter non permette questa nuova tranche. Il frontend del 6 settembre è ancora nel working tree; il suo gate Impeccable resta aperto e questa decisione non lo dichiara superato.

## Decisione

Si aggiunge EAT-021, corso autonomo introduttivo su VS Code. Sono autorizzati soltanto EAT-021-M01, le due unità e le quattro lezioni elencate in `scope.extension_modules`; gli undici moduli successivi restano planned. I sette starter, i 52 skill e la loro ownership/coverage restano invariati. EAT-021 rinforza skill esistenti, senza inventare una nuova misura di coverage per VS Code: è l’unica eccezione al requisito di una skill primaria propria. Il modulo introduttivo rinforza quelle stesse skill e conserva lab/assessment propri.

Lo scope è verificato per ID di modulo, unità e lezione, oltre a ownership e path. Il controllo di provenance continua a confrontare esattamente i 51 archi della proiezione sui 20 corsi storici; l’aggiunta del corso non riscrive l’audit. La roadmap derivata può presentare EAT-021 prima del baseline: è una radice senza prerequisiti, mentre gli ID e l’ordine relativo dei venti corsi restano stabili.

Le letture remote richieste usano le API GitHub su commit fissati e file selezionati. Copie di consultazione soltanto in `.work/`; nessun fetch/pull/install/esecuzione nei sibling, nessuna modifica o nuova affermazione di audit completo. Le osservazioni sono riportate nella mappa pratica, separate dalle evidenze storiche.

Il reader condivide parser Markdown/GFM/math e opzioni KaTeX con il controllo di pre-build. Codice con linguaggio esplicito evidenziato, codice senza linguaggio conservato come testo, nessuna esecuzione. Callout didattici AST, raw HTML disabilitato e `trust: false`. Errori di formule, delimitatori o linguaggi non registrati impediscono la build. L’inventario dei setting personali e delle estensioni attende l’export dell’utente.

`rehype-highlight`, `highlight.js`, `unified`, `remark-parse` e `remark-rehype`, a versioni fissate, sono autorizzati esclusivamente nel workspace frontend per rendering e verifica condivisa. Le CLI curricolari root restano standard library; il nuovo comando root delega al workspace. Le notice dei nuovi pacchetti devono essere preservate.

## Limiti

Contenuti draft, nessuna attribuzione di mastery e nessuna promessa di completezza universale. Le lezioni dichiarano fonti, data, versione e limiti della verifica GUI. Nessuna scelta di licenza Atlas, push, deploy, workflow attivo, backend, modifica GitHub o accesso a dati personali. Gli esempi di produzione sono letture di codice, non esecuzioni sull’infrastruttura.
