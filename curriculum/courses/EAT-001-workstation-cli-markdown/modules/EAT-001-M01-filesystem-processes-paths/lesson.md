# EAT-001-M01 — Filesystem, processi, path e modello del terminale

Stato: draft. Contenuto autoriale; nessuna mastery personale attribuita.

## Perché questa skill serve

Un launcher può fallire prima che l'applicazione inizi: path relativo risolto dalla cartella sbagliata, comando assente o porta occupata. Sapere leggere questi segnali permette di diagnosticare il problema senza cambiare codice o permessi alla cieca. La base SSRI su processi e filesystem viene qui applicata a una sessione osservabile.

## Outcome osservabili

- Distinguere terminale, shell, comando e processo.
- Diagnosticare cwd, path, exit code e stream su una fixture read-only.
- Localizzare PID e porta del solo processo locale avviato per il lab.

## Prerequisiti

Saper leggere un file di testo. Richiama processi e filesystem dalla baseline SSRI; non serve ripetere il corso di sistemi operativi. Per il lab servono Node 24 e un terminale, senza privilegi amministrativi.

## Modello mentale

Il **terminale** è l'interfaccia di input/output. La **shell** interpreta una riga e può avviare un programma. Un **comando** è la richiesta interpretata: può essere un builtin della shell oppure un eseguibile. Un **processo** è un'istanza in esecuzione con PID, working directory, environment e stream. Più processi possono eseguire lo stesso programma.

La working directory (cwd) appartiene al processo: `data/input.txt` viene risolto rispetto a essa, non rispetto alla posizione dello script. Un path assoluto parte da una radice: `/tmp/esempio` su sistemi POSIX, `C:\lab\esempio` su Windows. `C:esempio` su Windows è relativo alla directory corrente di quel drive: non è equivalente a `C:\esempio`. Un path UNC ha forma `\\server\share\cartella`; il lab non usa condivisioni di rete.

stdin porta dati al processo, stdout il risultato normale, stderr la diagnostica. L'exit code è un intero convenzionale: zero indica successo, un valore diverso segnala un esito da interpretare. Il fatto che stdout contenga testo non garantisce successo.

## Concetti e comandi essenziali

| Scopo | Bash / zsh su macOS/Linux | PowerShell |
| --- | --- | --- |
| Cwd | `pwd` | `Get-Location` |
| Elenco file, inclusi nascosti | `ls -la` | `Get-ChildItem -Force` |
| Leggere testo | `cat "data/input.txt"` | `Get-Content -LiteralPath "data/input.txt"` |
| Cambiare directory | `cd "cartella con spazi"` | `Set-Location -LiteralPath "cartella con spazi"` |
| Esito ultimo comando esterno | `echo "$?"` | `$LASTEXITCODE` |
| Processo noto | `ps -p 12345` | `Get-Process -Id 12345` |

Leggi l'exit code immediatamente: un comando successivo può sostituirlo. In PowerShell `$?` è un booleano che indica il successo della pipeline; per l'exit code numerico di `node` usa `$LASTEXITCODE`. Gli errori dei cmdlet PowerShell seguono inoltre le proprie regole, non quelle dei soli eseguibili.

Per il processo loopback del lab, sostituisci il PID e la porta stampati. macOS: `lsof -nP -iTCP:PORTA -sTCP:LISTEN`; Linux: `ss -ltnp`; Windows: `Get-NetTCPConnection -LocalPort PORTA` e poi `Get-Process -Id PID`. Su Linux limita l'osservazione alla porta nota; alcuni dettagli di processi altrui non sono visibili senza privilegi. Non elevarli per questo esercizio. Una porta è un endpoint di trasporto, non un PID: prima associa i due, poi formula un'ipotesi.

## Esempio svolto

Dalla directory `fixture` creata dal lab:

```text
node inspect.mjs data/input.txt
node inspect.mjs missing.txt
```

La prima invocazione stampa tre righe su stdout e termina con zero. La seconda non trova il file: stderr contiene `ENOENT`, stdout è vuoto ed exit code è 2, scelto da questa fixture. Non tutti i programmi usano 2 per un file mancante.

Se esegui `node fixture/inspect.mjs data/input.txt` dalla directory superiore, lo script parte ma cerca `data/input.txt` nella cwd superiore. La correzione è scegliere consapevolmente cwd e argomento, ad esempio `fixture/data/input.txt`. Spiega quale dei due path identifica lo script e quale il dato.

## Failure mode e recovery

`ENOENT`: verifica cwd, spelling, maiuscole e presenza del file. `EACCES`/`EPERM`: controlla quale operazione è negata; non proporre permessi globali o privilegi amministrativi senza una causa. Un file aperto da un altro processo può avere effetti diversi su Windows.

“Command not found” riguarda la risoluzione dell'eseguibile attraverso PATH, non necessariamente i dati. Usa `command -v node` oppure `Get-Command node`, evitando di stampare tutte le variabili.

`EADDRINUSE` riguarda un indirizzo/porta già occupato. Identifica il proprietario prima di agire. Nel lab la porta viene assegnata dal sistema su loopback; il processo si chiude dopo 45 secondi o con Ctrl+C nel proprio terminale. Non terminare processi sconosciuti.

## Collegamenti a IronMath

Anchor di sola lettura nello snapshot IronMath dichiarato in `sources/repositories.json`: `package.json`, `tooling/launchers/`. Non sono link locali né dipendenze del lab. Consulta la [mappa di lettura](../../../../../projects/ironmath-reading-map.md) per la domanda del macro-corso. Non aprire configurazioni riservate e non avviare servizi del prodotto.

## Esercizio senza LLM

Prima di eseguire un comando, scrivi cwd, path atteso, stream previsto ed esito. Leggi poi un file corretto e uno inesistente, spiegando la differenza senza ricorrere a un agente. Confronta due invocazioni da cwd differenti. Non annotare path personali completi: usa il path relativo della fixture.

## Domande di autoverifica

1. Uno script nella cartella corretta può leggere il file sbagliato? Motiva con la cwd.
2. Un messaggio su stderr implica sempre exit code nonzero? Controlla il contratto del programma.
3. Perché PID e porta non sono intercambiabili?
4. Che differenza c'è fra terminale chiuso e processo terminato?
5. Quale informazione controlli prima di modificare i permessi?

## Glossario

**cwd**: base per i path relativi. **PID**: identificatore del processo. **PATH**: elenco di directory per risolvere comandi esterni. **Stream**: canale di dati sequenziali. **Exit code**: risultato numerico dell'esecuzione. **Loopback**: interfaccia della stessa macchina.

## Fonti e versioni

Riferimenti: [Node process](https://nodejs.org/docs/latest-v24.x/api/process.html), [Node path](https://nodejs.org/docs/latest-v24.x/api/path.html), [PowerShell Get-Location](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-location). Target Node 24; fixture eseguita con 24.14.1 su macOS. Comandi PowerShell destinati a PowerShell 7; non è stata eseguita una sessione Windows. Data: 2026-09-05.
