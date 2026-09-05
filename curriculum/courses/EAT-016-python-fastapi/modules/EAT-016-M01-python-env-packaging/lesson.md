# EAT-016-M01 — Python: ambiente, package src e test standard-library; richiamo al core

Stato: draft. Contenuto autoriale; nessuna mastery personale attribuita.

## Perché questa skill serve

Un file Python introduttivo non insegna quale interprete avvia un servizio, dove vengono risolti gli import o come si separano runtime e tool di sviluppo. Questo modulo costruisce il minimo ambiente per leggere `services/ironmath-llm`, preservando il layout del prodotto come riferimento e usando una funzione originale nella fixture.

## Outcome osservabili

- Creare un venv locale e identificare interprete e import path.
- Eseguire un package src e un test standard-library senza installazioni di rete.
- Spiegare requirements, pyproject ed editable install distinguendoli dal test diretto.

## Prerequisiti

EAT-001: path, cwd, environment e quoting. La baseline SSRI copre soltanto primo programma, variabili e tipi Python; il lab richiama funzioni, import ed eccezioni attraverso una media aritmetica. Python 3.10+ con venv/ensurepip disponibile e Node 24 per il setup. Nessun FastAPI o client LLM viene installato.

## Modello mentale

L'interprete esegue il codice; il virtual environment seleziona un'installazione isolata dei package per quel progetto. Un venv normalmente riutilizza la standard library dell'interprete base, ma dispone di propri percorsi di installazione. Non è una sandbox del sistema operativo.

L'attivazione cambia il PATH della shell: rende comodo usare `python`, ma non è obbligatoria. Invocare direttamente `.venv/bin/python` o `.venv\Scripts\python.exe` seleziona l'interprete senza ambiguità. `python -m pip` avvia pip tramite quello stesso interprete; un semplice `pip` potrebbe appartenere a un altro ambiente.

Nel layout `src`, il package importabile risiede in `src/atlas_fixture/`. Il nome della distribuzione dichiarato in pyproject può contenere trattini e differire dal nome di import con underscore. L'import cerca in `sys.path`, che dipende dall'invocazione e dall'ambiente; trovarsi nella root non implica che `src` sia già installato.

## Concetti e comandi essenziali

| Azione | macOS/Linux | Windows PowerShell |
| --- | --- | --- |
| Verifica versione disponibile | `python3 --version` | `py -3 --version` oppure `python --version` |
| Crea venv | `python3 -m venv .venv` | `py -3 -m venv .venv` |
| Attiva | `source .venv/bin/activate` | `.\.venv\Scripts\Activate.ps1` |
| Usa senza attivare | `.venv/bin/python -m pip --version` | `.\.venv\Scripts\python.exe -m pip --version` |
| Termina attivazione | `deactivate` | `deactivate` |

Se una execution policy impedisce Activate.ps1, usa direttamente l'eseguibile del venv; non cambiare policy di sistema per il lab. Non spostare un venv fra macchine: ricrealo a partire dai contratti. Non versionare `.venv` o `__pycache__`.

`requirements.txt` è una lista di requisiti per pip, spesso usata per il runtime; `requirements-dev.txt` è una convenzione per strumenti di sviluppo e test. I nomi non impongono semantica automatica. Un file requirements senza pin o hash non equivale da solo a un lock riproducibile. Nella fixture entrambi contengono soltanto un commento: non ci sono package da scaricare.

`pyproject.toml` dichiara metadata del progetto e il build system. La sezione `[build-system]` nomina backend e requisiti necessari per costruire/installare la distribuzione. La fixture dichiara setuptools come il baseline del servizio, ma il test diretto non richiede di installarlo.

Una **editable install**, tipicamente `python -m pip install -e .`, rende importabile il progetto durante lo sviluppo senza ricopiare manualmente ogni modifica di sorgente. Può comunque richiedere un backend, build isolation e dipendenze: non è automaticamente offline. `--no-deps` evita dipendenze runtime, ma non elimina da solo i requisiti dell'ambiente di build. In questa tranche il comando è spiegato e non eseguito; una futura prova di editable dovrà predisporre backend/wheelhouse approvati e verificabili. Non simuliamo un'installazione riuscita modificando `sys.path`.

