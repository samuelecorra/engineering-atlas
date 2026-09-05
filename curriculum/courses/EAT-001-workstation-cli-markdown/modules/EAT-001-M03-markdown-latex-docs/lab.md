# Lab — EAT-001-M03

## Obiettivo

Correggere un mini documento con gerarchia, link e delimitatori matematici errati, lasciando intatto il significato della media.

## Setup e sicurezza

Dalla root di Atlas, con Node 24 e gli strumenti indicati nella [lesson](units/EAT-001-M03-U01-fondamenti/lessons/EAT-001-M03-U01-L01-markdown-latex-docs/lesson.md):

```text
node curriculum/courses/EAT-001-workstation-cli-markdown/modules/EAT-001-M03-markdown-latex-docs/fixtures/run.mjs
```

Il comando crea un workspace nuovo e ne stampa il path relativo. Non esegue il task al posto tuo. Lavora soltanto in quel path; i sorgenti sotto curriculum restano invariati. Nessun secret, dato personale, account o servizio di prodotto. Le scritture sono confinate al workspace con marker; l’orientamento del primo lab è read-only dopo il setup.

## Fixture locale

`broken-document.txt` è il sorgente difettoso preservato. Il setup ne crea una copia `document.md` nel workspace temporaneo. `reference.txt` è il target locale disponibile. `check.mjs` contiene un checker delimitato alla struttura di questo esercizio, non un parser generale.

Il runner versione `--verify` è una verifica automatica di manutenzione in una copia separata; leggine il codice soltanto dopo il tentativo personale. Non è l’evidenza del tuo assessment.

## Passi

1. Entra nella sottocartella `fixture`, leggi `document.md` come testo e annota i difetti prima di lanciare il checker.
2. Esegui `node check.mjs document.md`: conserva la diagnostica iniziale. Il fallimento è previsto.
3. Correggi i livelli degli heading senza introdurre sezioni vuote. Correggi il link verso il file esistente, mantenendo un path relativo e il case corretto.
4. Rendi coerenti i delimitatori della formula inline e di quella block senza cambiare i simboli matematici. Il block deve avere apertura e chiusura su righe proprie.
5. Riesegui il checker. Se hai una preview locale, osserva separatamente Markdown e matematica: se il viewer non supporta KaTeX, registra il limite senza installare un sito.
6. Spiega perché il sorgente difettoso va conservato come fixture del test, mentre il documento corretto è l'artifact del tuo tentativo. Non modificare report generated per correggere una fonte canonica.

## Acceptance criteria

Il checker iniziale fallisce e quello finale passa; la gerarchia non salta livelli, il link risolve e i delimitatori sono accoppiati. La formula resta semanticamente equivalente. La nota finale distingue testuale e visuale, senza dichiarare un rendering mai osservato.

## Diagnosi di errori attesi

Il checker produce quattro categorie: heading, link, block e inline. Correggere solo il numero di dollari può ancora lasciare una formula semanticamente errata: il reviewer deve leggerla. Un viewer senza estensione matematica può mostrare i delimitatori letterali.

## Recovery/rollback

Conserva il diff con `broken-document.txt`. Se necessario, ricrea un workspace per tornare al dato iniziale. Non creare file vuoti per soddisfare il link e non cambiare il checker per tollerare l’errore.

## Cleanup sicuro

Prima conserva gli artifact sanitizzati del tentativo in una destinazione personale scelta consapevolmente; Atlas non ne crea una. Torna alla root di Atlas e passa il path esatto stampato dal setup, fra virgolette, a:

```text
node scripts/lab-workspace.mjs cleanup ".lab-runs/lab-NOME-ID"
```

Sostituisci NOME-ID con il nome effettivo. Il comando accetta soltanto una directory immediatamente sotto `.lab-runs`, con prefisso lab e marker Atlas. Non usare wildcard o path del prodotto. Questa rimozione è volontaria e riguarda tutta la copia temporanea: prima verifica di aver conservato le evidenze che desideri.

## Evidenza da conservare

- Documento corretto e output del checker locale.
- Nota che distingue sorgente matematica, Markdown e renderer.

Registra data, versioni, tentativo e hint usati. Non conservare environment completo, path personali o identità reali.

## Riflessione senza LLM

Quali errori sono rilevabili senza renderer e quali richiedono una preview? Perché il successo del checker specifico non certifica tutto CommonMark o tutto LaTeX?

## Review opzionale con agente

Solo dopo il tuo tentativo, consegna diff e diagnosi sanitizzati. Chiedi al reviewer di controllare i criteri dell’[assessment](assessment.md), di distinguere ciò che hai spiegato da ciò che ha suggerito e di proporre un solo caso aggiuntivo. Il reviewer non aggiorna automaticamente la mastery.
