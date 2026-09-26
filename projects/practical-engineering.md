# Da dove iniziare: il percorso pratico

Ricognizione dell’8 settembre 2026. Il primo passo è il [corso VS Code](../curriculum/courses/EAT-021-visual-studio-code/course.json): un modulo avviato, due unità e quattro lezioni draft con lab e assessment. Il programma contiene altri undici moduli pianificati, inclusi quelli specifici per Copilot, Codex e Claude Code.

## Che cosa c’è davvero oggi

Atlas contiene 21 corsi nel catalogo, 52 skill, 8 moduli attivi, 9 unità e 11 lezioni. Sette lezioni sono gli starter precedenti; quattro avviano VS Code. Le lezioni sono bozze da studiare e revisionare, non corsi già completi. Gli altri moduli hanno metadata di piano.

La competenza non viene dedotta dalla copertura accademica o dalla lettura: per ogni modulo il lab produce evidenze e l’assessment richiede diagnosi, spiegazione e recupero. Nessun profilo di mastery personale è stato creato.

## Che cosa ho verificato nelle fonti

Lettura remota selettiva tramite API GitHub, su commit fissati. Nessun aggiornamento delle copie locali SSRI/IronMath e nessuna esecuzione dei loro script.

| Fonte | Revisione letta | Perimetro |
| --- | --- | --- |
| SSRI, branch main | `713f5a97873ee6fb96a5c077966e021416b04889` | Albero completo dei path, README, manifest, renderer e utilità pertinenti, cinque documenti campione. |
| IronMath, branch mvp-final | `57b81c9aa4f203195224169127b46e54493088e1` | Albero completo dei path, README, package root e tutti i sette file di workflow. |

L’albero remoto SSRI contiene 6.328 file e 2.043 file Markdown sotto `lessons/`: il secondo numero comprende anche introduzioni e documenti di supporto, non certifica 2.043 lezioni complete. Il campione include sommatorie, induzione, rappresentazione digitale, introduzione SQL e laboratorio Docker. L’albero IronMath contiene 4.069 file. Gli alberi API non risultano troncati.

Le lezioni SSRI mostrano la struttura corso → modulo → unità → argomento, spiegazioni progressive, esempi, errori tipici ed esercizi. Questo è il riferimento didattico; il codice del viewer non viene contato come insegnamento accademico. Le osservazioni correnti non riscrivono l’audit storico o i suoi livelli di coverage.

## Il renderer delle lezioni

