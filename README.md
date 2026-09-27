# Engineering Atlas

A personal software-engineering curriculum that connects documented cybersecurity coursework to practical systems work. It organizes a knowledge graph, offline labs, assessments, evidence and provenance, while distinguishing source coverage from demonstrated learner mastery. Current content is draft; automated checks do not replace technical or pedagogical review. See the [repository](https://github.com/samuelecorra/engineering-atlas).

Atlas, SSRI, and IronMath are kept in separate repositories; this Atlas stores metadata, evidence, the graph, and learning paths, with no runtime dependencies connecting them. Checks and labs run locally.

## Current state and suggested reading

Active content remains **draft**: automated checks do not replace pedagogical review or a personal assessment. The seven starter modules retain U01/L01; the VS Code course EAT-021 begins with one module, two units, and four lessons. Counts and plans are in the [curriculum report](reports/curriculum-roadmap.md); original audit material is preserved in the [provenance pack](sources/audits/2026-09-05-initial/README.md).

1. Read the [canonical policy](governance/AGENT_POLICY.md) and [mastery model](governance/MASTERY_MODEL.md).
2. Review the [SSRI baseline](reports/ssri-coverage.md), [IronMath requirements](reports/ironmath-requirements.md), and [gap analysis](reports/gap-analysis.md).
3. Follow the [roadmap](reports/curriculum-roadmap.md) and [IronMath reading map](projects/ironmath-reading-map.md).
4. Start with EAT-001, then EAT-002; try the labs yourself before an optional agent review.

## Coverage and mastery

Coverage describes source evidence: C0 none, C1 conceptual, C2 guided examples, C3 substantial lab, C4 maintained authentic system.
Mastery describes a learner: M0 Recognize, M1 Explain, M2 Apply with guidance, M3 Work independently, M4 Maintain and design.
A lesson, passing test, or completed SSRI course does not demonstrate mastery. No real learner profile is created. See [progress](progress/README.md).

## Struttura e fonti di verità

- `governance/`: policy, lifecycle, evidenze e ADR.
- `sources/`: snapshot, drift, claim e tassonomia con provenienza.
- `schemas/`: contratti JSON Schema draft 2020-12; il validator implementa e verifica il sottoinsieme effettivamente usato.
- `catalog/skills/`, `curriculum/courses/`: metadata canonici course → module → unit → lesson. Le lezioni risiedono in `units/<id>-<slug>/lessons/<id>-<slug>/lesson.md`; lab, fixture e assessment restano del modulo. Vedi [ADR-0008](governance/adr/ADR-0008-unit-lesson-hierarchy.md).
- `graph/knowledge-graph.json`: grafo canonico; [semantica e limiti](graph/README.md).
- `catalog/indexes/`, `reports/`: artifact generati deterministici, con check di freshness.
- `scripts/`, `tests/`: CLI curricolari Node senza dipendenze runtime npm; fixture didattiche offline nei moduli attivi.
- `apps/web`: unico workspace frontend React/TypeScript/Vite/Tailwind, locale secondo [ADR-0009](governance/adr/ADR-0009-local-web-application.md).
- `apps/web/src/generated/atlas.json`: proiezione statica del curriculum e dei documenti, prodotta da `scripts/build-web-data.mjs`.

## Comandi locali

Richiesti Node 24 e npm 11; Git per i lab Git, Python 3.10+ con `venv` per il lab Python. Non servono account, credenziali o repository fratelli per i controlli.

```text
npm ci --ignore-scripts --no-audit --no-fund
npm run install:web-browser
npm run check
npm run dev:web
```

L’installazione delle dipendenze e di Chromium richiede rete la prima volta. Dopo averli installati, app, test e lab funzionano localmente; i link esterni nelle lezioni restano risorse facoltative da aprire. `npm run dev:web` serve l’app su `http://127.0.0.1:5173`. Interrompi il processo con Ctrl+C. La preview della build si avvia con `npm run preview --workspace apps/web` su `http://127.0.0.1:4173`.

Su un clone pulito verifica la freshness **senza rigenerare**. `npm run check` esegue validator, test curricolari e lab, lint, test React, build, test Chromium, freshness e `git diff --check`. Se Chromium non è installato il gate fallisce con l’istruzione di installazione; non ci sono skip silenziosi. Il browser di prova usa profili isolati e conserva cache, tracce e screenshot ignorati dentro Atlas.

Dopo una modifica autorizzata delle fonti canoniche, rigenera e verifica:

```text
npm run build:indexes
npm run build:reports
npm run build:web-data
npm run check
```

Comandi mirati: `npm run lint:web`, `npm run test:web`, `npm run build:web`, `npm run test:web-browser`, `npm run check:web`. I controlli curricolari restano disponibili con `npm run validate`, `npm test`, `npm run check:generated`.

La navigazione collega roadmap → corso → modulo → unità → lezione. Le undici lezioni, i lab e gli assessment mostrano testi autoriali; gli altri moduli mostrano solo il piano. Il reader supporta Markdown/GFM, KaTeX, callout didattici ed evidenziazione dei blocchi, con indice e link locali risolti. `npm run check:markdown` verifica la stessa sintassi prima della build; `npm run dev` è un alias di `npm run dev:web`. La ricerca usa il catalogo statico; il grafo espone nodi e relazioni anche tramite elenco. I segni di lettura sono salvati solo nel local storage del browser, su azione esplicita, e non modificano coverage, target o mastery. Importazione ed esportazione non sono ancora implementate.

I test lanciano fixture Node, Git e Python. Per Windows puoi impostare `ATLAS_PYTHON` al percorso dell’interprete: PowerShell `$env:ATLAS_PYTHON = 'python'`, Bash `export ATLAS_PYTHON=python3`. La verifica Windows resta da eseguire; questa tranche è stata verificata su macOS.

## Starter slice

Solo questi moduli hanno contenuto didattico:

- EAT-001-M01 filesystem, processi e path.
- EAT-001-M02 shell sicura ed environment.
- EAT-001-M03 Markdown, LaTeX e documentazione.
- EAT-002-M01 modello di stato Git.
- EAT-002-M02 sincronizzazione tra due macchine e recovery.
- EAT-004-M01 Node, npm e lockfile.
- EAT-016-M01 ambiente e packaging Python.

Gli altri moduli restano item pianificati nei `course.json`, senza directory di lezioni. EAT-004-M01 integra runtime, manifest e lockfile; EAT-016-M01 integra ambiente e packaging: gli altri item del piano approfondiscono outcome distinti, senza duplicare la prima slice.

## Manutenzione

La tranche fissa skill, corsi e slice in `governance/scope.json`. Per una successiva skill o un nuovo modulo serve un ampliamento autorizzato dello scope. Prima modifica il contratto e registra la decisione; poi aggiorna metadata canonici, evidence, ownership e grafo nella stessa modifica. Mantieni il DAG dei prerequisiti e rigenera indici/report. Non editare gli indici a mano. Un modulo entra in draft solo con lesson, lab, assessment Markdown e JSON coerenti. La [Definition of Done](governance/DEFINITION_OF_DONE.md) descrive i gate.

## Confini

La pubblicazione iniziale su GitHub è autorizzata dall'utente e registrata in [ADR-0006](governance/adr/ADR-0006-public-github-repository.md). `origin` può puntare alla repository ufficiale; i push successivi richiedono una richiesta che li autorizzi. È disponibile il frontend locale; hosting, GitHub Pages, workflow di pubblicazione e deploy restano vietati. I corsi cloud sono soltanto metadata pianificati. SSRI è baseline accademica: non ne vengono riscritti i corsi già coperti.

Il package resta `private: true` per impedirne la pubblicazione su npm. La licenza di riuso è ancora da scegliere; questa tranche non aggiunge un file LICENSE. Il profilo personale reale resta locale e ignorato da Git. Le [licenze e notice delle dipendenze frontend](apps/web/public/THIRD_PARTY_NOTICES.txt) sono preservate separatamente.
roadmap.sh fornisce soltanto label tassonomiche e URL (`taxonomy-label-only`), senza roadmap o descrizioni copiate. Le URL non verificate restano `pending` e non sono prerequisiti dei test offline. La disponibilità locale dei commit è registrata in [sources](sources/repositories.json); il drift non aggiorna l'audit implicitamente.

Per iniziare: [punto della situazione e percorso pratico](projects/practical-engineering.md), poi il [corso VS Code](curriculum/courses/EAT-021-visual-studio-code/course.json). Dal frontend locale: `/courses/EAT-021`.
