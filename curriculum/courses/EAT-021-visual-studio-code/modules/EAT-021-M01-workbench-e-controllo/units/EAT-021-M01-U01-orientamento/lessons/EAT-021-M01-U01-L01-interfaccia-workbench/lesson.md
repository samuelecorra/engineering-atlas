# Le aree dell’interfaccia e l’Activity Bar

## Perché questa skill serve

Quando una finestra mostra Explorer a sinistra, una chat a destra, un file al centro e un errore nel terminale, non stai osservando quattro versioni dello stesso stato. Stai osservando strumenti diversi che interrogano file, processi e sessioni. Sapere quale strumento risponde alla tua domanda evita di cercare un problema di npm nelle impostazioni dell’editor.

Questa lezione costruisce una mappa del workbench. Le lezioni successive approfondiranno le singole funzioni: riconoscere una vista non equivale ancora a saper gestire un conflitto Git o una sessione di debug.

## Outcome osservabili

Al termine sai localizzare editor, barre laterali, Activity Bar, Panel e Status Bar; scegliere dove cercare un file, un errore o una modifica; riaprire una vista nascosta senza reinstallare estensioni. Devi riuscirci anche con un layout diverso da quello dello screenshot.

## Prerequisiti

VS Code aperto e una cartella didattica locale. Riferimento rilevato su questo Mac: VS Code **1.136.1**. I nomi dei comandi sono riportati in inglese per renderli ricercabili; la lingua della GUI e le scorciatoie personalizzate possono differire. Non serve un abbonamento AI per questo esercizio.

## Modello mentale

Il workbench è il contenitore. Una **vista** mostra informazioni o controlli; un **contenitore di viste** le raggruppa. Cliccare un’icona nell’Activity Bar seleziona quel contenitore: non significa eseguire automaticamente una build o un test.

| Area | Domanda alla quale risponde |
| --- | --- |
| Editor | Quale documento sto leggendo o modificando? |
| Primary Side Bar | Quali file, risultati o controlli sto esplorando? |
| Secondary Side Bar | Quale strumento voglio affiancare al documento, per esempio una chat? |
| Activity Bar | Quale insieme di viste voglio aprire? |
| Panel | Quale processo, diagnostica o console voglio osservare? |
| Status Bar | Qual è il contesto corrente del file o del progetto? |

