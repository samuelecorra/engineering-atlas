# Mappa di lettura IronMath

Snapshot di riferimento: `22da98929d9c70e20a5a3a9d6fabfe2bd0279431`. I path sono identificatori nel repository IronMath, non link locali né dipendenze. Questa mappa seleziona ingressi rappresentativi dal baseline; non pretende un audit live di ogni file. Leggere solo file non sensibili.

| Corso | Anchor IronMath | Domanda di lettura |
| --- | --- | --- |
| EAT-001 | `package.json`, `tooling/launchers/`, `docs/bible/` | Riprodurre una sessione CLI e un documento verificabile su due sistemi. |
| EAT-002 | `AGENTS.md`, `.github/workflows/`, `docs/adr/` | Diagnosticare stato Git, sincronizzazione e recupero tra due macchine senza perdita. |
| EAT-003 | `apps/web/src/`, `apps/web/src/App.jsx` | Diagnosticare semantica JavaScript e flussi asincroni del browser con prove isolate. |
| EAT-004 | `package.json`, `apps/web/package.json`, `apps/api/package.json` | Spiegare e riprodurre runtime, installazione e build di package indipendenti. |
| EAT-005 | `apps/api/src/`, `apps/api/tsconfig.json` | Rifattorizzare contratti TypeScript e verificare i boundary runtime. |
| EAT-006 | `apps/web/src/App.jsx`, `apps/web/src/context/` | Implementare un flusso React con stato, router e recupero dagli errori. |
| EAT-007 | `apps/web/src/`, `apps/web/e2e/` | Verificare accessibilità, prestazioni e rendering matematico di una UI. |
| EAT-008 | `apps/api/src/server.ts`, `apps/api/src/routes/`, `apps/api/src/services/tutorStreamProxy.ts` | Progettare un contratto API Fastify con validation, errori e streaming cancellabile. |
| EAT-009 | `apps/api/prisma/schema.prisma`, `apps/api/prisma/migrations/`, `apps/api/src/lib/prisma.ts` | Progettare e provare una migrazione Prisma con controllo transazioni e recovery. |
| EAT-010 | `apps/api/src/routes/`, `docs/bible/04-sicurezza/` | Verificare auth, isolamento tenant e ciclo dei dati con test negativi. |
| EAT-011 | `apps/web/e2e/`, `apps/api/tests/`, `services/ironmath-llm/tests/` | Scegliere e implementare prove cross-layer che rilevino regressioni reali. |
| EAT-012 | `docker-compose.yml`, `apps/api/Dockerfile` | Riprodurre e diagnosticare uno stack locale containerizzato con cleanup selettivo. |
| EAT-013 | `.github/workflows/` | Revieware una pipeline CI con permessi minimi, supply chain e release gate. |
| EAT-014 | `docs/status/`, `ARCHITECTURE.md` | Descrivere una consegna cloud con ambienti, smoke e rollback verificabili. |
| EAT-015 | `docs/status/`, `services/ironmath-llm/src/ironmath_llm/observability/` | Diagnosticare un incidente sintetico e dimostrare un restore con metriche sanitizzate. |
| EAT-016 | `services/ironmath-llm/pyproject.toml`, `services/ironmath-llm/src/ironmath_llm/` | Leggere e testare un servizio Python con package src e ambiente isolato. |
| EAT-017 | `services/ironmath-llm/requirements.txt`, `services/ironmath-llm/src/ironmath_llm/tutor/` | Progettare un client LLM con streaming, budget ed error recovery osservabile. |
| EAT-018 | `services/ironmath-llm/src/ironmath_llm/tutor/prompt_builder.py`, `services/ironmath-llm/src/ironmath_llm/tutor/retrieval.py`, `services/ironmath-llm/src/ironmath_llm/safety/`, `services/ironmath-llm/tests/` | Valutare un tutor grounded con contratti prompt, safety ed eval ripetibili. |
| EAT-019 | `AGENTS.md`, `CLAUDE.md`, `.graph/modules.json` | Condurre un task con agente controllando contesto, permessi, diff e apprendimento autonomo. |
| EAT-020 | `ARCHITECTURE.md`, `docs/adr/`, `.graph/modules.json`, `packages/curriculum/` | Revieware confini architetturali e provenance curricolare con schema, grafo e ADR. |

Il root manifest non dichiara workspaces: ogni applicazione ha il suo package/lockfile. Il package curriculum è collegato tramite alias del prodotto. Nessun comando Atlas esegue o importa IronMath. Le directory di valutazione vanno cercate tramite MODULE_MAP.md, senza inventare un path evaluation universale.
