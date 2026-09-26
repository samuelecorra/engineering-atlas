# Impostazioni e profili: scegliere lo scope corretto

## Perché questa skill serve

Copiare un `settings.json` molto lungo può farti ottenere un editor diverso senza capire perché. Una configurazione professionale deve essere spiegabile: per ogni scelta sai quale comportamento cambia, dove si applica, perché è adatta e come annullarla.

Questa lezione insegna il metodo per leggere le impostazioni. Il censimento completo delle categorie e delle estensioni appartiene ai moduli successivi: qui non viene presentata una configurazione universale per tutti i progetti.

## Outcome osservabili

Sai trovare un’impostazione per ID, distinguere valore predefinito e override, scegliere User o Workspace, verificare un override di linguaggio e ripristinare la singola scelta. Sai distinguere profilo dell’editor e repository.

## Prerequisiti

La distinzione tra finestra, workspace e cwd. Usa una copia della fixture e, se sperimenti un profilo, creane uno dedicato allo studio. Non è necessario esportare impostazioni personali o attivare la sincronizzazione per seguire la lezione.

## Modello mentale

Una configurazione è il risultato di regole sovrapposte. Per una chiave devi sapere **quale valore è effettivo**, non soltanto quale valore ricordi di aver scritto. Gli override di linguaggio e le policy amministrative rendono incompleta la regola semplificata «vince sempre il workspace».

Un **profilo** raccoglie personalizzazioni dell’editor. Un **workspace** identifica il progetto aperto. **Settings Sync** trasferisce categorie di personalizzazione fra macchine, ma non sostituisce Git per versionare il codice del progetto.

## Concetti e comandi essenziali

### Cercare una chiave e leggere lo scope

Apri Settings tramite il comando `Preferences: Open Settings`. Cerca per ID con `@id:editor.wordWrap`; `@modified` aiuta a vedere scelte modificate. Per le estensioni usa `@ext:publisher.extension` con l’ID realmente verificato. Controlla la scheda User/Workspace e gli eventuali override di linguaggio prima di cambiare il valore.

