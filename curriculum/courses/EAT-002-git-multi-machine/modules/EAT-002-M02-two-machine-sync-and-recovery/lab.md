# Lab — EAT-002-M02

## Obiettivo

Simulare Mac ↔ bare remote ↔ Windows e scegliere tre integrazioni a partire dalla divergenza, conservando commit e lavoro locale.

## Setup e sicurezza

Dalla root di Atlas, con Node 24 e gli strumenti indicati nella [lesson](units/EAT-002-M02-U01-fondamenti/lessons/EAT-002-M02-U01-L01-two-machine-sync-and-recovery/lesson.md):

```text
node curriculum/courses/EAT-002-git-multi-machine/modules/EAT-002-M02-two-machine-sync-and-recovery/fixtures/run.mjs
```

Il comando crea un workspace nuovo e ne stampa il path relativo. Non esegue il task al posto tuo. Lavora soltanto in quel path; i sorgenti sotto curriculum restano invariati. Nessun secret, dato personale, account o servizio di prodotto. Le scritture sono confinate al workspace con marker; l’orientamento del primo lab è read-only dopo il setup.

## Fixture locale

Il setup crea `fast-forward/`, `divergence/` e `conflict/`, ciascuno con `mac/`, `windows/` e `remote.git/`. I commit sono sintetici. Mac ha già pubblicato il contributo previsto; Windows presenta tre stati distinti. Il remote di ogni clone è un path locale. Questi remote non appartengono al repository Atlas.

Il runner versione `--verify` è una verifica automatica di manutenzione in una copia separata; leggine il codice soltanto dopo il tentativo personale. Non è l’evidenza del tuo assessment.

## Passi

1. Nei tre cloni `windows`, esegui il preflight della lesson. Conferma working tree pulito, branch, upstream e remote locale prima di fetch. Registra `git rev-list --left-right --count 'HEAD...@{upstream}'` e il graph. Non operare nel bare remote.
2. Nel caso `fast-forward`, scegli l'integrazione che rifiuta una divergenza inattesa. Verifica dopo l'azione che HEAD e upstream coincidano e che il contributo Mac sia presente.
3. Nel caso `divergence`, annota l'hash privato Windows e quello pubblicato Mac. Prova un push normale e l'aggiornamento ff-only: entrambi devono rifiutare lo stato divergente. Non usare force.
4. Crea `rescue/before-rebase` nel clone Windows. Spiega quali commit sono ancora privati e scegli la base remota della feature. Esegui il rebase circoscritto, verifica che entrambi i file contribuiti esistano e che il commit Mac sia antenato di HEAD. Verifica che rescue preservi l'hash precedente; pubblica con push normale sul bare remote locale.
5. Nel caso `conflict`, registra HEAD prima del tentativo. Integra `origin/main` con merge, osserva il conflitto su `choice.txt`, leggi status e i marker. Esegui l'abort appropriato e dimostra che hash e file sono tornati allo stato iniziale pulito.
6. Ripeti il merge. Il requisito del task è conservare entrambe le intenzioni nella riga, non scegliere una macchina vincente. Modifica solo `choice.txt`, marca la risoluzione e completa il merge con un messaggio motivato. Dimostra con `git merge-base --is-ancestor HASH HEAD` per entrambi gli hash precedenti che la storia è preservata; controlla l’exit code. Poi push normale.
7. In questo clone ora pulito, crea una nota untracked innocua. Conservane il contenuto con stash -u, verifica che sparisca dalla working tree, applica lo stash senza rimuoverlo e confronta il contenuto. Solo dopo la verifica rimuovi lo stash. Spiega che cosa accadrebbe con un file ignored e perché non usi -a.
8. Usa reflog per localizzare l'hash precedente al rebase nel caso feature e crea un ulteriore branch rescue con un nome nuovo. Non spostare il branch corrente. Per esercitare revert, committa soltanto la nota innocua nel caso conflict, poi invertila con un nuovo commit, spiegando la differenza rispetto alla riscrittura della storia.
9. Scrivi una checklist personale di inizio/fine sessione: stato, branch/upstream, fetch, divergenza, test, commit, push previsto e handoff del lavoro rimasto locale. Non promuovere automaticamente la tua mastery dal successo del lab.

## Acceptance criteria

Fast-forward senza merge aggiuntivo; divergenza rilevata e push normale finale riuscito dopo rebase dei soli commit privati; conflitto osservato, abort verificato e merge finale con entrambi i commit antenati. Stash applicato e confrontato prima di drop; recupero tramite branch rescue; revert conserva la storia. Nessun force push e nessuna rete esterna.

## Diagnosi di errori attesi

Rifiuto non-fast-forward è il risultato atteso prima dell’integrazione feature. Il conflitto produce uno stato unmerged, non un repository da ricreare alla cieca. Upstream mancante o remote diverso da un path della fixture: fermati e correggi l’orientamento prima di procedere.

## Recovery/rollback

Parti sempre da un albero pulito. In conflitto usa status per distinguere merge da rebase e scegli il rispettivo --abort. Rescue conserva commit, non modifiche non committate. Non cancellare lo stash finché il contenuto recuperato non è verificato. Se il task si complica oltre i tre casi controllati, conserva il log e crea un nuovo workspace lasciando il primo per review.

## Cleanup sicuro

Prima conserva gli artifact sanitizzati del tentativo in una destinazione personale scelta consapevolmente; Atlas non ne crea una. Torna alla root di Atlas e passa il path esatto stampato dal setup, fra virgolette, a:

```text
node scripts/lab-workspace.mjs cleanup ".lab-runs/lab-NOME-ID"
```

Sostituisci NOME-ID con il nome effettivo. Il comando accetta soltanto una directory immediatamente sotto `.lab-runs`, con prefisso lab e marker Atlas. Non usare wildcard o path del prodotto. Questa rimozione è volontaria e riguarda tutta la copia temporanea: prima verifica di aver conservato le evidenze che desideri.

## Evidenza da conservare

- Log prima/dopo e decisione motivata per ciascuno dei tre scenari.
- Prova di abort e successiva risoluzione; hash preservati e checklist di sessione.

Registra data, versioni, tentativo e hint usati. Non conservare environment completo, path personali o identità reali.

## Riflessione senza LLM

Perché il rebase della feature permette un push normale senza riscrivere il commit Mac? Come cambia la decisione se anche il commit Windows è già stato usato da altri? Spiega quali dati un push, uno stash e un branch rescue trasferiscono o preservano.

## Review opzionale con agente

Solo dopo il tuo tentativo, consegna diff e diagnosi sanitizzati. Chiedi al reviewer di controllare i criteri dell’[assessment](assessment.md), di distinguere ciò che hai spiegato da ciò che ha suggerito e di proporre un solo caso aggiuntivo. Il reviewer non aggiorna automaticamente la mastery.
