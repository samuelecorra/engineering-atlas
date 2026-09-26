# Lab — Prendere il controllo del workbench

## Obiettivo

Distinguere stato della GUI, posizione dei file e configurazione effettiva. Produrre una diagnosi breve e due richieste verificabili, senza usare un agente al posto del ragionamento personale.

## Setup e sicurezza

Lavora in una nuova cartella sotto `.lab-runs/`, creata appositamente per questa prova. Copia lì i due file della fixture tramite Explorer. Apri soltanto quella cartella in una nuova finestra VS Code. Non modificare il profilo principale e non avviare sincronizzazione, account o servizi remoti.

## Fixture locale

`fixtures/workbench-note.md` contiene una parola riconoscibile e una riga lunga. `fixtures/settings-example.jsonc` è un esempio sintetico, non una configurazione personale da importare. I file non eseguono codice. Nessun contenuto dei repository accademico e IronMath è copiato nella fixture.

Per preparare automaticamente la cartella puoi eseguire dalla root di Atlas:

```bash
node curriculum/courses/EAT-021-visual-studio-code/modules/EAT-021-M01-workbench-e-controllo/fixtures/run.mjs
```

Il comando stampa il percorso della copia isolata da aprire in VS Code. Con `--verify` controlla i materiali e rimuove soltanto la propria copia temporanea. Questo controllo automatico non verifica le tue azioni nella GUI: la prova personale e la nota restano necessarie.

## Passi

1. Apri la copia di `workbench-note.md`. Identifica editor, barre laterali, Panel e Status Bar.
2. Cerca la parola indicata nel file e poi nel workspace. Spiega la differenza fra le due ricerche.
3. Crea `notes` nella copia del lab e sposta il documento. Ritrovalo senza ricreare il vecchio percorso.
4. In Settings, scheda Workspace della sola copia del lab, confronta word wrap generale e override Markdown. Predici il risultato su Markdown e Plain Text prima di osservarlo.
5. Ripristina le impostazioni introdotte, poi scrivi un prompt di sola diagnosi e uno di modifica locale per lo stesso problema.

## Acceptance criteria

La nota identifica la cartella corretta e il nuovo percorso del documento. Il contenuto originario non è perso. La prova di configurazione distingue linguaggio, scope e valore effettivo. I prompt contengono un criterio verificabile e azioni consentite. Il ripristino riguarda soltanto il lab.

## Diagnosi di errori attesi

Una vecchia scheda può puntare a un percorso superato. Un override Markdown può non influenzare un documento riconosciuto come testo semplice. Una ricerca filtrata può non trovare un file esistente. Per ciascun caso identifica la prova che discrimina le cause.

## Recovery/rollback

Nella copia del lab rimetti il documento nella posizione iniziale. Rimuovi soltanto gli override che hai introdotto nelle impostazioni del workspace didattico. Riapri i documenti di confronto per verificare il risultato.

## Cleanup sicuro

Chiudi la finestra didattica dopo aver conservato la nota. Se elimini i file dell’esercizio, seleziona dalla GUI soltanto la directory del lab creata in questa sessione. Non usare comandi di pulizia ricorsiva su directory parent.

## Evidenza da conservare

Nota sintetica con osservazione iniziale, ipotesi, azione, risultato e recupero. Per i prompt conserva entrambe le versioni scritte da te. Non includere percorsi personali completi o contenuti delle impostazioni reali.

## Riflessione senza LLM

Quale passaggio hai eseguito per abitudine senza saperne prevedere l’effetto? Quale controllo ti avrebbe impedito di intervenire sulla cartella sbagliata? Ripeti quel passaggio spiegando il risultato atteso prima di agire.

## Review opzionale con agente

Solo dopo il tentativo personale, puoi chiedere una critica della nota anonimizzata: l’agente deve evidenziare prove mancanti e domande, senza eseguire il lab e senza attribuire mastery.
