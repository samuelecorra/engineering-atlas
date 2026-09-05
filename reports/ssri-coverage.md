GENERATED — DO NOT EDIT DIRECTLY
Source: catalog/skills/*.json; sources/evidence/ssri-coverage.json; sources/repositories.json
Regenerate: npm run build:reports

# Coverage SSRI

Coverage della fonte ≠ mastery personale. C descrive il materiale SSRI; M è il requisito IronMath, non una competenza attribuita al learner. Stato del contenuto e assessment personale restano separati.

- samuelecorra/cybersec_unimi_ssri2.0: audit `7467a51576a7c1514edacb26d9408bf0c1444a7d` (6310 file); locale `c691750bf85e6130b9ef59eeb357366508d05311` (6271 file), drift `different-audit-unavailable`. Oggetto commit audit non disponibile localmente. README e inventario correnti letti; lezioni ora sotto lessons/cybersecurity/. Conteggi e coverage restano quelli forniti, non riverificati sullo snapshot. Il viewer React/Vite e il workflow correnti non sono coverage curricolare.
- samuelecorra/ironmath: audit `22da98929d9c70e20a5a3a9d6fabfe2bd0279431` (4069 file); locale `ec809fb3f4dd8e5b8493fddcb53ef759d5d9d047` (4069 file), drift `ahead`. Snapshot audit accessibile e antenato di HEAD; controllati manifest e architettura, senza nuovo audit integrale.

| Skill | Titolo | Coverage | Evidence ID |
| --- | --- | --- | --- |
| skill.agents.repo-workflows | Agenti e workflow repository | C0 | `ev.ssri.absence-agents.repo-workflows`, `ev.ssri.absence-operational-ecosystem` |
| skill.analytics.learning-provenance | Analytics, provenance e calibrazione | C2 | `ev.ssri.stats` |
| skill.api.contracts-validation | Contratti e validazione API | C1 | `ev.ssri.pss-testing` |
| skill.api.sse-streaming | SSE e streaming API | C0 | `ev.ssri.absence-api.sse-streaming`, `ev.ssri.absence-operational-ecosystem` |
| skill.architecture.monorepo-boundaries | Architettura e boundary monorepo | C1 | `ev.ssri.pss-testing` |
| skill.cicd.github-actions | GitHub Actions e CI/CD | C1 | `ev.ssri.pss-devops` |
| skill.cli.environment | CLI e ambiente riproducibile | C2 | `ev.ssri.os` |
| skill.cloud.cloudflare | Cloudflare operativo | C0 | `ev.ssri.absence-cloud.cloudflare`, `ev.ssri.absence-operational-ecosystem` |
| skill.cloud.environments-network-policy | Ambienti e policy rete | C2 | `ev.ssri.network` |
| skill.cloud.railway | Railway operativo | C0 | `ev.ssri.absence-cloud.railway`, `ev.ssri.absence-operational-ecosystem` |
| skill.containers.compose | Compose e stack locali | C1 | `ev.ssri.pss-devops` |
| skill.containers.docker | Container Docker | C2 | `ev.ssri.pss-devops` |
| skill.curriculum.knowledge-graph | Curriculum e knowledge graph | C1 | `ev.ssri.pss-testing` |
| skill.db.sql-transactions | SQL e transazioni | C3 | `ev.ssri.db` |
| skill.docs.markdown-latex | Markdown, LaTeX e docs verificabili | C1 | `ev.ssri.readme` |
| skill.fastify.backend | Backend Fastify | C0 | `ev.ssri.absence-fastify.backend`, `ev.ssri.absence-operational-ecosystem` |
| skill.frontend.state-errors | Stato ed errori frontend | C0 | `ev.ssri.absence-frontend.state-errors`, `ev.ssri.absence-operational-ecosystem` |
| skill.git.internals | Git internals e recovery | C2 | `ev.ssri.pss-devops` |
| skill.git.multi-device | Git tra due macchine | C0 | `ev.ssri.absence-git.multi-device`, `ev.ssri.absence-operational-ecosystem` |
| skill.github.collaboration | Collaborazione e review GitHub | C1 | `ev.ssri.pss-devops` |
| skill.governance.adr-docs | ADR e docs-as-code | C1 | `ev.ssri.pss-testing` |
| skill.js.browser-async | Browser e asincronia | C1 | `ev.ssri.js`, `ev.ssri.js-empty` |
| skill.js.fundamentals | JavaScript moderno | C2 | `ev.ssri.js` |
| skill.llm.conversation-pedagogy | Conversazione e pedagogia | C0 | `ev.ssri.absence-llm.conversation-pedagogy`, `ev.ssri.absence-operational-ecosystem` |
| skill.llm.foundations | Fondamenti LLM | C0 | `ev.ssri.absence-llm.foundations`, `ev.ssri.absence-operational-ecosystem` |
| skill.llm.prompt-routing-retrieval | Prompt, routing e retrieval | C0 | `ev.ssri.absence-llm.prompt-routing-retrieval`, `ev.ssri.absence-operational-ecosystem` |
| skill.llm.responses-streaming | API LLM e streaming | C0 | `ev.ssri.absence-llm.responses-streaming`, `ev.ssri.absence-operational-ecosystem` |
| skill.llm.safety-evals | Safety LLM ed eval | C0 | `ev.ssri.absence-llm.safety-evals`, `ev.ssri.absence-operational-ecosystem` |
| skill.native.tauri-capacitor | Adapter Tauri e Capacitor | C0 | `ev.ssri.absence-native.tauri-capacitor`, `ev.ssri.absence-operational-ecosystem` |
| skill.node.esm-vite | ESM e Vite | C0 | `ev.ssri.absence-node.esm-vite`, `ev.ssri.absence-operational-ecosystem` |
| skill.node.npm-packages | npm e package | C0 | `ev.ssri.absence-node.npm-packages`, `ev.ssri.absence-operational-ecosystem` |
| skill.node.runtime | Node runtime | C1 | `ev.ssri.pss-devops` |
| skill.postgres.operations | PostgreSQL operativo | C1 | `ev.ssri.db` |
| skill.prisma.migrations | Prisma e migrazioni | C0 | `ev.ssri.absence-prisma.migrations`, `ev.ssri.absence-operational-ecosystem` |
| skill.privacy.minors-retention-secrets | Privacy, minori e retention | C2 | `ev.ssri.governance` |
| skill.python.fastapi-async | FastAPI e async Python | C0 | `ev.ssri.absence-python.fastapi-async`, `ev.ssri.absence-operational-ecosystem` |
| skill.python.language | Python applicativo | C1 | `ev.ssri.python` |
| skill.python.packaging | Packaging Python | C0 | `ev.ssri.absence-python.packaging`, `ev.ssri.absence-operational-ecosystem` |
| skill.react.application | React applicativo | C0 | `ev.ssri.absence-react.application`, `ev.ssri.absence-operational-ecosystem` |
| skill.security.auth-crypto | Auth e crittografia applicata | C3 | `ev.ssri.crypto` |
| skill.security.tenancy-idor | Tenancy e IDOR | C1 | `ev.ssri.governance` |
| skill.sre.backup-incident-retention | Backup, incident e retention | C1 | `ev.ssri.governance` |
| skill.sre.observability | Osservabilità | C1 | `ev.ssri.pss-devops` |
| skill.supply-chain.dependencies | Dipendenze e supply chain | C0 | `ev.ssri.absence-supply-chain.dependencies`, `ev.ssri.absence-operational-ecosystem` |
| skill.testing.cross-layer | Testing cross-layer | C1 | `ev.ssri.pss-testing` |
| skill.testing.theory-coverage | Testing e coverage | C3 | `ev.ssri.pss-testing` |
| skill.testing.toolchains | Toolchain di test | C0 | `ev.ssri.absence-testing.toolchains`, `ev.ssri.absence-operational-ecosystem` |
| skill.typescript.language | TypeScript e contratti | C0 | `ev.ssri.absence-typescript.language`, `ev.ssri.absence-operational-ecosystem` |
| skill.web.accessibility | Accessibilità applicativa | C2 | `ev.ssri.web` |
| skill.web.css-responsive | CSS responsive operativo | C2 | `ev.ssri.web` |
| skill.web.html-semantic | HTML semantico | C3 | `ev.ssri.web` |
| skill.web.http | HTTP applicato | C3 | `ev.ssri.network` |

## Evidenze e limiti

| Evidence ID | Path nello snapshot | Tipo | Claim | Confidence / provenienza |
| --- | --- | --- | --- | --- |
| `ev.ssri.readme` | `README.md` | architecture | Elenco dei corsi dei tre anni SSRI; presenza dei materiali non equivale a mastery personale. | medium / supplied-audit |
| `ev.ssri.programming` | `anno1/3_Programmazione` | lesson | C e Java: OOP, file, puntatori e allocazione, strutture, generics e lambda; base concettuale da trasferire a runtime diversi. | medium / supplied-audit |
| `ev.ssri.web` | `anno1/6_Programmazione_Web_Mobile` | lab | HTML semantico, CSS, responsive e accessibilità con esercizi; 455 Markdown di cui 183 vuoti nello snapshot fornito. | medium / supplied-audit |
| `ev.ssri.js` | `anno1/6_Programmazione_Web_Mobile/3_CorsoCompletoJS` | lesson | Introduzioni e 31 lezioni fondamentali non vuote; esempi storici DOM, Promise e fetch danno copertura parziale, non applicativa moderna. | medium / supplied-audit |
| `ev.ssri.js-empty` | `anno1/6_Programmazione_Web_Mobile/3_CorsoCompletoJS/M03–M11` | absence-check | Scope curricolare JS: i moduli avanzati M03–M11 sono vuoti nel baseline; il nome della directory non dimostra DOM/OOP/async/moderno/ecosistema. | medium / supplied-audit |
| `ev.ssri.os` | `anno2` | lesson | Sistemi operativi: processi, thread, scheduling, sincronizzazione, memoria, filesystem e distribuiti; CLI guidata ma non diagnostica cross-platform indipendente. | medium / supplied-audit |
| `ev.ssri.db` | `anno2` | lab | Basi di dati: modello relazionale, SQL, E-R, indici, transazioni, recovery e serializzabilità; PostgreSQL operativo e migrazioni applicative non dimostrati. | medium / supplied-audit |
| `ev.ssri.network` | `anno2` | lab | Reti: TCP/IP, protocolli applicativi e programmazione distribuita; base HTTP sostanziale senza contratti Fastify/SSE. | medium / supplied-audit |
| `ev.ssri.algorithms` | `anno2` | lesson | Algoritmi, grafi, strutture dati, sorting, ricerca e paradigmi di progetto con complessità; non richiedono nuovi corsi duplicati. | medium / supplied-audit |
| `ev.ssri.crypto` | `anno2` | lab | Crittografia e PKI; sicurezza, auth e access control con approfondimenti web/network, firewall, IDS/IPS e forensics negli insegnamenti successivi. | medium / supplied-audit |
| `ev.ssri.stats` | `anno2` | lesson | Probabilità, statistica, analisi dati e data mining: base per analytics, non prova di provenance o calibrazione del prodotto. | medium / supplied-audit |
| `ev.ssri.pss-testing` | `anno3/Progettazione_di_Software_Sicuro/lezione-8-laboratorio-JUnit` | lab | PSS lezione 8 e laboratorio JUnit: testing, coverage e analisi statica; requisiti, Design by Contract e OpenJML come basi di qualità. | medium / supplied-audit |
| `ev.ssri.pss-devops` | `anno3/Progettazione_di_Software_Sicuro/lezione-12` | lesson | PSS lezione 12: clone/add/commit/push/fetch/pull, branch/merge, PR, CI, Docker/Dockerfile, IaC e SecDevOps a profondità concettuale o guidata. | medium / supplied-audit |
| `ev.ssri.python` | `extra/Python` | lesson | Soltanto due file introduttivi: primo programma, variabili e tipi; nessuna base sufficiente per mantenere un servizio Python. | medium / supplied-audit |
| `ev.ssri.governance` | `anno3` | lesson | Governance sicurezza, requisiti e modelli; privacy come base, senza operazioni tenant/minori/retention specifiche di IronMath. | medium / supplied-audit |
| `ev.ssri.math-hardware` | `anno1` | lesson | Analisi, algebra, insiemi, relazioni, funzioni, complessi, serie, limiti, derivate, integrali; architettura, logica digitale, ISA, CPU, cache, I/O e pipeline già baseline. | medium / supplied-audit |
| `ev.ssri.absence-git.multi-device` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Git tra due macchine. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Manca evidenza di divergenza Mac/Windows, upstream, sync e recovery cross-machine. | medium / supplied-audit |
| `ev.ssri.absence-node.npm-packages` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di npm e package. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano manifest, dipendenze, semver, lockfile e installazione ripetibile. | medium / supplied-audit |
| `ev.ssri.absence-node.esm-vite` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di ESM e Vite. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano resolution ESM, build-time env, alias e confine browser/runtime. | medium / supplied-audit |
| `ev.ssri.absence-typescript.language` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di TypeScript e contratti. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: I tipi Java non equivalgono a narrowing, generics TS e validazione runtime con Zod. | medium / supplied-audit |
| `ev.ssri.absence-react.application` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di React applicativo. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano componenti, hooks, router, effect e confini dell'applicazione Vite. | medium / supplied-audit |
| `ev.ssri.absence-frontend.state-errors` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Stato ed errori frontend. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano ownership dello stato, async UI, error boundary e recovery dell'esperienza utente. | medium / supplied-audit |
| `ev.ssri.absence-fastify.backend` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Backend Fastify. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano lifecycle/plugin Fastify, routing e test di integrazione del servizio. | medium / supplied-audit |
| `ev.ssri.absence-api.sse-streaming` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di SSE e streaming API. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano framing, interruzioni, backpressure e propagazione cancellation attraverso il proxy. | medium / supplied-audit |
| `ev.ssri.absence-prisma.migrations` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Prisma e migrazioni. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano schema/client, migrazioni versionate, backfill e verifica su dati esistenti. | medium / supplied-audit |
| `ev.ssri.absence-testing.toolchains` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Toolchain di test. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano node:test, pytest, Playwright e diagnostica delle rispettive fixture e runner. | medium / supplied-audit |
| `ev.ssri.absence-supply-chain.dependencies` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Dipendenze e supply chain. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano pinning, audit contestualizzato, provenance e aggiornamenti verificati. | medium / supplied-audit |
| `ev.ssri.absence-cloud.cloudflare` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Cloudflare operativo. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano confini Pages/Worker/Access, configurazione ambienti e rollback verificabile. | medium / supplied-audit |
| `ev.ssri.absence-cloud.railway` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Railway operativo. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano servizi, health, migration gate e recovery nel target Railway. | medium / supplied-audit |
| `ev.ssri.absence-python.packaging` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Packaging Python. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano venv, python -m pip, requirements, pyproject, editable install e layout src. | medium / supplied-audit |
| `ev.ssri.absence-python.fastapi-async` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di FastAPI e async Python. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano async I/O, lifecycle FastAPI/Uvicorn, config e gestione errori del servizio. | medium / supplied-audit |
| `ev.ssri.absence-llm.foundations` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Fondamenti LLM. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano token/context, limiti dei modelli e scelta basata su costo, latenza e comportamento. | medium / supplied-audit |
| `ev.ssri.absence-llm.responses-streaming` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di API LLM e streaming. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano Responses/streaming, structured output, tool use e recovery degli errori provider. | medium / supplied-audit |
| `ev.ssri.absence-llm.prompt-routing-retrieval` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Prompt, routing e retrieval. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano contratti prompt, grounding, selezione del contesto e diagnosi del retrieval. | medium / supplied-audit |
| `ev.ssri.absence-llm.conversation-pedagogy` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Conversazione e pedagogia. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano stato conversazionale, tutoring socratico e distinzione tra aiuto e soluzione. | medium / supplied-audit |
| `ev.ssri.absence-llm.safety-evals` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Safety LLM ed eval. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano golden eval, red-team, safety prima del routing e controllo delle regressioni comportamentali. | medium / supplied-audit |
| `ev.ssri.absence-agents.repo-workflows` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Agenti e workflow repository. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Mancano instruction boundary, permission, diff/test loop e handoff senza dipendenza dall'agente. | medium / supplied-audit |
| `ev.ssri.absence-native.tauri-capacitor` | `curriculum-audit-scope` | absence-check | Nel curriculum SSRI auditato non emerge insegnamento operativo di Adapter Tauri e Capacitor. Scope: materiali didattici dei tre anni ed extra; esclude il viewer e i suoi workflow. Baseline fornito, non nuovo audit. Ponte richiesto: Integrazioni native sperimentali: solo lettura guidata, senza farne un prerequisito del percorso principale. | medium / supplied-audit |
| `ev.ssri.absence-operational-ecosystem` | `curriculum-audit-scope` | absence-check | Absence check del baseline sui materiali didattici SSRI, esclusa la web app viewer: nessuna copertura operativa di TS/TSX, React/hooks/router, Fastify, Prisma, pytest, Playwright, FastAPI/Uvicorn, pip/venv/requirements/pyproject, npm/ESM/lockfile/semver, GitHub Actions, LLM/RAG/prompt engineering e agentic coding. Git avanzato e deployment Cloudflare/Railway non dimostrati. La scansione non viene ripetuta perché lo snapshot audit non è disponibile localmente. | medium / supplied-audit |
