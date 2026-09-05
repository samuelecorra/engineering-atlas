# EAT-002-M02 — Git tra due macchine: sincronizzazione e recovery

Stato: draft. Contenuto autoriale; nessuna mastery personale attribuita.

## Perché questa skill serve

Passare dal Mac a Windows non trasferisce il working tree. Il remote conserva commit pubblicati; ciascuna macchina mantiene modifiche locali, index, branch e reflog propri. Questo modulo insegna a scegliere una sincronizzazione a partire dallo stato e a recuperare un tentativo interrotto. Il target del primo assessment è M2: checklist e spiegazione sono ammesse; la manutenzione indipendente M4 della skill richiederà prove successive.

## Outcome osservabili

- Riconoscere fast-forward e divergenza da upstream e commit graph.
- Recuperare un conflitto tramite abort e continuazione senza perdere commit.
- Motivare rebase privato, merge condiviso, stash e recupero non distruttivo.

## Prerequisiti

Completa EAT-002-M01. Devi saper confrontare HEAD, index e working tree e leggere un commit graph. Il lab richiede Git e Node 24; crea tre scenari indipendenti con due cloni locali e un bare remote ciascuno, tutti sotto `.lab-runs/`. Non serve GitHub.

## Modello mentale

Il modello è Mac ↔ remote ↔ Windows. `origin/main` su Windows è l'ultima osservazione locale di `main` nel remote, non una finestra live sul Mac. `fetch` aggiorna questa osservazione, senza integrare automaticamente i commit nel branch corrente.

Un upstream collega un branch locale a un branch osservato: `main` può seguire `origin/main`. Dopo fetch, `git rev-list --left-right --count 'HEAD...@{upstream}'` conta commit solo locali a sinistra e solo upstream a destra. `0 2` significa dietro di due; `2 0` avanti di due; `1 1` divergenza; `0 0` stesso insieme raggiungibile. Quota il revision argument in PowerShell e in Bash per evitare che la shell interpreti i caratteri.

Un fast-forward sposta un riferimento su un discendente senza creare un commit di merge. Un merge conserva i rami e può aggiungere un commit con due parent. Un rebase riproduce commit su una nuova base, cambiandone gli hash. La decisione dipende soprattutto da chi ha già osservato i commit da riscrivere.

## Concetti e comandi essenziali

**Preflight di inizio sessione**, nel clone giusto:

```text
git rev-parse --show-toplevel
git status --short --branch
git branch -vv
git remote -v
git fetch origin
git log --oneline --graph --decorate --all -12
git rev-list --left-right --count 'HEAD...@{upstream}'
```

Nel prodotto evita di conservare URL con credenziali eventualmente presenti nei remote; nel lab sono soltanto path locali. Se manca l'upstream, non inventarlo dal nome: verifica remote e branch. Il lab lo preconfigura; in un repository reale `branch --set-upstream-to=origin/nome` è appropriato solo dopo aver verificato che sia quello atteso.

| Stato dopo fetch | Decisione motivata |
| --- | --- |
| Branch condiviso pulito, solo behind | `git pull --ff-only` oppure integrazione esplicita con `git merge --ff-only '@{upstream}'` |
| Branch pulito, solo ahead | Review dei commit e test, poi push normale al target verificato |
| Commit privati di feature su base avanzata | Crea riferimento di recupero, poi rebase sulla base scelta |
| Commit già condivisi da conservare | Preferisci merge e review, evitando riscritture della storia osservata |
| Working tree con modifiche | Conserva prima il lavoro: commit delimitato su branch appropriato o stash consapevole |

`pull --ff-only` sul branch condiviso è una guardia: in divergenza si ferma. Non risolve la divergenza e non significa “prendi sempre il remote”. Per aggiornare un feature branch privato rispetto a `main`, dopo fetch puoi usare `git rebase origin/main`; se i commit feature sono già condivisi, integra `origin/main` con merge secondo la policy del team. Nel lab di divergenza si usa `origin/feature`: il target è la versione remota della stessa feature e solo il commit Windows ancora privato viene riprodotto.

Prima di un rebase delimitato:

```text
git branch rescue/before-rebase
git rebase origin/feature
```

Il riferimento rescue conserva i commit attuali, ma **non** salva modifiche non committate o file untracked. Per questi serve una scelta separata. Un commit provvisorio su un branch di lavoro è tracciabile; uno stash è locale e non viene inviato con push.

`git stash push -u -m "sessione incompleta"` include anche untracked, ma non file ignored. Non usare `-a` senza inventario: può coinvolgere generated e secret. Leggi `git stash list` e `git stash show -p --include-untracked 'stash@{0}'` solo su dati sanitizzati. `git stash apply --index 'stash@{0}'` tenta di ripristinare anche lo staging e conserva lo stash; può confliggere. Verifica i file prima di `git stash drop 'stash@{0}'`. `pop` unisce applicazione e rimozione in caso di successo, quindi offre meno separazione fra verifica e cleanup. Nessuno stash sostituisce il trasferimento di commit fra macchine.

