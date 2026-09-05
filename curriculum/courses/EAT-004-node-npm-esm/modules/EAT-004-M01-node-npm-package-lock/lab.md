# Lab — EAT-004-M01

## Obiettivo

Installare e testare un package ESM senza dipendenze esterne, osservando manifest e lock prima e dopo un cambio di versione del package.

## Setup e sicurezza

Dalla root di Atlas, con Node 24 e gli strumenti indicati nella [lesson](lesson.md):

```text
node curriculum/courses/EAT-004-node-npm-esm/modules/EAT-004-M01-node-npm-package-lock/fixtures/run.mjs
```

Il comando crea un workspace nuovo e ne stampa il path relativo. Non esegue il task al posto tuo. Lavora soltanto in quel path; i sorgenti sotto curriculum restano invariati. Nessun secret, dato personale, account o servizio di prodotto. Le scritture sono confinate al workspace con marker; l’orientamento del primo lab è read-only dopo il setup.

## Fixture locale

`package.json`, `package-lock.json`, `sum.mjs` e `sum.test.mjs` formano il package locale. Non ci sono dependencies/devDependencies esterne. Il test verifica casi numerici con segno, insieme vuoto e rifiuto di stringhe.

Il runner versione `--verify` è una verifica automatica di manutenzione in una copia separata; leggine il codice soltanto dopo il tentativo personale. Non è l’evidenza del tuo assessment.

## Passi

1. Entra nella sottocartella `fixture`. Registra `node --version` e `npm --version`. Leggi engines, type e scripts, poi il piccolo test.
2. Conserva una copia testuale del manifest e lock come evidenza nella sola directory assegnata. Predici quali file può cambiare ci.
3. Esegui `npm ci --offline --ignore-scripts --no-audit --no-fund` e `npm test`. Confronta il lock con la copia: deve essere invariato.
4. Cambia soltanto la versione del package root da 1.0.0 a 1.0.1 in package.json. Non aggiungere librerie. Esegui `npm install --package-lock-only --offline --ignore-scripts --no-audit --no-fund` e rileggi il lock.
5. Dimostra che la versione root è aggiornata e che la mappa packages contiene solo il package corrente. Esegui di nuovo ci e test; non attribuire una risoluzione di dipendenze esterne a un lab che non ne contiene.
6. In una nota, distingui il range dichiarato dal lock, spiega perché engines da solo può dare solo warning e descrivi cosa controllare prima di un update reale. Leggi opzionalmente i tre manifest IronMath come anchor, senza eseguirli.

## Acceptance criteria

Test effettivo verde, lock invariato dopo ci, lock aggiornato dopo modifica intenzionale e install package-lock-only, nessuna dipendenza aggiunta. Spiegazione corretta di runtime browser/Node, script, semver e package indipendenti.

## Diagnosi di errori attesi

Runtime major diverso: fermati e registra il mismatch. Test non trovato: controlla cwd e script. ERR_MODULE_NOT_FOUND: verifica il path e l’estensione prima di installare package. La sola variazione di version root non dimostra un errore di ci per mismatch di dipendenze.

## Recovery/rollback

I file originari sono ancora nelle fixtures versionate; conserva il diff del tuo tentativo e ricrea una copia. Non cancellare il lock di Atlas né eseguire audit fix o update automatici. L’eventuale node_modules della copia è generato e verrà rimosso solo con quel workspace.

## Cleanup sicuro

Prima conserva gli artifact sanitizzati del tentativo in una destinazione personale scelta consapevolmente; Atlas non ne crea una. Torna alla root di Atlas e passa il path esatto stampato dal setup, fra virgolette, a:

```text
node scripts/lab-workspace.mjs cleanup ".lab-runs/lab-NOME-ID"
```

Sostituisci NOME-ID con il nome effettivo. Il comando accetta soltanto una directory immediatamente sotto `.lab-runs`, con prefisso lab e marker Atlas. Non usare wildcard o path del prodotto. Questa rimozione è volontaria e riguarda tutta la copia temporanea: prima verifica di aver conservato le evidenze che desideri.

## Evidenza da conservare

- Output del test e confronto manifest/lockfile prima e dopo il cambio di versione.
- Spiegazione di npm ci, semver e package indipendenti.

Registra data, versioni, tentativo e hint usati. Non conservare environment completo, path personali o identità reali.

## Riflessione senza LLM

Quale differenza stai misurando con il cambio patch della root e quale non stai misurando? Perché il successo offline di questo package non promette che IronMath si installi da una cache vuota?

## Review opzionale con agente

Solo dopo il tuo tentativo, consegna diff e diagnosi sanitizzati. Chiedi al reviewer di controllare i criteri dell’[assessment](assessment.md), di distinguere ciò che hai spiegato da ciò che ha suggerito e di proporre un solo caso aggiuntivo. Il reviewer non aggiorna automaticamente la mastery.
