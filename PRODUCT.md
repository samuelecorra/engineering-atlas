# Engineering Atlas

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Scelta esplicita dell'utente: React, TypeScript, Vite e Tailwind CSS in `apps/web`, Node 24. Applicazione locale su loopback, desktop-first e responsive su macOS e Windows. La compatibilità Windows deve essere verificata separatamente.

## Users

Uno studente con solida base informatica e cybersecurity che vuole arrivare alla manutenzione autonoma di IronMath e ai sistemi AI. Studia, esegue esercizi personalmente e conserva evidenze verificabili.

## Product Purpose

Knowledge atlas e ambiente personale di studio. Rendere visibili prerequisiti, gap, percorso, progresso ed evidenze; passare dall'esplorazione dei corsi alla lettura e alla pratica in una gerarchia stabile.

## Positioning

Il curriculum deriva dal confronto documentato tra la formazione SSRI e i requisiti di manutenzione di un prodotto reale, IronMath. Le fonti e i limiti delle evidenze sono espliciti.

## Operating Context

Uso locale durante studio e manutenzione del software. Il tentativo personale senza LLM precede la review opzionale. Lesson, lab e assessment sono documenti autoriali versionati; il browser conserva soltanto uno stato locale di consultazione. Nessun account, backend, analytics o sincronizzazione cloud.

## Capabilities and Constraints

Dashboard, roadmap di 20 corsi, navigazione corso → modulo → unità → lezione, reader Markdown/KaTeX, grafo accessibile, ricerca e progress locale. Solo sette starter module contengono lezioni reali, tutte draft; gli altri item sono pianificati. Una roadmap referenzia ID e non duplica contenuti. Dati web generati dalle fonti canoniche, mai letti dai sibling a runtime. Hosting, deploy, push e modifiche ai metadata GitHub esclusi da questa tranche. Licenza Atlas ancora da scegliere.

## Brand Commitments

Nome: Engineering Atlas. Voce precisa, adulta, tecnica ma comprensibile. L'utente richiede un'estetica ultrafuturistica e cartografica per esplorare e operare, e un reader calmo. Niente gamification infantile, falsi claim di mastery, glassmorphism indiscriminato, gradienti viola/blu generici, card annidate senza ragione o testo a basso contrasto.

## Evidence on Hand

20 corsi, 52 skill, sette moduli con U01/L01, assessment e lab offline. Fonti: `curriculum/courses`, `catalog/skills`, `sources/evidence`, `graph/knowledge-graph.json`. Gli originali dell'audit sono storici e non canonici. Nessun assessment personale superato è stato fornito; le 38 URL tassonomiche roadmap.sh restano pending.

## Product Principles

- Coverage SSRI descrive la fonte; target IronMath descrive un requisito; mastery personale richiede evidenza valutata.
- Lo stato draft del contenuto deve essere visibile e distinto dal progresso di consultazione.
- La fonte canonica rimane nel repository; il frontend è una proiezione navigabile.
- Un corso vuoto spiega il proprio stato senza suggerire competenze o contenuti inesistenti.

## Accessibility & Inclusion

Navigazione completa da tastiera, landmark semantici, focus visibile, contrasto adeguato, zoom elevato e mobile stretto. Movimento funzionale e disattivabile tramite prefers-reduced-motion. Loading, empty, error e unavailable state devono offrire una strada comprensibile per proseguire.
