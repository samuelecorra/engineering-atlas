# EAT-004-M01 — Node runtime/process/fs/path, npm, package e lockfile

Stato: draft. Contenuto autoriale; nessuna mastery personale attribuita.

## Perché questa skill serve

Una modifica JavaScript può funzionare nel browser ma fallire nel launcher Node; un'installazione apparentemente equivalente può risolvere versioni diverse. Il ponte operativo è leggere il contratto del package e ricostruire l'ambiente senza confondere sorgente, dipendenze e output generato. IronMath viene usato come indice di lettura di manifest indipendenti.

## Outcome osservabili

- Eseguire un package ESM senza dipendenze e spiegare manifest e lockfile.
- Distinguere npm install da npm ci e motivare la riproducibilità senza upgrade ciechi.

## Prerequisiti

Il corso EAT-004 richiede EAT-003: semantica JavaScript, funzioni e moduli. Il lab usa una funzione minima per concentrare l'attenzione sull'ambiente. Servono Node 24 e npm 11. Non serve installare dipendenze esterne.

## Modello mentale

Node esegue JavaScript fuori dal browser. Condivide il linguaggio, ma offre API di processo e filesystem e non dispone automaticamente di `window` o `document`. La presenza di alcune API comuni, come fetch, non rende identici i runtime. In Node, `process.cwd()` legge la working directory, `path.resolve()` costruisce un path assoluto rispetto a essa e `fs.readFileSync()` legge dal filesystem: sono le operazioni usate nella fixture di EAT-001. L’import da `node:fs` o `node:path` indica una API built-in, non una dipendenza da installare con npm.

`package.json` descrive identità, versione, script e dipendenze dichiarate. `package-lock.json` registra la risoluzione installabile secondo npm, comprese versioni e integrità quando esistono package esterni. `node_modules` è un risultato generato, non la fonte da editare o versionare.

La determinazione dell'installazione dipende anche da runtime, versione npm, piattaforma, flag e disponibilità degli artifact. Un lockfile migliora la riproducibilità, ma non è una prova universale di identico comportamento o di sicurezza del codice installato.

## Concetti e comandi essenziali

`type: "module"` rende ESM i file `.js` nel package; `.mjs` è esplicitamente ESM. L'import relativo Node richiede percorsi/estensioni coerenti; un alias Vite non è automaticamente compreso da Node. La resolution completa verrà approfondita nel modulo ESM.

`dependencies` indica package necessari al runtime dichiarato; `devDependencies` include tool di test/build. La distinzione non significa che le devDependencies non possano eseguire codice durante build o installazione. `scripts` definisce comandi richiamati con `npm run nome`; `npm test` è una scorciatoia per lo script test. `engines` dichiara le versioni attese, ma da solo npm può limitarsi a un warning: Atlas controlla anche la major Node nei CLI.

| Operazione | Effetto atteso |
| --- | --- |
| `npm install` | Risolve/installazione secondo manifest e lock; può aggiornare il lock quando necessario |
| `npm ci` | Richiede lock coerente; ricrea l'albero di installazione e non aggiorna manifest/lock |
| `npm install --package-lock-only` | Aggiorna il lock senza una normale installazione di node_modules |
| `npm test` | Esegue lo script test del package corrente |

`npm ci` può rimuovere l'albero `node_modules` esistente: eseguilo nella fixture corretta. Se manifest e risoluzione delle dipendenze non concordano, correggi il contratto con intenzione; non cancellare il lock per aggirare il problema. Cambiare soltanto la versione del package root non è un esperimento sufficiente per dimostrare che ogni mismatch causa un errore di ci: il lab osserva i file, senza promettere quel comportamento.

SemVer usa `major.minor.patch`: major per incompatibilità dichiarate, minor per funzionalità compatibili, patch per correzioni compatibili. È una convenzione del produttore, non una garanzia del test. Esempi stabili: `1.2.3` è una versione esatta; `~1.2.3` ammette aggiornamenti sotto 1.3.0; `^1.2.3` sotto 2.0.0; `^0.2.3` sotto 0.3.0. Le regole su zero e prerelease richiedono attenzione, non un'interpretazione “sempre l'ultima”.