**Durante un conflitto**: `status`, `diff` e `diff --name-only --diff-filter=U` individuano i path. Leggi base e intenzioni dei due lati, rimuovi i marker dopo una scelta motivata, poi `git add path`. Continua con `git merge --continue` o `git rebase --continue` a seconda dell'operazione. Non usare `rebase --skip` solo per eliminare l'errore: potrebbe scartare la modifica. Nel rebase “ours/theirs” può sorprendere perché Git sta riproducendo commit su un'altra base: leggi le versioni anziché scegliere un lato dal nome.

Se vuoi tornare al preflight, usa `git merge --abort` o `git rebase --abort`. L'abort è più affidabile quando il tentativo è iniziato con working tree pulito; modifiche preesistenti possono rendere il recupero ambiguo. Il lab parte da stati controllati.

## Esempio svolto

Nel caso fast-forward, il Mac pubblica un commit e Windows è pulito: dopo fetch legge `0 1`. `pull --ff-only` avanza Windows sullo stesso hash, senza un nuovo merge.

Nel caso feature, entrambi partono dalla stessa base: Mac pubblica un file, Windows committa un altro file solo localmente. Dopo fetch Windows legge `1 1`; il push normale viene rifiutato e `pull --ff-only` si ferma. Il rebase del solo commit privato su `origin/feature` mantiene il commit Mac e crea un nuovo commit Windows. Un push normale ora è fast-forward per il remote: non serve force push.

Nel caso condiviso, due commit modificano la stessa riga di `choice.txt`. Windows può avviare un merge, osservare il conflitto e abortire. HEAD e file tornano allo stato precedente. Una seconda integrazione risolta secondo l'intenzione di entrambi crea un merge che contiene entrambi i commit come antenati. Il checker verifica questa proprietà, non soltanto l'assenza dei marker.

## Failure mode e recovery

**Push rifiutato**: conserva il lavoro, fetch, leggi la divergenza e scegli integrazione. Non risolvere automaticamente con force push. Sul branch protetto non usarlo; `--force-with-lease` è comunque una riscrittura e non è una scorciatoia autorizzata per un branch condiviso. I bare remote del lab non applicano branch protection: la simulazione verifica il comportamento Git, non una policy server GitHub.

**Commit apparentemente perso**: `git reflog` mostra movimenti dei riferimenti nel clone corrente. Individua l'hash, verifica con `git show HASH`, poi `git branch rescue/recovered HASH`. Il recupero aggiunge un riferimento senza spostare o cancellare il working tree. Il reflog è locale, scade e non garantisce il recupero di file mai committati.

**Commit pubblicato da annullare**: per un commit ordinario `git revert HASH` crea un nuovo commit inverso e preserva la storia. Può confliggere; per un merge occorre capire il parent principale prima di usare `-m`, fuori dal task iniziale. Evita reset distruttivi come strategia di sync.

**Fine sessione**: rileggi status e diff, esegui test pertinenti, committa solo ciò che intendi trasferire, verifica il target e fai push normale se previsto; annota branch/hash, esito e lavoro ancora locale. Prima di lasciare la macchina, controlla che il remote osservato includa i commit destinati all'altra. Un albero pulito può contenere commit non pubblicati: controlla anche la divergenza.

## Collegamenti a IronMath

Anchor di sola lettura nello snapshot IronMath dichiarato in `sources/repositories.json`: `AGENTS.md`, `.github/workflows/`. Non sono link locali né dipendenze del lab. Consulta la [mappa di lettura](../../../../../projects/ironmath-reading-map.md) per la domanda del macro-corso. Non aprire configurazioni riservate e non avviare servizi del prodotto.

## Esercizio senza LLM

Prima di toccare i tre cloni Windows, scrivi una tabella con working tree, upstream, ahead/behind, azione scelta e rischio. Esegui un abort prima di completare il conflitto. Descrivi come conserveresti modifiche untracked e come recupereresti un hash dal reflog. Solo dopo conserva output e confronta con i criteri.

## Domande di autoverifica

1. Un Mac con working tree pulito è necessariamente sincronizzato?
2. Quali commit riscrive il rebase dello scenario feature e chi li ha già osservati?
3. Perché `pull --ff-only` fallisce in `1 1`?
4. Cosa salva un branch rescue, e cosa resta fuori?
5. Come distingui abort di merge e abort di rebase?
6. Uno stash è disponibile automaticamente sull'altra macchina?
7. Quale prova mostra che entrambi i commit del conflitto sono stati preservati?

## Glossario

**Upstream**: branch associato per confronto e integrazione. **Divergenza**: ciascun lato ha commit non raggiungibili dall'altro. **Fast-forward**: avanzamento verso un discendente. **Rebase**: riproduzione di commit su una base. **Reflog**: storia locale dei movimenti dei riferimenti. **Revert**: nuovo commit che inverte una modifica. **Bare remote**: repository di oggetti e riferimenti senza working tree ordinario.

## Fonti e versioni

Fonti: [git-pull](https://git-scm.com/docs/git-pull), [git-rebase](https://git-scm.com/docs/git-rebase), [git-merge](https://git-scm.com/docs/git-merge), [git-stash](https://git-scm.com/docs/git-stash), [git-reflog](https://git-scm.com/docs/git-reflog), [git-revert](https://git-scm.com/docs/git-revert). Consultazione: 2026-09-05; esecuzione locale con Git 2.50.1. Il modulo esplicita le strategie, senza dipendere dal default di pull della versione o della configurazione utente.