Il [Viewer SSRI](https://github.com/samuelecorra/cybersec_unimi_ssri2.0/blob/713f5a97873ee6fb96a5c077966e021416b04889/src/components/Viewer.jsx) usa React Markdown, GFM, remark-math, KaTeX, evidenziazione sintattica e callout. Lo [SourceViewer](https://github.com/samuelecorra/cybersec_unimi_ssri2.0/blob/713f5a97873ee6fb96a5c077966e021416b04889/src/components/SourceViewer.jsx) aggiunge funzioni per sorgenti separati. Il [checker LaTeX](https://github.com/samuelecorra/cybersec_unimi_ssri2.0/blob/713f5a97873ee6fb96a5c077966e021416b04889/scripts/check-latex.mjs) verifica formule estratte dai Markdown.

Atlas ora verifica i documenti prima della build con lo stesso parser e le stesse opzioni matematiche del reader. Formule errate, delimitatori non chiusi e linguaggi di codice non registrati producono errori con percorso e posizione. Il controllo non prova la correttezza matematica del ragionamento: per quella serve review del contenuto.

Per scrivere nuove lezioni: formule inline delimitate con un dollaro e formule display su righe delimitate con due dollari; esempi di sorgente in blocchi con linguaggio esplicito; dollari letterali escaped o in codice inline. Il codice conserva indentazione e contenuto. Callout `[!NOTE]`, `[!WARNING]` e gli altri tipi documentati vengono trattati come struttura del documento. I blocchi non vengono eseguiti.

Non è una replica integrale del viewer universitario: lightbox delle immagini, sorgenti separati, diagrammi eseguibili e colorazione automatica delle variabili matematiche non sono stati trasferiti. Una futura lezione che ne abbia bisogno richiederà asset e supporto verificati; non verrà dichiarata pronta mostrando soltanto il nome dell’immagine.

## I casi reali che useremo da IronMath

| File nello snapshot | Che cosa insegna |
| --- | --- |
| [core-bundle-ci.yml](https://github.com/samuelecorra/ironmath/blob/57b81c9aa4f203195224169127b46e54493088e1/.github/workflows/core-bundle-ci.yml) | Trigger PR/push, sette job, timeout, concorrenza, cache, directory dei package, PostgreSQL 16 come service, verifiche Node/Python e prove browser. |
| [deploy-frontend-cloudflare.yml](https://github.com/samuelecorra/ironmath/blob/57b81c9aa4f203195224169127b46e54493088e1/.github/workflows/deploy-frontend-cloudflare.yml) | Build e deploy separati, identità del commit, URL del deployment, smoke sul deep-link e attesa della propagazione sul dominio. |
| [deploy-frontend-staging.yml](https://github.com/samuelecorra/ironmath/blob/57b81c9aa4f203195224169127b46e54493088e1/.github/workflows/deploy-frontend-staging.yml) | Ambiente di prova, API Railway di staging, adattamento della CSP, noindex e verifica degli header. |
| [deploy-admin-cloudflare.yml](https://github.com/samuelecorra/ironmath/blob/57b81c9aa4f203195224169127b46e54493088e1/.github/workflows/deploy-admin-cloudflare.yml) | Superficie amministrativa separata e verifica degli header dopo il deploy. |
| [production-health-monitor.yml](https://github.com/samuelecorra/ironmath/blob/57b81c9aa4f203195224169127b46e54493088e1/.github/workflows/production-health-monitor.yml) | Schedule dichiarata ogni sei ore, probe, alert sanitizzati, disponibilità distinta dagli SLO dei dati. Non è monitoraggio continuo. |
| [bible-integrity.yml](https://github.com/samuelecorra/ironmath/blob/57b81c9aa4f203195224169127b46e54493088e1/.github/workflows/bible-integrity.yml) | Coerenza tra documentazione e fonti canoniche. |
| [sofia-safety-redteam.yml](https://github.com/samuelecorra/ironmath/blob/57b81c9aa4f203195224169127b46e54493088e1/.github/workflows/sofia-safety-redteam.yml) | Prova manuale delimitata allo staging e gestione dell’esito. |

Osservazione da capire nel corso CI/CD: i workflow di deploy letti partono indipendentemente dalla Core Bundle CI; nei loro file non c’è una dipendenza da quel workflow tramite `workflow_run`. Quindi “deploy passato” non implica “intera CI passata”. Questa è una lettura del codice: non certifica lo stato delle branch protection, dei piani GitHub, dei secret, delle run o della produzione, che non sono stati interrogati.

## Ordine di studio proposto

| Passo | Corso nel catalogo | Capacità pratica da costruire |
| --- | --- | --- |
| 1 | [VS Code, EAT-021](../curriculum/courses/EAT-021-visual-studio-code/course.json) | Controllare ambiente, interfaccia, impostazioni, estensioni, debug e agenti. |
| 2 | [Git/GitHub, EAT-002](../curriculum/courses/EAT-002-git-multi-machine/course.json) | Capire staging e cronologia, branch/worktree, recupero, PR, review e configurazioni account/repository motivate. |
| 3 | EAT-004, Node/npm | Distinguere package, lockfile, script, workspace, runtime e build riproducibile. |
| 4 | EAT-012 ed EAT-009 | Docker/Compose e PostgreSQL: reti, volumi, connessioni, migrazioni, backup e restore. |
| 5 | EAT-013, CI/CD | Leggere e costruire workflow con test reali, permessi, cache, artifact, controlli e costi. |
| 6 | EAT-014, piattaforme cloud | Railway e Cloudflare: ambienti, configurazioni, DNS/TLS, deploy, rollback e separazione staging/produzione. |
| 7 | EAT-015, operazioni | Osservabilità, incidenti, SLO, retention e recupero verificato. |
| Trasversale | EAT-019 | Lavorare con agenti mantenendo competenza, controllo del diff e responsabilità delle verifiche. |

Questo è l’ordine operativo proposto, non una cancellazione dei prerequisiti del grafo: quando un modulo richiede concetti applicativi, il corso li deve indicare e collegare. Git/GitHub includerà anche impostazioni dell’account, protezioni della repository, Copilot e Actions, con riferimenti correnti prima di descrivere opzioni o costi.

## Come decidiamo che una tranche è buona

Ogni lezione tratta un argomento riconoscibile e dichiara prerequisiti, outcome, esempio spiegato, errore atteso, esercizio senza LLM e fonti datate. Una tranche è tecnicamente verificabile quando link, gerarchia, rendering e prove passano; resta draft finché manca review tecnica e didattica del contenuto.

“Completo” significherà copertura del programma concordato, con esercizi e assessment che distinguono comprensione da esecuzione guidata. Non significherà garantire ogni futura opzione di ogni prodotto. I temi variabili — GUI, abbonamenti, sicurezza delle impostazioni, prezzi e versioni — richiedono aggiornamento delle fonti nella tranche che li tratta.

## Verifiche di questa tranche

I controlli coprono gerarchia e confini del contenuto, provenance storico, generazione deterministica, laboratorio offline, reader e navigazione. Il parser condiviso verifica 29 documenti. Le prove Chromium includono matrici e formule allineate, callout, codice lungo e HTML mostrato come testo, temi chiaro/scuro, tastiera, persistenza e contrasto automatico. Le prove di rendering sintetiche non sono lezioni aggiunte al catalogo.

L’accesso al browser integrato non era disponibile: le prove sono eseguite con Chromium locale tramite Playwright. Non certificano tutti i browser o l’esecuzione manuale di ogni funzione di VS Code.

## Che cosa serve da te

L’export delle estensioni del profilo principale, con ID e versioni, e il nome del profilo. Per la lista testuale la CLI di VS Code documenta `--list-extensions`, `--show-versions` e `--profile`; la gestione Profiles permette un export selettivo. La guida personale inizierà dai dati forniti: nessuna estensione viene attribuita al tuo profilo basandosi soltanto su un’icona.

I dati di consultazione e gli hash dei file remoti sono conservati localmente sotto `.work/source-review-2026-09-08/`; non sono dipendenze runtime e non vengono pubblicati. Il frontend precedente resta non committato con il suo confronto visuale formale ancora aperto. Questa tranche non esegue push, deploy o modifiche a GitHub.
