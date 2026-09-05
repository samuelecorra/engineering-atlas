# Lab — EAT-016-M01

## Obiettivo

Creare un venv, diagnosticare import path e testare una fixture Python con layout src senza rete o package applicativi.

## Setup e sicurezza

Dalla root di Atlas, con Node 24 e gli strumenti indicati nella [lesson](lesson.md):

```text
node curriculum/courses/EAT-016-python-fastapi/modules/EAT-016-M01-python-env-packaging/fixtures/run.mjs
```

Il comando crea un workspace nuovo e ne stampa il path relativo. Non esegue il task al posto tuo. Lavora soltanto in quel path; i sorgenti sotto curriculum restano invariati. Nessun secret, dato personale, account o servizio di prodotto. Le scritture sono confinate al workspace con marker; l’orientamento del primo lab è read-only dopo il setup.

## Fixture locale

Il setup copia `src/atlas_fixture/`, `tests/`, `run_tests.py`, requirements e pyproject, poi crea `.venv` usando l’interprete disponibile. La creazione usa venv/ensurepip locali. Il backend setuptools è dichiarato, ma non installato né necessario per il test diretto.

Il runner versione `--verify` è una verifica automatica di manutenzione in una copia separata; leggine il codice soltanto dopo il tentativo personale. Non è l’evidenza del tuo assessment.

## Passi

1. Entra nella sottocartella `fixture`. Il setup ha già creato il venv: spiega quale comando python -m venv rappresenta, senza crearne un secondo sopra il primo.
2. Usa direttamente l’interprete della fixture: `.venv/bin/python` su macOS/Linux oppure `.\.venv\Scripts\python.exe` su Windows. Registra --version e `-m pip --version`, sostituendo nell’evidenza i path personali con path relativi.
3. Se vuoi, attiva il venv con la sintassi della lesson, poi confronta il Python scelto. Se PowerShell blocca Activate.ps1, continua invocando l’eseguibile senza cambiare policy globale.
4. Predici e poi esegui `-I -c "import atlas_fixture"` dall'interprete del venv: il package non è installato e l’import deve fallire. Spiega perché non si tratta di un motivo per scaricare qualcosa.
5. Esegui `run_tests.py` con l’interprete del venv dalla directory fixture. Devono essere eseguiti due test. Leggi dove il runner inserisce src in sys.path e spiega il limite di questa tecnica.
6. Cambia cwd in `src` e avvia `-m atlas_fixture` con lo stesso interprete usando il path relativo aggiornato. Registra il risultato della media. Torna poi alla fixture.
7. Cambia nella sola copia un expected value del test per ottenere un fallimento reale, conserva l’esito, poi correggi quella singola modifica. Una suite che non esegue test non soddisfa il task.
8. Leggi requirements e pyproject. Spiega runtime/dev/build e quali risorse offline servirebbero per un’editable install. Non eseguire pip install -e in questa tranche: il test diretto del sorgente è esplicitamente distinto da una prova di installazione.

## Acceptance criteria

L’interprete appartiene al venv; pip è associato allo stesso ambiente; l’import isolato fallisce come previsto; unittest esegue due test con esito verde dopo un fallimento intenzionale; -m avvia il package dalla cwd documentata. Nessun download, FastAPI o chiamata provider.

## Diagnosi di errori attesi

venv/ensurepip non disponibili: il setup fallisce esplicitamente, senza fallback di rete. ModuleNotFoundError nell’invocazione isolata è atteso. Errore nel test corretto: verifica interprete e sorgente importato. Test count zero è un fallimento del lab anche con exit code zero.

## Recovery/rollback

Termina l’attivazione con deactivate se usata, conserva diff ed esiti e ricrea un nuovo workspace. Non spostare il venv tra sistemi e non disinstallare package globali. Una nuova esecuzione del setup crea un nome nuovo, senza sovrascrivere il tentativo precedente.

## Cleanup sicuro

Prima conserva gli artifact sanitizzati del tentativo in una destinazione personale scelta consapevolmente; Atlas non ne crea una. Torna alla root di Atlas e passa il path esatto stampato dal setup, fra virgolette, a:

```text
node scripts/lab-workspace.mjs cleanup ".lab-runs/lab-NOME-ID"
```

Sostituisci NOME-ID con il nome effettivo. Il comando accetta soltanto una directory immediatamente sotto `.lab-runs`, con prefisso lab e marker Atlas. Non usare wildcard o path del prodotto. Questa rimozione è volontaria e riguarda tutta la copia temporanea: prima verifica di aver conservato le evidenze che desideri.

## Evidenza da conservare

- Output del test standard-library e identificazione del Python nel venv.
- Diagnosi di un import fallito e schema dei file runtime, test e packaging.

Registra data, versioni, tentativo e hint usati. Non conservare environment completo, path personali o identità reali.

## Riflessione senza LLM

Perché questo lab prova il codice e l’isolamento, ma non una distribuzione installata? Quali prerequisiti di build servono prima di rendere offline un’editable install? Quali file devono restare fuori da Git?

## Review opzionale con agente

Solo dopo il tuo tentativo, consegna diff e diagnosi sanitizzati. Chiedi al reviewer di controllare i criteri dell’[assessment](assessment.md), di distinguere ciò che hai spiegato da ciò che ha suggerito e di proporre un solo caso aggiuntivo. Il reviewer non aggiorna automaticamente la mastery.
