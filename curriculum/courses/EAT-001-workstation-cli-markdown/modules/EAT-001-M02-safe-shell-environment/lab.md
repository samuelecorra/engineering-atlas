# Lab — EAT-001-M02

## Obiettivo

Diagnosticare tre script innocui e correggere path, quoting ed environment nella sola copia temporanea.

## Setup e sicurezza

Dalla root di Atlas, con Node 24 e gli strumenti indicati nella [lesson](lesson.md):

```text
node curriculum/courses/EAT-001-workstation-cli-markdown/modules/EAT-001-M02-safe-shell-environment/fixtures/run.mjs
```

Il comando crea un workspace nuovo e ne stampa il path relativo. Non esegue il task al posto tuo. Lavora soltanto in quel path; i sorgenti sotto curriculum restano invariati. Nessun secret, dato personale, account o servizio di prodotto. Le scritture sono confinate al workspace con marker; l’orientamento del primo lab è read-only dopo il setup.

## Fixture locale

`01-path.*.txt`, `02-quote.*.txt` e `03-env.*.txt` rappresentano tre difetti, ciascuno in versione Bash e PowerShell. Sono testo da leggere e non vengono lanciati automaticamente. `read.mjs` richiede un solo argomento; `check-env.mjs` verifica soltanto ATLAS_DEMO_MODE.

Il runner versione `--verify` è una verifica automatica di manutenzione in una copia separata; leggine il codice soltanto dopo il tentativo personale. Non è l’evidenza del tuo assessment.

## Passi

1. Entra nella sottocartella `fixture`. Apri i tre file della shell disponibile, poi leggi i due piccoli programmi Node che verranno avviati.
2. Senza eseguire, annota quale script dovrebbe produrre un errore di path, quale di numero di argomenti e quale di environment. Conta gli argomenti consegnati a Node.
3. Rimuovi dalla sola sessione l'eventuale variabile innocua ATLAS_DEMO_MODE. Esegui manualmente le righe del primo e secondo script; conserva gli esiti senza usare redirection verso l'input.
4. Esegui le righe del terzo script. Se il risultato inatteso è già verde, verifica che non sia rimasta esportata la variabile da un tentativo precedente. Non stampare l'environment intero.
5. Correggi i tre file `.txt` nella copia e prova manualmente le righe corrette. Il primo e secondo devono leggere lo stesso dato innocuo; il terzo deve confermare la modalità pratica.
6. Scrivi la traduzione nell'altra shell e spiega la differenza fra variabile di sessione ed environment di processo. Se l'altra shell non è installata, etichetta la traduzione come review statica.
7. Descrivi dove finirebbero stdout e stderr con una redirection verso due file nuovi nella copia. Se la provi, verifica prima che i nomi non esistano e non siano input del comando.

## Acceptance criteria

Tutti e tre i difetti hanno una diagnosi distinta e una correzione verificata nella shell disponibile. Nessun dump di environment. Gli argomenti preservano gli spazi. La traduzione non attribuisce una prova di esecuzione alla shell non disponibile.

## Diagnosi di errori attesi

Il primo difetto produce ENOENT; il secondo segnala più di un argomento path; il terzo non trasmette correttamente la configurazione innocua al processo figlio. Una sessione contaminata da tentativi precedenti può mascherare il terzo errore.

## Recovery/rollback

Conserva il diff della copia. Rimuovi solo ATLAS_DEMO_MODE dalla sessione, oppure chiudila. Ricrea la fixture se non distingui più la versione iniziale da quella corretta; non ripristinare indiscriminatamente file Atlas.

## Cleanup sicuro

Prima conserva gli artifact sanitizzati del tentativo in una destinazione personale scelta consapevolmente; Atlas non ne crea una. Torna alla root di Atlas e passa il path esatto stampato dal setup, fra virgolette, a:

```text
node scripts/lab-workspace.mjs cleanup ".lab-runs/lab-NOME-ID"
```

Sostituisci NOME-ID con il nome effettivo. Il comando accetta soltanto una directory immediatamente sotto `.lab-runs`, con prefisso lab e marker Atlas. Non usare wildcard o path del prodotto. Questa rimozione è volontaria e riguarda tutta la copia temporanea: prima verifica di aver conservato le evidenze che desideri.

## Evidenza da conservare

- Diff dei tre script corretti nella copia della fixture.
- Spiegazione del numero di argomenti, del path risolto e della variabile innocua.

Registra data, versioni, tentativo e hint usati. Non conservare environment completo, path personali o identità reali.

## Riflessione senza LLM

Perché aggiungere apici è corretto per il secondo script ma non risolve da solo il primo? Quando un comando che legge un file può comunque distruggerlo attraverso la shell?

## Review opzionale con agente

Solo dopo il tuo tentativo, consegna diff e diagnosi sanitizzati. Chiedi al reviewer di controllare i criteri dell’[assessment](assessment.md), di distinguere ciò che hai spiegato da ciò che ha suggerito e di proporre un solo caso aggiuntivo. Il reviewer non aggiorna automaticamente la mastery.
