# Lab — EAT-001-M01

## Obiettivo

Orientarti in una fixture senza modificare i dati e produrre una trascrizione che distingua esito normale e errore di path.

## Setup e sicurezza

Dalla root di Atlas, con Node 24 e gli strumenti indicati nella [lesson](lesson.md):

```text
node curriculum/courses/EAT-001-workstation-cli-markdown/modules/EAT-001-M01-filesystem-processes-paths/fixtures/run.mjs
```

Il comando crea un workspace nuovo e ne stampa il path relativo. Non esegue il task al posto tuo. Lavora soltanto in quel path; i sorgenti sotto curriculum restano invariati. Nessun secret, dato personale, account o servizio di prodotto. Le scritture sono confinate al workspace con marker; l’orientamento del primo lab è read-only dopo il setup.

## Fixture locale

La copia contiene `inspect.mjs`, `data/input.txt` e `process-port.mjs`. I dati sono sintetici. Il file di input ha tre righe. Il server opzionale ascolta solo su 127.0.0.1 e termina entro 45 secondi.

Il runner versione `--verify` è una verifica automatica di manutenzione in una copia separata; leggine il codice soltanto dopo il tentativo personale. Non è l’evidenza del tuo assessment.

## Passi

1. Entra nella sottocartella `fixture` del path stampato. Registra la cwd in forma relativa ad Atlas e la versione Node.
2. Elenca i file e leggi `data/input.txt` con il comando appropriato alla shell. Prima di ogni invocazione scrivi il path che verrà risolto.
3. Esegui `node inspect.mjs data/input.txt`. Annota stdout, stderr ed exit code; leggilo subito con `echo "$?"` in Bash oppure `$LASTEXITCODE` in PowerShell.
4. Esegui `node inspect.mjs missing.txt`. Registra lo stesso insieme di osservazioni. Spiega il significato di `ENOENT` senza creare il file mancante.
5. Torna alla directory superiore e invoca lo script con path `fixture/inspect.mjs`, prima con il path dato precedente e poi con quello risolto dalla nuova cwd. Predici i due esiti.
6. Dalla sottocartella `fixture`, avvia `node process-port.mjs`. In un secondo terminale associa la porta stampata al PID usando i comandi della lesson. Consulta solo il processo del lab; non memorizzare l'elenco di processi altrui. Attendi la chiusura automatica o Ctrl+C nel terminale proprietario.
7. Rileggi il dato: deve essere invariato. Scrivi una trascrizione sanitizzata con comandi, cwd, esiti e spiegazione.

## Acceptance criteria

Il dato mantiene tre righe e contenuto invariato; le due chiamate iniziali terminano con 0 e 2; stdout/stderr sono distinti; il path relativo viene spiegato da due cwd; PID e porta osservati appartengono al processo loopback del lab.

## Diagnosi di errori attesi

File mancante: ENOENT su stderr, senza output normale. Argomento omesso: messaggio esplicito e codice 2. Porta non più visibile dopo 45 secondi: il processo è terminato normalmente, non è un guasto da correggere con privilegi maggiori.

## Recovery/rollback

Il task di orientamento è read-only. Se hai scritto accidentalmente nella copia, conserva il confronto e crea una nuova fixture; non sovrascrivere i sorgenti versionati. Chiudi soltanto il processo avviato nel tuo terminale.

## Cleanup sicuro

Prima conserva gli artifact sanitizzati del tentativo in una destinazione personale scelta consapevolmente; Atlas non ne crea una. Torna alla root di Atlas e passa il path esatto stampato dal setup, fra virgolette, a:

```text
node scripts/lab-workspace.mjs cleanup ".lab-runs/lab-NOME-ID"
```

Sostituisci NOME-ID con il nome effettivo. Il comando accetta soltanto una directory immediatamente sotto `.lab-runs`, con prefisso lab e marker Atlas. Non usare wildcard o path del prodotto. Questa rimozione è volontaria e riguarda tutta la copia temporanea: prima verifica di aver conservato le evidenze che desideri.

## Evidenza da conservare

- Trascrizione sanitizzata con cwd, comando, stdout, stderr ed exit code.
- Tabella che collega PID, porta e processo locale senza terminare processi altrui.

Registra data, versioni, tentativo e hint usati. Non conservare environment completo, path personali o identità reali.

## Riflessione senza LLM

Spiega a parole come può partire lo script giusto ma essere letto il path sbagliato. Indica un caso in cui stderr ed exit code vadano interpretati separatamente.

## Review opzionale con agente

Solo dopo il tuo tentativo, consegna diff e diagnosi sanitizzati. Chiedi al reviewer di controllare i criteri dell’[assessment](assessment.md), di distinguere ciò che hai spiegato da ciò che ha suggerito e di proporre un solo caso aggiuntivo. Il reviewer non aggiorna automaticamente la mastery.
