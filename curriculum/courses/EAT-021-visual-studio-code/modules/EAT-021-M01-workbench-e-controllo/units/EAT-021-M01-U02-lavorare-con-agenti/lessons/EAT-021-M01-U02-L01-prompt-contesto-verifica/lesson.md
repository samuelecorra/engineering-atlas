# Dal prompt al diff: mantenere il controllo

## Perché questa skill serve

Un agente può produrre una modifica plausibile e avere comunque lavorato sul file sbagliato, usato un’API obsoleta o saltato una verifica. La capacità professionale consiste nel dirigere il lavoro e valutarne le prove. Scrivere un prompt efficace è una parte del processo; leggere il risultato e saperlo spiegare è l’altra.

Questa lezione introduce un metodo comune. Le guide complete alle GUI di Copilot, Codex e Claude Code avranno moduli distinti: account, piani, comandi e permessi non si possono trattare come se fossero identici.

## Outcome osservabili

Sai trasformare una richiesta ampia in un task delimitato; scegliere i file di contesto; specificare comportamento atteso e verifiche; leggere il diff ricevuto; distinguere un controllo eseguito da una semplice affermazione dell’agente. Sai interrompere una direzione sbagliata con una correzione concreta.

## Prerequisiti

Saper distinguere file, workspace e processo. L’esercizio principale è su carta o in un file locale e non richiede abbonamenti. Una prova con agente è opzionale e successiva al tentativo personale.

## Modello mentale

Un task verificabile collega cinque elementi:

```text
problema osservato
  → contesto pertinente
  → modifica delimitata
  → prova del comportamento
  → review e decisione umana
```

L’output dell’agente è una proposta accompagnata da evidenze. «Ho sistemato tutto» non è una prova; «il test X riproduceva il caso Y, ora passa con questa modifica» è una dichiarazione che puoi controllare.

Distingui inoltre **modello**, **strumenti**, **permessi** e **sessione**. Il modello produce ragionamento e proposte; gli strumenti permettono di leggere o agire; i permessi delimitano cosa è consentito; la sessione conserva il contesto disponibile. Un modello capace non compensa automaticamente il contesto sbagliato.

## Concetti e comandi essenziali

### Un prompt che rende visibile il lavoro

Descrivi il risultato osservabile, la situazione attuale e il bersaglio. Indica poi vincoli e controlli. Non serve una prosa solenne: serve poter decidere se il task è riuscito.

Esempio autoriale per un esercizio su una copia del progetto:

```text
Obiettivo: mostrare i blocchi JavaScript di una lezione con sintassi evidenziata,
conservando esattamente indentazione e testo copiabile.

Contesto: leggi il componente Reader, la configurazione Markdown e i test
che coprono matematica e blocchi di codice. Usa i file canonici del progetto.

Perimetro: modifica solo il reader e i test pertinenti. Non eseguire il codice
contenuto nelle lezioni. Non introdurre servizi remoti.

Criteri: codice inline distinto dai blocchi; linguaggio sconosciuto leggibile;
formule ancora corrette; nessun overflow orizzontale dell’intera pagina.

Procedura: riproduci prima il caso, proponi la modifica minima coerente,
esegui i controlli e mostra il diff con limiti o test non eseguiti.
```