La [guida Settings](https://code.visualstudio.com/docs/configure/settings) documenta precedenza, filtri e reset. Mantienila come riferimento per i casi completi: applicazione, macchina remota, workspace, cartella e lingua non sono tutti scope intercambiabili.

### Quattro domande prima di salvare

1. **Effetto**: quale comportamento voglio osservare?
2. **Perimetro**: deve valere per me, per questo progetto o per un linguaggio?
3. **Prova**: quale file e quale operazione mostreranno l’effetto?
4. **Ripristino**: quale override rimuovo per tornare al valore precedente?

Esempio: desideri una visualizzazione comoda delle righe Markdown lunghe. È diverso dal voler riscrivere fisicamente ogni riga nel file. Nel primo caso modifichi il comportamento dell’editor; nel secondo potrebbe intervenire un formatter, producendo un diff nel repository.

### Un esempio dichiaratamente didattico

Il file `settings-example.jsonc` della fixture contiene:

```jsonc
{
  // Solo esempio del lab: non è il profilo personale del proprietario.
  "editor.wordWrap": "off",
  "[markdown]": {
    "editor.wordWrap": "on"
  }
}
```

JSONC ammette commenti; un file JSON consumato da altri programmi potrebbe non ammetterli. Non rinominare tutti i JSON in JSONC per far sparire un errore.

Nella copia del lab, l’override Markdown ha un effetto diverso dal valore generale. Per verificare, apri un documento Markdown con una riga lunga e un documento di altro linguaggio. Il confronto isola la variabile che vuoi studiare. La documentazione su [editing e word wrap](https://code.visualstudio.com/docs/editing/codebasics) distingue presentazione e modifica del testo.

### Profili ed estensioni

Un profilo separato permette di sperimentare un insieme di personalizzazioni. Prima di attribuire un difetto a VS Code, puoi confrontare il comportamento con un profilo vuoto. Questo confronto fornisce un’indicazione: non identifica da solo quale estensione o setting causi il problema.

Per esportare, apri la gestione dei profili e scegli i contenuti da includere. Per preparare la guida personale a questo corso serve prima di tutto l’inventario delle estensioni con ID e versione; non servono password, token o configurazioni dei servizi. Vedi [Profiles](https://code.visualstudio.com/docs/configure/profiles).

La CLI documenta anche una lista testuale:

```bash
code --list-extensions --show-versions --profile "Nome esatto del profilo"
```

Usa un nome verificato nella GUI. Non dedurre il profilo attivo dal solo tema. La [guida CLI](https://code.visualstudio.com/docs/configure/command-line) descrive le opzioni; l’elenco va accompagnato dal nome del profilo e dalla versione dell’editor.

### Sincronizzare non significa versionare

Settings Sync può trasferire personalizzazioni selezionate, incluse estensioni e profili. Prima di scegliere merge o sostituzione, leggi quale lato verrà modificato e considera le differenze tra macchine. Non è un backup dei repository né una prova che i runtime Node/Python siano identici. La [guida Settings Sync](https://code.visualstudio.com/docs/configure/settings-sync) documenta anche limiti e recupero.

## Esempio svolto

Vuoi che una lezione Markdown vada a capo visivamente, mentre gli esempi di codice rimangano facili da confrontare.

Apri il documento del lab e annota il comportamento iniziale. In Settings cerca `editor.wordWrap`, osserva lo scope selezionato e configura soltanto l’override Markdown. Riapri il documento di confronto e controlla se è cambiato anch’esso. Infine guarda il diff del file: il testo della lezione non dovrebbe essere stato riscritto solo per cambiare la visualizzazione.

Se il comportamento non coincide con la previsione, verifica il linguaggio riconosciuto per il documento. Un file interpretato come Plain Text non riceve necessariamente l’override Markdown che intendevi provare.

## Failure mode e recovery

| Errore | Segnale utile | Recupero |
| --- | --- | --- |
| Modifica nello scope sbagliato | Cambiano altri progetti | Rimuovi quell’override e applicalo nel perimetro previsto. |
| Copia di setting appartenente a un’estensione assente | La chiave non viene riconosciuta | Verifica ID, installazione e documentazione della versione. |
| Più formatter in competizione | Diff inatteso al salvataggio | Identifica il formatter selezionato prima di disabilitare strumenti a caso. |
| Sync propone di sostituire dati | La direzione dell’operazione non è chiara | Annulla e verifica origine, destinazione e backup disponibili. |

## Collegamenti a IronMath

In un monorepo l’impostazione che riguarda l’editor non equivale alla configurazione applicativa. Cambiare word wrap non cambia il build di `apps/web`; cambiare una variabile di build può cambiare invece gli endpoint incorporati nel frontend. Non mettere credenziali applicative nelle impostazioni condivise per comodità.

Una convenzione di progetto deve essere revisionabile e motivata. Una preferenza personale, come la dimensione del carattere, non deve diventare automaticamente un requisito imposto a tutti.

## Esercizio senza LLM

Nella copia del lab descrivi due possibili valori di word wrap e prevedine l’effetto su Markdown e testo semplice. Esegui il confronto, conserva una nota del prima/dopo e ripristina lo stato iniziale. Scrivi un caso nel quale sceglieresti User e uno nel quale sceglieresti Workspace, con motivazione.

## Domande di autoverifica

Perché leggere un singolo `settings.json` può non bastare? Qual è la differenza tra ritorno a capo visivo e reformatting del file? Che cosa dimostra un confronto con un profilo vuoto? Perché Settings Sync e Git risolvono problemi diversi?

## Glossario

**Scope**: ambito di applicazione. **Override**: valore che sostituisce un altro valore secondo la precedenza. **Profilo**: raccolta di personalizzazioni. **JSONC**: JSON con commenti. **Formatter**: strumento che riscrive la forma del codice o del testo.

## Fonti e versioni

Fonti Microsoft collegate, consultate l’8 settembre 2026. VS Code installato: 1.136.1. La fixture è sintetica; nessun setting o elenco di estensioni personale è stato letto o applicato. L’inventario completo del profilo è ancora da ricevere. Testo originale Atlas, draft.