`python -m atlas_fixture` cerca il package e ne esegue `__main__.py`; invocare direttamente un file interno può invece rompere gli import relativi. Il lab esegue il modulo dalla directory `src`, rendendo esplicito il motivo per cui è importabile. `run_tests.py` aggiunge esplicitamente `src` a `sys.path` per testare il sorgente: è un test diretto, distinto da una prova di packaging installato.

## Esempio svolto

La funzione `mean(values)` rifiuta una collezione vuota con `ValueError` e restituisce `sum(values) / len(values)` altrimenti. Il test usa `unittest`: verifica numeri con segno e il failure mode vuoto. Non chiama servizi né scrive dati applicativi.

Dalla cartella della fixture, senza attivazione, su macOS/Linux:

```text
.venv/bin/python run_tests.py
.venv/bin/python -I -c "import atlas_fixture"
```

Il primo comando supera due test; il secondo fallisce con `ModuleNotFoundError`, perché `-I` isola l'import dalla cwd e il package non è installato. Non correggere installando da internet. Per avviare il modulo, cambia cwd in `src` e usa `../.venv/bin/python -m atlas_fixture`. Su Windows usa `..\.venv\Scripts\python.exe` da `src`.

Questo esperimento separa “il codice è corretto” da “la distribuzione è installata e importabile in un ambiente pulito”. Entrambe le prove sono utili, ma una non sostituisce l'altra.

## Failure mode e recovery

Python non trovato: individua l'interprete con `command -v python3` o `Get-Command python`/`py`, senza modificare file del prodotto. Modulo venv/ensurepip assente: interrompi il lab con diagnosi; la predisposizione dell'interprete è una decisione esplicita, non uno scaricamento nascosto nel runner.

`ModuleNotFoundError` va letto insieme a cwd, interprete e sys.path. Evita un PYTHONPATH globale che nasconda un package non installato. `ImportError` su import relativo può derivare dall'esecuzione come file anziché come modulo.

Se il test vuoto smette di fallire, verifica che stia importando la copia giusta e che la suite includa il caso. Il solo exit code zero di uno script che non esegue test non dimostra qualità. La fixture richiede due test effettivi. Per ricominciare crea un nuovo workspace temporaneo; non ripulire l'installazione Python globale.

## Collegamenti a IronMath

Anchor di sola lettura nello snapshot IronMath dichiarato in `sources/repositories.json`: `services/ironmath-llm/pyproject.toml`, `services/ironmath-llm/src/ironmath_llm/`. Non sono link locali né dipendenze del lab. Consulta la [mappa di lettura](../../../../../projects/ironmath-reading-map.md) per la domanda del macro-corso. Non aprire configurazioni riservate e non avviare servizi del prodotto.

## Esercizio senza LLM

Disegna l'albero sorgente/test/venv. Predici quali invocazioni troveranno `atlas_fixture`, poi verifica e spiega. Cambia i dati di un test nella copia del lab, produci un fallimento intenzionale e ripristina solo quella modifica. Spiega separatamente che cosa servirebbe per testare un'editable install offline.

## Domande di autoverifica

1. Attivare un venv lo rende una sandbox?
2. Perché `python -m pip` riduce l'ambiguità?
3. Che cosa installa la sezione build-system e quando può richiedere rete?
4. Perché il test con sys.path esplicito non prova un'editable install?
5. Che cosa cambia fra eseguire un file e `python -m`?
6. Quali directory sono generate e ricreabili?

## Glossario

**Interpreter**: eseguibile Python. **venv**: ambiente di package isolato. **Distribution**: unità installabile descritta dai metadata. **Package**: namespace importabile. **Build backend**: implementazione della costruzione/installazione. **Editable install**: collegamento di sviluppo al progetto sorgente. **sys.path**: percorsi di ricerca degli import.

## Fonti e versioni

Fonti: [Python venv](https://docs.python.org/3/library/venv.html), [Packaging Python projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/), [pip local project installs](https://pip.pypa.io/en/stable/topics/local-project-installs/), [unittest](https://docs.python.org/3/library/unittest.html). Baseline prodotto Python >=3.10; verifica locale con Python 3.14.0, data 2026-09-05. L'editable install resta spiegata ma non eseguita; il venv e i test standard-library sono eseguiti offline.
