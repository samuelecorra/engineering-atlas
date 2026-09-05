# Engineering Atlas

Repository locale per collegare il curriculum documentato in SSRI alla manutenzione end-to-end di IronMath. I due repository restano separati: qui risiedono metadata, evidenze, grafo e percorsi didattici; nessuna dipendenza runtime li collega.

## Stato e percorso di lettura

Questa è la prima tranche. Il contenuto attivo resta **draft**: i controlli automatici non sostituiscono una review didattica o un assessment personale. I conteggi e il piano sono nel [report curricolare](reports/curriculum-roadmap.md).

1. Leggi la [policy canonica](governance/AGENT_POLICY.md) e il [modello mastery](governance/MASTERY_MODEL.md).
2. Consulta [baseline SSRI](reports/ssri-coverage.md), [requisiti IronMath](reports/ironmath-requirements.md) e [gap analysis](reports/gap-analysis.md).
3. Segui la [roadmap](reports/curriculum-roadmap.md) e la [mappa di lettura IronMath](projects/ironmath-reading-map.md).
4. Parti da EAT-001, poi EAT-002; prova personalmente i lab prima di una review con agente.

## Coverage e mastery

Coverage descrive la fonte: C0 nessuna evidenza, C1 concettuale, C2 esempi guidati, C3 laboratorio sostanziale, C4 sistema autentico mantenuto.
Mastery descrive una persona: M0 Recognize, M1 Explain, M2 Apply with guidance, M3 Work independently, M4 Maintain and design.
Una lezione presente, un test verde o un corso SSRI non dimostrano mastery. Nessun profilo personale reale viene creato. Vedi [progress](progress/README.md).

## Struttura e fonti di verità

- `governance/`: policy, lifecycle, evidenze e ADR.
- `sources/`: snapshot, drift, claim e tassonomia con provenienza.
- `schemas/`: contratti JSON Schema draft 2020-12; il validator implementa e verifica il sottoinsieme effettivamente usato.
- `catalog/skills/`, `curriculum/courses/`: metadata canonici; gli assessment hanno un proprio `assessment.json` accanto al Markdown.
- `graph/knowledge-graph.json`: grafo canonico; [semantica e limiti](graph/README.md).
- `catalog/indexes/`, `reports/`: artifact generati deterministici, con check di freshness.
- `scripts/`, `tests/`: CLI Node senza dipendenze npm; fixture didattiche offline nei moduli attivi.

## Comandi locali

Richiesti Node 24 e npm 11; Git per i lab Git, Python 3.10+ con `venv` per il lab Python. Non servono account, credenziali o repository fratelli per i controlli.

```text
npm ci --ignore-scripts --offline --no-audit --no-fund
npm run build:indexes
npm run build:reports
npm run validate
npm test
npm run check:generated
git diff --check
```

Su un clone pulito esegui prima `npm ci`, poi `validate`, `test` e `check:generated` **senza rigenerare**: così rilevi artifact obsoleti. I test lanciano anche le fixture Node, Git e Python; se un interprete manca falliscono con un errore esplicito, senza skip silenziosi. Per Windows puoi impostare `ATLAS_PYTHON` al percorso dell'interprete. PowerShell usa `$env:ATLAS_PYTHON = 'python'`; Bash usa `export ATLAS_PYTHON=python3`.

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

Nessun sito, workflow, deploy, remote o push fa parte di Atlas. I corsi cloud sono soltanto metadata pianificati. SSRI è baseline accademica: non ne vengono riscritti i corsi già coperti.
roadmap.sh fornisce soltanto label tassonomiche e URL (`taxonomy-label-only`), senza roadmap o descrizioni copiate. Le URL non verificate restano `pending` e non sono prerequisiti dei test offline. La disponibilità locale dei commit è registrata in [sources](sources/repositories.json); il drift non aggiorna l'audit implicitamente.
