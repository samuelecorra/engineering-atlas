# Lab — EAT-002-M01

## Obiettivo

Diagnosticare tre versioni dello stesso file e creare uno snapshot delimitato nel repository fixture senza remote.

## Setup e sicurezza

Dalla root di Atlas, con Node 24 e gli strumenti indicati nella [lesson](units/EAT-002-M01-U01-fondamenti/lessons/EAT-002-M01-U01-L01-git-state-model/lesson.md):

```text
node curriculum/courses/EAT-002-git-multi-machine/modules/EAT-002-M01-git-state-model/fixtures/run.mjs
```

Il comando crea un workspace nuovo e ne stampa il path relativo. Non esegue il task al posto tuo. Lavora soltanto in quel path; i sorgenti sotto curriculum restano invariati. Nessun secret, dato personale, account o servizio di prodotto. Le scritture sono confinate al workspace con marker; l’orientamento del primo lab è read-only dopo il setup.

## Fixture locale

Il setup crea `repo/` con identità Git sintetica locale, un commit iniziale, `plan.txt` diverso in HEAD/index/working tree e `notes.txt` untracked. Non cambia user.name/user.email globali e non aggiunge remote ad Atlas.

Il runner versione `--verify` è una verifica automatica di manutenzione in una copia separata; leggine il codice soltanto dopo il tentativo personale. Non è l’evidenza del tuo assessment.

## Passi

1. Entra in `repo` del path stampato. Verifica la root con `git rev-parse --show-toplevel`; deve essere la fixture, non Atlas.
2. Leggi `git status --short --branch`, `git diff` e `git diff --staged`. Predici e poi osserva il contenuto con `git show HEAD:plan.txt`, `git show :plan.txt` e un lettore di file.
3. Compila una tabella con le tre versioni. Spiega entrambi i caratteri di `MM` e il significato di `??`.
4. Il task richiede di salvare la versione attualmente staged, preservando quella successiva nel working tree e lasciando notes.txt fuori. Senza aggiungere altro, crea un commit con messaggio che descriva questa scelta.
5. Usa `git show HEAD:plan.txt`, `git show --stat HEAD`, `git diff` e status per dimostrare l'esito. Salva l'hash della fixture e la tabella dopo il commit.
6. In una nuova copia, ripeti l'esperimento con una selezione diversa: prima di `git add plan.txt` scrivi quale versione entrerà nel prossimo snapshot. Confronta i due risultati senza cancellare il primo tentativo.

## Acceptance criteria

La prima diagnosi distingue base/staged/working e il file untracked. Il commit richiesto conserva staged, il working tree conserva working e notes.txt resta fuori. Il secondo tentativo dimostra l’effetto di add con una previsione esplicita.

## Diagnosi di errori attesi

Commit vuoto dopo una selezione sbagliata: ricontrolla l’index. File aggiunti involontariamente: leggi diff staged e scegli i path singolarmente. Non usare commit -a o add . per evitare il ragionamento richiesto.

## Recovery/rollback

Prima di cambiare selezione conserva il diff; `git restore --staged plan.txt` è distinto dal ripristino del working tree. Per ripetere dalla configurazione iniziale crea una nuova fixture. Non usare reset distruttivi nel repository Atlas.

## Cleanup sicuro

Prima conserva gli artifact sanitizzati del tentativo in una destinazione personale scelta consapevolmente; Atlas non ne crea una. Torna alla root di Atlas e passa il path esatto stampato dal setup, fra virgolette, a:

```text
node scripts/lab-workspace.mjs cleanup ".lab-runs/lab-NOME-ID"
```

Sostituisci NOME-ID con il nome effettivo. Il comando accetta soltanto una directory immediatamente sotto `.lab-runs`, con prefisso lab e marker Atlas. Non usare wildcard o path del prodotto. Questa rimozione è volontaria e riguarda tutta la copia temporanea: prima verifica di aver conservato le evidenze che desideri.

## Evidenza da conservare

- Tabella di status, diff e diff staged prima e dopo il commit.
- Hash del commit fixture e verifica delle versioni working tree/index/HEAD.

Registra data, versioni, tentativo e hint usati. Non conservare environment completo, path personali o identità reali.

## Riflessione senza LLM

Perché un commit riuscito può lasciare lo stesso file modified? Quale singolo comando dimostra la versione staged prima di committare?

## Review opzionale con agente

Solo dopo il tuo tentativo, consegna diff e diagnosi sanitizzati. Chiedi al reviewer di controllare i criteri dell’[assessment](assessment.md), di distinguere ciò che hai spiegato da ciò che ha suggerito e di proporre un solo caso aggiuntivo. Il reviewer non aggiorna automaticamente la mastery.