Un audit segnala vulnerabilità note rispetto a fonti aggiornate: richiede dati disponibili e non dimostra sfruttabilità o assenza di rischi. Leggi reachability, runtime interessato e test prima di aggiornare. Non eseguire upgrade major o `audit fix --force` senza una review della modifica. Il lab offline non esegue un audit di vulnerabilità.

## Esempio svolto

La fixture contiene `sum.mjs`, un test standard-library, manifest e lock senza package esterni. Dalla sua directory:

```text
npm ci --offline --ignore-scripts --no-audit --no-fund
npm test
```

Il test verifica numeri con segno e rifiuta una stringa che potrebbe produrre concatenazione. `ci` non modifica il lock. Ora modifica soltanto `version` in `package.json` da 1.0.0 a 1.0.1, poi esegui `npm install --package-lock-only --offline --ignore-scripts --no-audit --no-fund`. Il lock riflette la nuova identità root; nessuna dipendenza è stata aggiunta. Rileggi il diff e ripeti test/ci.

Il runner automatico esegue lo stesso esperimento in una nuova copia. Il tuo assessment richiede la spiegazione dei file e dell'ordine, non soltanto il messaggio verde.

## Failure mode e recovery

`document is not defined`: stai usando un'API browser in Node, non manca necessariamente una dipendenza. `ERR_MODULE_NOT_FOUND`: controlla path, estensione e confine del package prima di installare librerie.

Lock incoerente: preserva il diff, verifica manifest e versione npm, rigenera intenzionalmente nella fixture e controlla le differenze. Un lock aggiornato non autorizza un upgrade indiscriminato. `EBADENGINE`: confronta `node --version` con il contratto; non ignorare il mismatch come se fosse irrilevante.

Una cache vuota impedisce installazioni offline con artifact esterni non disponibili. Questa fixture evita il problema usando zero dipendenze; non generalizzare l'esito a IronMath.

## Collegamenti a IronMath

Anchor di sola lettura nello snapshot IronMath dichiarato in `sources/repositories.json`: `package.json`, `apps/web/package.json`, `apps/api/package.json`. Non sono link locali né dipendenze del lab. Consulta la [mappa di lettura](../../../../../../../../../projects/ironmath-reading-map.md) per la domanda del macro-corso. Non aprire configurazioni riservate e non avviare servizi del prodotto.

## Esercizio senza LLM

Spiega prima quali file devono restare invariati dopo ci. Esegui il cambio patch del package e annota quali campi del lock cambiano. Leggi i manifest IronMath solo se disponibili e non sensibili: cerca `workspaces`, senza dedurre workspace dalla sola presenza di più cartelle.

## Domande di autoverifica

1. Perché `node_modules` non è una source of truth?
2. Che cosa distingue manifest e lockfile?
3. Perché `engines` e un test del runtime sono garanzie diverse?
4. Un range caret consente sempre il major successivo?
5. Perché audit e aggiornamento non sono lo stesso task?
6. Un monorepo deve essere necessariamente un workspace npm?

## Glossario

**Runtime**: ambiente di esecuzione. **Manifest**: dichiarazione del package. **Lockfile**: risoluzione registrata. **ESM**: sistema standard di moduli JavaScript. **SemVer**: convenzione di versionamento. **Workspace**: insieme di package coordinato dal package manager; distinto dalla sola coabitazione in un repository.

## Fonti e versioni

Fonti: [npm ci v11](https://docs.npmjs.com/cli/v11/commands/npm-ci/), [npm install v11](https://docs.npmjs.com/cli/v11/commands/npm-install/), [package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/), [Node packages](https://nodejs.org/docs/latest-v24.x/api/packages.html). Node 24.14.1, npm 11.11.0 nella verifica locale, data 2026-09-05. Nel baseline IronMath il root non dichiara workspaces e le applicazioni hanno lockfile propri; il curriculum usa un alias Vite.
