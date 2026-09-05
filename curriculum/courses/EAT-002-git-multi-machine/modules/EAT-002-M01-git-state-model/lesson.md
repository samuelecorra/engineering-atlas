# EAT-002-M01 — Git: working tree, index, HEAD e snapshot

Stato: draft. Contenuto autoriale; nessuna mastery personale attribuita.

## Perché questa skill serve

Prima di sincronizzare due macchine bisogna capire quale versione si sta per salvare. `git add` non promette di includere le modifiche future: seleziona una versione per il prossimo commit. Il lab rende visibili tre contenuti diversi dello stesso file, senza rete o remote.

## Outcome osservabili

- Predire status e diff a partire da working tree, index e commit.
- Creare un commit delimitato e verificare che contenga solo la versione staged.

## Prerequisiti

Completa EAT-001: cwd, file, shell sicura e lettura del diff. La baseline SSRI include i comandi Git fondamentali; qui il ponte è prevederne gli effetti. Serve Git 2.50+; i comandi fondamentali funzionano anche su versioni precedenti, ma la verifica di questa tranche usa 2.50.1.

## Modello mentale

Il repository contiene oggetti e riferimenti. Il **working tree** è ciò che l'editor vede sul disco; l'**index**, chiamato staging area, descrive lo snapshot proposto; il **commit** registra uno snapshot e i collegamenti ai parent, con metadata.

`HEAD` di solito è un riferimento simbolico al branch corrente. Un branch è un nome mobile che punta a un commit, non una copia permanente della cartella. Dopo un commit sul branch, quel riferimento avanza. In detached HEAD punti direttamente a un commit: il lavoro può essere salvato con un nuovo branch prima di spostarti altrove.

Un file tracked è già nel controllo di versione; può essere invariato, modified o staged. Untracked significa che Git non lo include ancora negli snapshot. Uno stesso file può essere staged e poi nuovamente modified. Un remote è una configurazione verso un altro repository, non una connessione continua né una copia automaticamente aggiornata della macchina remota.

## Concetti e comandi essenziali

| Comando | Domanda a cui risponde |
| --- | --- |
| `git status --short --branch` | Quali differenze e quale branch vedo? |
| `git diff` | Che cosa differisce fra working tree e index? |
| `git diff --staged` | Che cosa differisce fra index e HEAD? |
| `git log --oneline --graph --decorate -8` | Quali commit e riferimenti sono visibili? |
| `git show HEAD` | Che cosa contiene/descritto dall'ultimo commit? |
| `git show HEAD:plan.txt` | Quale versione del file è nel commit? |
| `git show :plan.txt` | Quale versione è nell'index? |
| `git add plan.txt` | Seleziona la versione attuale di questo path |
| `git commit -m "fixture: scelta verificata"` | Salva lo snapshot staged |

Nel formato breve di status, il primo carattere confronta index con HEAD, il secondo working tree con index. `MM` segnala due differenze, non un errore. `??` identifica untracked.

Un commit è uno snapshot logico: Git può comprimere e condividere contenuti internamente, ma non è soltanto un elenco di righe aggiunte. `diff` calcola un confronto fra stati. `add` va ripetuto se vuoi includere modifiche successive; un commit senza `-a` usa l'index.

`pull` combina un fetch con una strategia di integrazione. Perciò non è una singola primitiva concettuale: prima distingui “aggiornare ciò che so del remote” da “cambiare il mio branch”. La scelta esplicita viene trattata nel modulo successivo.

## Esempio svolto

Supponi che `plan.txt` contenga `plan=base` in HEAD. L'editor lo cambia in `plan=staged`, poi `git add plan.txt` aggiorna l'index. Una nuova modifica porta il working tree a `plan=working`.

```text
HEAD          plan=base
index         plan=staged
working tree  plan=working
```

`status --short` mostra `MM plan.txt`. `diff --staged` confronta base e staged; `diff` confronta staged e working. Un commit adesso conserva staged e lascia working come modifica locale. Non occorre correggere il file: occorre scegliere consapevolmente quale versione intendi registrare.

Il lab aggiunge anche `notes.txt` untracked. Un commit delimitato a ciò che è già nell'index non lo include. Verifica questa affermazione con `git show --stat HEAD`.

## Failure mode e recovery

Index diverso dall'intenzione: prima leggi `diff --staged`; dopo aver conservato il lavoro puoi cambiare la selezione. `git restore --staged plan.txt` toglie il cambiamento dall'index senza cancellare il working tree, purché esista già un HEAD. Non confonderlo con `git restore plan.txt`, che può sovrascrivere modifiche del working tree.

Identità mancante: il lab configura un'identità sintetica soltanto nella fixture. Non cambiare Git globale per far funzionare un esercizio. Se un commit è stato creato sul branch sbagliato, annota l'hash e crea un riferimento di recupero prima di altri movimenti.

Una directory chiamata `.git` non rende ogni cartella superiore un posto sicuro in cui operare: controlla `git rev-parse --show-toplevel`. Evita `add .` nel task: renderebbe meno evidente la selezione del singolo artifact.

## Collegamenti a IronMath

Anchor di sola lettura nello snapshot IronMath dichiarato in `sources/repositories.json`: `AGENTS.md`, `package.json`. Non sono link locali né dipendenze del lab. Consulta la [mappa di lettura](../../../../../projects/ironmath-reading-map.md) per la domanda del macro-corso. Non aprire configurazioni riservate e non avviare servizi del prodotto.

## Esercizio senza LLM

Compila la tabella HEAD/index/working tree prima di eseguire i confronti. Decidi quale versione dovrebbe entrare nel commit richiesto. Esegui il commit, poi dimostra con due comandi che il file untracked è rimasto fuori e la modifica successiva è ancora sul disco.

## Domande di autoverifica

1. Dopo `add`, l'editor salva altre righe: il commit le includerà?
2. Quale differenza misura ciascuna colonna di status?
3. Un branch crea necessariamente una copia dei file?
4. Come dimostri il contenuto di un commit senza cambiare branch?
5. Che cosa può cambiare un fetch rispetto al working tree?

## Glossario

**Object**: contenuto Git identificato da hash. **Index**: snapshot proposto. **HEAD**: posizione corrente. **Branch**: riferimento mobile. **Tracked**: path già noto al repository. **Remote-tracking ref**: osservazione locale di un riferimento remoto, aggiornata da fetch.

## Fonti e versioni

Fonti: [git-status](https://git-scm.com/docs/git-status), [git-diff](https://git-scm.com/docs/git-diff), [git-add](https://git-scm.com/docs/git-add), [git-commit](https://git-scm.com/docs/git-commit). Git eseguito: 2.50.1; data 2026-09-05. Le identità del lab sono sintetiche e non rappresentano un learner.
