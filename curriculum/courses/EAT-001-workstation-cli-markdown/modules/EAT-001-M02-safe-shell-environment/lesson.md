# EAT-001-M02 — Shell sicura, environment e quoting

Stato: draft. Contenuto autoriale; nessuna mastery personale attribuita.

## Perché questa skill serve

Un path con spazi o una variabile non esportata può rendere uno script apparentemente corretto inutilizzabile sull'altra macchina. Il danno maggiore nasce quando si prova a correggere l'errore con una redirection o una cancellazione nel posto sbagliato. Questo modulo sviluppa una disciplina di parsing e di scritture circoscritte.

## Outcome osservabili

- Correggere tre script innocui spiegando parsing, quoting ed environment.
- Tradurre i comandi essenziali fra Bash e PowerShell senza stampare secret.

## Prerequisiti

Completa EAT-001-M01: cwd, argomenti, stdout/stderr ed exit code. Per la correzione dei file usa un editor di testo nella copia temporanea del lab. I file `.bash.txt` e `.powershell.txt` sono script da leggere; non vengono eseguiti automaticamente.

## Modello mentale

La shell trasforma testo in argomenti prima di avviare Node. `node read.mjs data/My Notes.txt` non consegna un unico path: separa `data/My` e `Notes.txt`. L'applicazione non può ricostruire in modo affidabile l'intenzione originale.

In Bash, apici singoli preservano il testo letterale; doppi apici consentono espansioni come `$VAR` mantenendo il risultato in un argomento. Senza quoting possono intervenire word splitting e glob. In PowerShell apici singoli sono letterali e doppi apici espandono variabili; la pipeline tra cmdlet trasporta oggetti. I programmi nativi ricevono argomenti e stream, con differenze rispetto ai cmdlet. L'equivalenza è di intento, non una sostituzione meccanica di sintassi.

Un processo figlio eredita l'environment esportato dal genitore; non può aggiornare quello della shell genitore. Configurazione locale e versionata hanno proprietà diverse: il repository documenta nomi e valori innocui, mentre valori riservati non devono entrare in file o log del lab.

## Concetti e comandi essenziali

| Intento | Bash | PowerShell |
| --- | --- | --- |
| Path unico | `node read.mjs "data/My Notes.txt"` | `node read.mjs "data/My Notes.txt"` |
| Variabile per processo figlio | `export ATLAS_DEMO_MODE=practice` | `$env:ATLAS_DEMO_MODE = 'practice'` |
| Avvio con env limitato | `ATLAS_DEMO_MODE=practice node check-env.mjs` | imposta `$env:ATLAS_DEMO_MODE`, poi `node check-env.mjs` |
| Togliere il valore innocuo | `unset ATLAS_DEMO_MODE` | `Remove-Item Env:ATLAS_DEMO_MODE` |

`ATLAS_DEMO_MODE` è l'unico nome osservato dalla fixture; non usare dump di environment, né `printenv` o `Get-ChildItem Env:` per conservare evidenze. Una semplice assegnazione Bash non esportata può non arrivare a Node. In PowerShell `$ATLAS_DEMO_MODE` è una variabile della sessione, diversa da `$env:ATLAS_DEMO_MODE`.

Una pipe `|` collega output e input. Bash usa stream di byte; PowerShell usa spesso oggetti fra cmdlet. Il successo dell'ultimo processo non dimostra il successo di ogni stadio; in Bash `set -o pipefail` modifica la regola di esito della pipeline e va compreso prima di adottarlo.

La redirection `>` crea o tronca il file di destinazione: un path errato può distruggere una copia utile prima che il programma parta. `>>` appende e può duplicare risultati a ogni esecuzione. `2>` cattura stderr. Nel lab usa solo nomi nuovi nella directory assegnata; non indirizzare output sul file che stai leggendo. In Bash `set -o noclobber` protegge alcune redirection da sovrascritture, ma non è una sandbox universale.

Un comando in foreground occupa la sessione; un processo background richiede gestione esplicita di output e lifetime. `&` in Bash e i job PowerShell non hanno lo stesso ciclo di vita in ogni host. Qui non servono processi lasciati attivi. Per directory temporanee usa il runner `.mjs`, che crea un nome univoco e un marker dentro `.lab-runs/`.

## Esempio svolto

Il programma `read.mjs` richiede esattamente un argomento. Leggi la riga non quotata e conta gli argomenti prima di eseguirla. Quando il conteggio è sbagliato, lo script si ferma con un messaggio prima di aprire file. Inserendo i doppi apici consegni un unico path; il contenuto innocuo viene letto.

Per l'environment esegui `node check-env.mjs` in una nuova sessione: fallisce senza stampare il valore. Imposta soltanto `ATLAS_DEMO_MODE` come nella tabella; ripetendo il comando ottieni la conferma della modalità. Chiudi la sessione o rimuovi soltanto quel nome al termine.

## Failure mode e recovery

Un errore di argomenti va risolto nel parsing, un `ENOENT` nella risoluzione del path. Non sono la stessa diagnosi. Se l'environment sembra funzionare anche senza export, potresti aver ereditato un valore da una sessione precedente: riprova dopo aver rimosso la sola variabile innocua.

Non rilanciare uno script sconosciuto con privilegi maggiori. Leggi prima pipe e destinazioni di scrittura. Se hai modificato male la copia del lab, conserva un diff e crea una nuova copia: non ripristinare a forza il repository Atlas o quello di prodotto.

## Collegamenti a IronMath

Anchor di sola lettura nello snapshot IronMath dichiarato in `sources/repositories.json`: `tooling/launchers/`, `package.json`. Non sono link locali né dipendenze del lab. Consulta la [mappa di lettura](../../../../../projects/ironmath-reading-map.md) per la domanda del macro-corso. Non aprire configurazioni riservate e non avviare servizi del prodotto.

## Esercizio senza LLM

Correggi i tre difetti della fixture sulla shell disponibile e traduci ogni riga nell'altra sintassi. Per ciascuno predici numero di argomenti, cwd e presenza del nome innocuo nell'environment. Spiega quali file verrebbero toccati da una redirection prima di usarla.

## Domande di autoverifica

1. Perché le virgolette non fanno parte del nome del file passato a Node?
2. Che cosa eredita un processo figlio? Che cosa non può cambiare nel genitore?
3. Quando `>>` rende un task non idempotente?
4. Perché copiare una pipe Bash in PowerShell può cambiare il significato?
5. Come diagnostichi environment senza registrare valori riservati?

## Glossario

**Quoting**: regole che preservano o espandono porzioni di testo. **Globbing**: espansione di pattern in nomi di file. **Environment**: coppie nome/valore ereditate dal processo. **Redirection**: collegamento di uno stream a una destinazione. **Idempotenza**: ripetere l'operazione non aggiunge effetti indesiderati.

## Fonti e versioni

Fonti: [Bash quoting](https://www.gnu.org/software/bash/manual/html_node/Quoting.html), [PowerShell quoting rules](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules), [Node child processes](https://nodejs.org/docs/latest-v24.x/api/child_process.html). Sintassi base Bash 3.2+ e PowerShell 7; CLI Node 24. La verifica automatica controlla gli argomenti e l'environment via Node; non equivale a eseguire entrambe le shell. Data: 2026-09-05.
