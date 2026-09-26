# Workspace, percorsi e file che non si aprono

## Perché questa skill serve

Un editor può ricordare un percorso che non esiste più. Un terminale può trovarsi in una cartella diversa da quella del documento aperto. Un workspace può contenere più repository indipendenti. Questi casi sembrano guasti dell’IDE finché non separi i tre concetti: posizione dei file, contesto della finestra e directory del processo.

L’obiettivo è verificare la realtà prima di creare file sostitutivi o rilanciare installazioni.

## Outcome osservabili

Sai distinguere file singolo, cartella e workspace multi-root; verificare la directory corrente; ritrovare un documento spostato; spiegare perché un comando funziona da una directory e non da un’altra. Sai dire quale dato manca alla diagnosi.

## Prerequisiti

Aver letto la lezione sull’interfaccia. Per gli esercizi usa soltanto una copia della fixture. I comandi mostrati non richiedono accesso a GitHub, account cloud o credenziali.

## Modello mentale

Il **filesystem** contiene directory e file. VS Code costruisce una vista di quei file e conserva alcuni elementi della sessione. Il **terminale** esegue una shell con una propria directory corrente, chiamata cwd. Il **repository Git** aggiunge cronologia e stato di versionamento; non coincide automaticamente con ogni cartella visibile.

Esempio autoriale:

```text
cartella-di-lavoro/
  progetto-a/
    package.json
    src/
  progetto-b/
    README.md
```

Aprire `progetto-a/src/` significa dare alla finestra un contesto più ristretto che aprire `progetto-a/`. Nessuna delle due operazioni implica che un terminale preesistente abbia cambiato cwd. Prima di trarre conclusioni, osserva entrambi.

## Concetti e comandi essenziali

### File, cartella e multi-root

Una finestra può aprire un singolo file senza un workspace. Aprire una cartella crea invece il contesto per impostazioni e strumenti del progetto. Un workspace multi-root raggruppa più cartelle; il file `.code-workspace` ne descrive la composizione. Questo raggruppamento non fonde le cronologie Git. La [guida ai workspace](https://code.visualstudio.com/docs/editing/workspaces/workspaces) descrive questi casi.

Per uno studio iniziale apri una sola cartella. Potrai passare al multi-root quando sai già rispondere a «quale progetto riceve questa impostazione o questo comando?».

### Una scheda non è una prova di esistenza

Se un file è stato spostato, la vecchia scheda può mostrare un errore. **Create File** creerebbe un file nel percorso precedente: sarebbe corretto soltanto se vuoi davvero quel nuovo file. Non ricostruire un inventario storico partendo da una scheda vuota.

La ricerca rapida dei file e la ricerca nel contenuto hanno scopi distinti. Per identificare il documento cerca prima il nome, poi conferma il percorso; per un risultato assente controlla anche include/exclude. Vedi [navigazione del codice](https://code.visualstudio.com/docs/editing/editingevolved).

### Osservare la directory del comando

In una shell POSIX:

```bash
pwd
```

In PowerShell:

```powershell
Get-Location
```

Questi comandi mostrano il contesto del processo. Non modificano i file. Se annoti l’output per una review, usa un percorso relativo o anonimizzato quando il percorso completo contiene dati personali.

Per un progetto npm, eseguire il comando seguente elenca gli script dichiarati:

```bash
npm run
```

Leggi il manifest della stessa directory. Un workspace npm può offrire script nel package figlio mentre la root offre un nome diverso. Questo non autorizza a inventare `npm run start`, `npm run dev` o un comando di deploy. Il comportamento è documentato da [npm run](https://docs.npmjs.com/cli/v11/commands/npm-run/).

### Trust e contesto remoto

VS Code distingue anche cartelle considerate affidabili e modalità con funzionalità limitate. Se task o estensioni non si attivano, considera [Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust). Non risolvere una limitazione dichiarando affidabile qualunque materiale scaricato: prima identifica l’origine e cosa potrebbe eseguire.

In una finestra remota, file e terminali possono appartenere a un’altra macchina. Il fatto di vedere la stessa GUI non rende locale il processo. La configurazione di questi ambienti è rinviata al modulo dedicato; qui basta riconoscere l’incertezza e fermare una diagnosi basata sul computer sbagliato.

## Esempio svolto

Nel progetto Atlas gli artifact iniziali sono stati archiviati in:

```text
sources/audits/2026-09-05-initial/
  audit.md
  course-dag.v0.1.json
  source-inventory.csv.gz
  manifest.json
```

La vecchia scheda `engineering-atlas-source-inventory.csv` punta quindi a un percorso superato. Il manifest permette di verificare dove si trova l’originale e quale hash deve avere. Non serve creare un CSV vuoto.

Nel frontend Atlas il comando documentato è:

```bash
npm run dev:web
```

La tranche dell’8 settembre aggiunge anche `npm run dev` come alias. L’esempio insegna però a leggere `package.json`: un alias presente oggi può non esistere in un altro repository o in una revisione precedente.

La diagnosi completa è: artefatto spostato nel caso del file; script assente nel manifest allora in uso nel caso di npm. Sono due problemi indipendenti, pur comparendo nello stesso screenshot.

## Failure mode e recovery

- **File assente**: cerca la destinazione documentata e controlla la cronologia dello spostamento. Evita di sovrascrivere la nuova copia.
- **Script assente**: verifica cwd e `scripts`, poi usa il comando realmente dichiarato. Una reinstallazione non aggiunge automaticamente uno script mancante.
- **Risultato di ricerca assente**: riduci i filtri e verifica la cartella aperta. L’assenza di un risultato filtrato non prova l’assenza del file.
- **Più repository nella finestra**: identifica il bersaglio prima di staging o commit. Il recupero iniziale può essere semplicemente aprire una finestra con una sola cartella.

## Collegamenti a IronMath

Il workflow `core-bundle-ci.yml` cambia directory per installare e verificare componenti diversi. Leggere `working-directory` insieme a `run` è l’equivalente della diagnosi cwd → manifest: lo stesso `npm ci` può riguardare package differenti. Il riferimento è [IronMath al commit 57b81c9](https://github.com/samuelecorra/ironmath/blob/57b81c9aa4f203195224169127b46e54493088e1/.github/workflows/core-bundle-ci.yml). La lettura del file non implica che quel workflow sia stato eseguito in questa lezione.

## Esercizio senza LLM

Nella sola copia della fixture apri `workbench-note.md`, spostalo in una sottocartella `notes`, poi prova a raggiungerlo dalla vecchia scheda. Ritrovalo senza ricrearlo. Annota percorso vecchio, nuovo e prova usata per distinguere spostamento e perdita del contenuto. Ripristina la struttura iniziale con l’operazione inversa nella copia del lab.

## Domande di autoverifica

Un terminale segue sempre la scheda attiva? Due cartelle nello stesso workspace sono un unico repository? Perché reinstallare le dipendenze non è la prima risposta a `Missing script`? Quale prova distingue un file archiviato da un file perso?

## Glossario

**cwd**: directory corrente del processo. **Root**: directory scelta come radice di un progetto o di una vista. **Multi-root**: workspace con più cartelle. **Manifest**: file che dichiara proprietà e operazioni di un package. **Alias**: nome alternativo che inoltra a un’operazione già definita.

## Fonti e versioni

Documentazione VS Code e npm v11 collegata nei paragrafi, consultata l’8 settembre 2026. Ambiente rilevato: VS Code 1.136.1, Node 24.14.1; i comandi PowerShell sono equivalenze documentate, non un test su Windows. Esempi Atlas verificabili nel repository corrente; caso IronMath fissato al commit indicato. Testo originale, draft.