Questa distinzione resta valida spostando una barra. Un terminale trascinato in un’altra posizione è sempre un terminale. La documentazione descrive le aree e la loro disposizione nella [guida all’interfaccia](https://code.visualstudio.com/docs/editing/getting-started/userinterface).

## Concetti e comandi essenziali

### Leggere l’Activity Bar

**Explorer** permette di navigare la cartella aperta. Una scheda dell’editor può restare aperta anche dopo che il file è stato spostato: per trovare il documento corrente torna all’albero o alla ricerca rapida.

**Search** cerca testo nel workspace. Va distinto dalla ricerca nel solo documento e dall’apertura per nome di un file. Prima di sostituire più risultati, controlla quali file sono inclusi. Un risultato assente può dipendere dai filtri, non dall’assenza del testo. Le operazioni di ricerca ed editing sono trattate nella [guida all’editing](https://code.visualstudio.com/docs/editing/codebasics).

**Source Control** espone lo stato di Git e le operazioni disponibili. Aprire un diff consente di ispezionare una modifica; salvarla, metterla in staging, committarla e pubblicarla sono passaggi distinti. Il numero mostrato su un’icona non è un voto alla qualità del repository. Prima di intervenire identifica repository e branch. Vedi la [panoramica Source Control](https://code.visualstudio.com/docs/sourcecontrol/overview).

**Run and Debug** riguarda l’esecuzione sotto debugger: breakpoint, stack delle chiamate e variabili aiutano a osservare cosa fa il programma. Il triangolo di esecuzione non garantisce di avviare la configurazione che avevi in mente: controlla il target selezionato. La [guida al debugger](https://code.visualstudio.com/docs/debugtest/debugging) separa avvio, configurazione e osservazione.

**Extensions** è la vista per cercare e gestire estensioni. Un nome simile non prova che due estensioni abbiano lo stesso publisher. Prima di installare, leggi ID, autore, funzione e documentazione. Un’estensione può contribuire altre viste e comandi; per questo non esiste una lista immutabile di tutte le icone a sinistra. Vedi [Extension Marketplace](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace).

**Testing**, strumenti per container o database e pannelli degli agenti dipendono dalle funzionalità e dalle estensioni disponibili. In questo corso la guida al tuo profilo verrà costruita sull’export, non dedotta dal disegno delle icone.

### Menu, comandi e focus

Su macOS trovi i menu dell’app nella barra del sistema: File, Edit, Selection, View, Go, Run, Terminal, Window e Help. Servono rispettivamente a gestire documenti, modifica e selezione, layout, navigazione, esecuzione, terminali, finestre e assistenza. Su Windows/Linux la collocazione visiva può cambiare.

La **Command Palette** offre un accesso per nome ai comandi: normalmente `Cmd+Shift+P` su macOS e `Ctrl+Shift+P` su Windows/Linux. Cerca l’azione, leggi il nome completo e controlla dove si trova il focus prima di confermare. Le scorciatoie sono acceleratori, non la definizione del comportamento.

Il menu contestuale di una vista consente operazioni diverse da quello di un file. Per recuperare una disposizione confusa, la [guida al layout](https://code.visualstudio.com/docs/configure/custom-layout) documenta spostamento, visibilità e ripristino delle viste. Prima annota le personalizzazioni che vuoi conservare.

## Esempio svolto

Supponi di vedere una lezione nell’editor, una chat a destra e `Missing script: "dev"` nel terminale.

1. Leggi il messaggio nella scheda **Terminal**, perché è output del processo npm.
2. Identifica la cartella dalla quale è stato lanciato il comando.
3. Apri il `package.json` di quella cartella in **Explorer**.
4. Leggi `scripts`: il nome del comando deve esistere lì.
5. Usa **Source Control** solo per capire se qualcuno ha modificato quel manifest.

Hai seguito una relazione causale: comando → directory → manifest. Aprire o chiudere la chat non può aggiungere uno script mancante.

## Failure mode e recovery

| Sintomo | Prima verifica | Recupero delimitato |
| --- | --- | --- |
| Una vista è sparita | È nascosta o spostata? | Riaprila tramite View o Command Palette. |
| Un tasto produce un’azione inattesa | Quale elemento ha il focus? | Riporta il focus sul bersaglio e cerca il comando per nome. |
| Source Control mostra un altro progetto | Quale repository è selezionato? | Seleziona il repository corretto prima di operare. |
| Un’icona non esiste nella tua installazione | È una funzione base o un contributo di estensione? | Verifica ID e versione; evita installazioni casuali. |

## Collegamenti a IronMath

IronMath contiene componenti distinti: `apps/web`, `apps/api` e il servizio Python. La prima abilità trasferibile consiste nel sapere quale file e quale processo stai osservando. Un errore del frontend e un errore del backend possono comparire nella stessa finestra, ma richiedono diagnosi diverse.

Questa lezione non avvia quei servizi e non modifica IronMath. Usa una cartella didattica per esercitare la navigazione.

## Esercizio senza LLM

Apri il file `workbench-note.md` della fixture in una copia locale del lab. Trova una parola nel documento e poi nel workspace, apri un terminale, nascondi una barra laterale e recuperala. Scrivi per ogni azione: area usata, cosa è cambiato e cosa hai osservato. Non basta elencare le icone: devi motivare perché hai scelto quella vista.

## Domande di autoverifica

Perché chiudere una scheda non elimina necessariamente il file? Qual è la differenza fra spostare il Panel e cambiare il processo che ci gira dentro? Come distingui una vista integrata da una fornita da un’estensione? Dove cerchi la causa di uno script npm assente?

## Glossario

**Workbench**: insieme delle superfici dell’editor. **Vista**: componente che presenta dati o controlli. **Focus**: elemento che riceve l’input da tastiera. **Diff**: confronto tra versioni. **Workspace**: cartelle aperte nel contesto della finestra.

## Fonti e versioni

Documentazioni primarie Microsoft collegate nei paragrafi, consultate l’8 settembre 2026. Versione installata rilevata dal manifest dell’app: 1.136.1; questa lettura non certifica l’esecuzione manuale di ogni comando della GUI. Le scorciatoie indicate sono quelle predefinite e vanno confrontate con il proprio profilo. Testo originale Atlas, stato draft.