La richiesta non detta il nome di ogni funzione. Lascia spazio alle scelte implementative ma rende controllabile il risultato. Le [best practice Microsoft](https://code.visualstudio.com/docs/agents/best-practices) raccomandano contesto pertinente e task chiari; i criteri sopra sono specifici del problema Atlas.

### Scegliere il contesto

Un file aperto non garantisce che tutto il repository sia nel contesto del modello. Seleziona i file che spiegano la causa e il contratto: componente, chiamante, test e istruzioni applicabili. Chiedi che l’agente distingua file letti e ipotesi ancora da verificare.

Aggiungere cento report può nascondere il contratto sotto materiale ripetuto. Parti da pochi riferimenti e amplia la lettura quando una domanda concreta lo richiede. Per il task di esempio, una guida al database non aiuta a spiegare la perdita di indentazione.

### Le GUI non sono equivalenti

| Prodotto | Primo orientamento | Prova da cercare nel lavoro |
| --- | --- | --- |
| Copilot / chat di VS Code | Riconosci la superficie di chat e le opzioni della sessione disponibili. Aggiungi riferimenti mirati con i controlli di contesto documentati. | File coinvolti, modifiche proposte e risultati degli strumenti. |
| Codex per IDE | Distingui l’estensione da app e CLI; verifica contesto e impostazioni della sessione effettiva. | Diff e controlli realmente eseguiti sul workspace indicato. |
| Claude Code per VS Code | Riconosci pannello, riferimenti ai file e modalità indicata nella sessione. | Piano o modifiche, richieste di permesso previste da quella modalità e review del risultato. |

Fonti: [chat di VS Code](https://code.visualstudio.com/docs/chat/chat-overview), [Codex IDE](https://learn.chatgpt.com/docs/codex/ide), [Claude Code per VS Code](https://code.claude.com/docs/en/vs-code). Le opzioni possono dipendere da versione, piano e policy. Non dedurre dallo screenshot quale abbonamento sia attivo.

Un’autorizzazione a leggere non è un’autorizzazione a pubblicare. Se vuoi solo una diagnosi, dichiaralo. Se vuoi una correzione locale, indica i confini e il criterio di successo. Evita formule generiche come «fai qualsiasi cosa serva» quando non intendi concedere azioni su account o produzione.

### Leggere il diff prima della conclusione

Ispeziona i file modificati, non soltanto il riepilogo. Controlla che il diff risponda al problema, che non cancelli lavoro preesistente e che i test esercitino l’errore reale. Un test che copia l’implementazione può passare anche quando entrambe sono sbagliate.

Classifica il risultato con precisione: **eseguito e passato**, **eseguito e fallito**, **non eseguito**. Se una prova richiede un servizio non disponibile, il limite deve restare visibile. La [review delle modifiche in VS Code](https://code.visualstudio.com/docs/sourcecontrol/overview) offre la superficie di ispezione; la decisione richiede comprendere il contenuto.

## Esempio svolto

La richiesta «crea tutti i corsi completi e perfetti» esprime una direzione, ma non consente di verificare una singola consegna. Una tranche verificabile può essere:

```text
Scrivi la prima unità del corso VS Code: interfaccia, workspace e impostazioni.
Una lezione per argomento, con prerequisiti, esempio, esercizio e recovery.
Verifica i nomi dei comandi sulle fonti ufficiali e dichiara la versione.
Mantieni draft il contenuto e planned gli argomenti non ancora scritti.
La guida alle mie estensioni usa soltanto l’export che fornirò.
Apri le lezioni nel reader e verifica codice, link e formule presenti.
```

Questo rende possibile una review didattica: puoi aprire una lezione, svolgere l’esercizio e indicare precisamente ciò che manca. Il corso completo emergerà da tranche che coprono il programma; non da una dichiarazione di completezza.

## Failure mode e recovery

- **L’agente inventa un setting**: chiedi il riferimento primario della versione e una prova della sua disponibilità. Non aggiungere la chiave al profilo per tentativi.
- **La richiesta cresce durante il lavoro**: conserva l’obiettivo iniziale, indica cosa cambia e separa ciò che viene rinviato.
- **La soluzione tocca troppi file**: chiedi una spiegazione dei cambiamenti necessari e rivedi quelli senza relazione con il problema.
- **L’agente dichiara test verdi senza output verificabile**: richiedi comando, esito e ambiente. Un’intenzione di testare non è un test.
- **Non capisci il diff**: chiedi una spiegazione causale e un controesempio. Non approvare soltanto perché l’output è lungo o sicuro nel tono.

## Collegamenti a IronMath

Un primo task utile consiste nel leggere `core-bundle-ci.yml` e un workflow di deploy, identificare trigger, job, dipendenze e verifiche, poi spiegare se il deploy attende davvero la CI. Nei [workflow al commit 57b81c9](https://github.com/samuelecorra/ironmath/tree/57b81c9aa4f203195224169127b46e54493088e1/.github/workflows) questi aspetti sono osservabili nel codice. Lo stato effettivo di produzione richiederebbe altre evidenze: non si deduce dalla sola presenza dei file YAML.

## Esercizio senza LLM

Scrivi un prompt per diagnosticare una scheda che non trova più un file. Includi bersaglio, prove da raccogliere, azioni ammesse, criterio di conclusione e limite che obbligherebbe a fermarsi. Confrontalo con un secondo prompt che chiede invece di modificare un file della fixture: quali permessi e verifiche cambiano? Soltanto dopo, se vuoi, usa un agente per criticare i due prompt senza eseguire azioni.

## Domande di autoverifica

Che cosa manca a «ottimizza il progetto»? Come verifichi che una fonte sia stata letta? Perché cambiare modello non risolve un workspace errato? Qual è la differenza tra piano approvato e risultato verificato? Che cosa dovresti spiegare personalmente prima di accettare un diff?

## Glossario

**Contesto**: informazioni disponibili alla sessione. **Tool**: operazione che l’agente può invocare. **Permesso**: confine dell’azione consentita. **Criterio di accettazione**: comportamento osservabile richiesto. **Handoff**: consegna di stato, prove e lavoro restante a chi prosegue.

## Fonti e versioni

Fonti primarie Microsoft, OpenAI e Anthropic collegate e consultate l’8 settembre 2026. Il testo non attribuisce all’utente piani a pagamento, modelli o estensioni non verificati. Gli esempi di prompt sono originali Atlas; non sono risultati di un assessment personale. La review didattica e la verifica completa delle singole GUI restano da svolgere nei moduli dedicati. Stato draft.
