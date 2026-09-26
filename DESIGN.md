---
name: Engineering Atlas
description: Un atlante cartografico per esplorare il curriculum e uno spazio calmo per studiarlo.
colors:
  ground: "#00121f"
  surface: "#0b2330"
  ink: "#f6f6f6"
  muted: "#becdd6"
  rule: "#344953"
  accent: "#baf863"
  accent-ink: "#112008"
  map-line: "#70858f"
  grid: "#243943"
  danger: "#ffbcac"
  focus: "#e0ff9b"
  light-ground: "#f3f7f8"
  light-surface: "#e6eef0"
  light-ink: "#152b34"
  light-muted: "#425c68"
  light-rule: "#a7b9c1"
  light-accent: "#345d0a"
  light-accent-ink: "#fff"
  light-map-line: "#647e89"
  light-grid: "#cbd9de"
  light-danger: "#8b2914"
  light-focus: "#345d0a"
  syntax-keyword: "#f3a8cf"
  syntax-string: "#82dce8"
  syntax-number: "#f1d181"
  syntax-comment: "#9badb7"
  light-syntax-keyword: "#7040a0"
  light-syntax-string: "#06677d"
  light-syntax-number: "#a54116"
  light-syntax-comment: "#49616d"
typography:
  display:
    fontFamily: "Nanum Gothic, sans-serif"
    fontSize: "clamp(2rem, 2.6vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Nanum Gothic, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
  section:
    fontFamily: "Nanum Gothic, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  reading:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "JetBrains Mono Variable, monospace"
    fontWeight: 400
rounded:
  compact: "4px"
  control: "5px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  section: "32px"
  page: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.control}"
    padding: "14px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
    padding: "12px 18px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    padding: "8px 0"
  search-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 13px"
    height: "44px"
  content-status:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.compact}"
    padding: "3px 9px"
  content-status-draft:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
    rounded: "{rounded.compact}"
    padding: "3px 9px"
  node-detail:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
    padding: "24px"
---

# Design System: Engineering Atlas

## Overview

**Creative North Star: "Atlante orbitale di lavoro"**

Un piano blu-nero, regole cartografiche sottili e segnali lime rendono visibili relazioni e selezione. Il carattere è preciso, adulto e tecnico: la geometria organizza dati reali, mentre il testo conserva nomi canonici, gerarchia e significato degli stati. Questa formulazione descrive la direzione orbitale già approvata in [surface brief](apps/web/.impeccable/surfaces/apps-web-src-app-tsx.md).

La densità cambia con l'attività. Esplorazione e navigazione rendono confrontabili molte entità; il reader offre testo misurato, spaziatura distesa e un indice. I vincoli visivi duraturi di [PRODUCT.md](PRODUCT.md) sono leggibilità, accesso da tastiera, movimento funzionale e distinzione esplicita fra consultazione, stato del contenuto e mastery.

**Key Characteristics:**

- Fondo blu-nero e superfici tonali, con un solo accento operativo.
- Titoli Nanum Gothic, testo Manrope e identificatori JetBrains Mono.
- Regole sottili, controlli quasi squadrati e icone SVG autoriali.
- Geometria cartografica per esplorare; misura di lettura contenuta per studiare.
- Stati nominati e alternative accessibili alla mappa.

Questa è una registrazione dell'implementazione locale in `apps/web`, estratta da [styles.css](apps/web/src/styles.css) e dai componenti, con riscontri nelle catture in `.impeccable/review/`. La review indipendente comunicata per questa tranche considera risolte le quattro correzioni visive richieste e non segnala regressioni materiali. Il gate formale della hero resta aperto: il controllo della regione pixel riporta 79,94%, con posizioni cambiate dal testo canonico completo e dalla rimozione dell'eyebrow. Questo documento non dichiara concluso il processo di design né equivale ad approvazione formale.

## Colors

Il blu-nero mantiene la superficie operativa profonda; il lime segnala azione e selezione dentro una gamma di neutri freddi. I valori normativi, incluse le varianti chiare, sono nel frontmatter.

Le rampe tonali del [sidecar](.impeccable/design.json) sono campioni OKLCH sintetizzati per il pannello di documentazione; non sono token implementati né estendono la palette dell'applicazione.

### Primary

- **Lime operativo** (`accent`): azione principale, collegamenti, selezione, archi coinvolti e stato draft scritto per esteso.
- **Inchiostro sul lime** (`accent-ink`): testo dell'azione piena e selezione del testo.
- **Lime di focus** (`focus`): contorno di tastiera distinguibile dai bordi ordinari.
- Nel tema chiaro, i ruoli corrispondenti usano verde scuro e testo bianco. Il ruolo del colore rimane stabile.

### Neutral

- **Blu-nero di lavoro** (`ground`): fondo della pagina, intestazione e interno dei nodi.
- **Piano blu rialzato** (`surface`): navigazione attiva, risultato di ricerca, dettaglio del nodo e codice.
- **Bianco tecnico** (`ink`) e **grigio ghiaccio** (`muted`): testo principale e spiegazioni secondarie.
- **Regola ardesia** (`rule`): divisori e contorni; **traccia cartografica** (`map-line`): relazioni non selezionate; **griglia profonda** (`grid`): guide geometriche decorative.
- Il tema chiaro sostituisce questi stessi ruoli con fondo quasi bianco, superfici azzurrate e inchiostro scuro.
- **Avviso corallo** (`danger`): avviso di storage non disponibile; non rappresenta un livello di competenza.

**The Selection Rule.** L'accento evidenzia elementi attivi, azioni e stati espliciti; non riempie indiscriminatamente le superfici. Una relazione evidenziata indica il contesto selezionato, non un avanzamento personale.

**The Named State Rule.** Colore e geometria accompagnano sempre un nome di stato o una semantica accessibile. Draft, pianificato e letto conservano significati distinti.

## Typography

**Display Font:** Nanum Gothic, fallback sans-serif, peso 700 disponibile localmente.

**Body Font:** Manrope Variable, fallback sans-serif.

**Label/Mono Font:** JetBrains Mono Variable, fallback monospace, per ID e codice; le etichette linguistiche rimangono Manrope.

**Character:** titoli compatti e netti, testo corrente aperto, identificatori allineabili. Non esiste una scala proporzionale unica: i ruoli rispondono a navigazione, contenuto e lettura.

### Hierarchy

- **Display:** titolo delle pagine di curriculum, fluido secondo il token `display`, con misura massima di 28ch.
- **Headline:** titolo ordinario della pagina secondo `headline`. Il titolo dell'inspector usa la stessa dimensione e peso, con interlinea 1,25; l'ID selezionato misura 1,375rem. Sul mobile il titolo dell'inspector passa a 1,8rem.
- **Section / Title:** sezioni in Nanum Gothic; sottotitoli ordinari in Manrope semibold. Il reader adatta dimensioni e margini alla gerarchia del documento.
- **Body / Reading:** interfaccia secondo `body`; articolo secondo `reading`, su una colonna fino a 72ch. Sotto 768px il testo dell'articolo usa 1rem e interlinea 1,8.
- **Label / Mono:** metadata compatti senza maiuscolo artificiale o tracking decorativo. Gli ID SVG usano 14 unità del viewBox, quindi la misura visibile dipende dalla scala della mappa; il nome canonico selezionato è annotato in Manrope su più righe.

**The Identity Rule.** Il nome canonico deve restare completo nell'inspector e nell'annotazione selezionata; l'ID monospaziato lo accompagna e non lo sostituisce nei contesti di comprensione.

## Layout

La struttura desktop usa intestazione a tutta larghezza (74px), navigazione laterale (17,45% del viewport) e contenuto. Nella superficie esplorativa il contenuto si divide in mappa flessibile e inspector al 24,8% del contenuto. I confini sono regole, senza annidare ogni regione in una card. Questa composizione appartiene all'esploratore; le nuove superfici mantengono la gerarchia del guscio senza dover replicare l'orbita.

La spaziatura ricorrente è nel frontmatter. Liste e sezioni adottano divisori e ritmo verticale; le pagine di contenuto hanno un limite di 1400px e padding desktop laterale di 48px. Il reader arriva a 1440px complessivi: testo fino a 72ch e indice laterale, separati da 56px. A 1280px il padding si riduce e l'indice usa una colonna di 185px.

- **Fino a 1280px:** navigazione laterale di 210px, inspector di 280px, spazi esterni ridotti.
- **Fino a 1023px:** navigazione orizzontale sotto l'intestazione; la vista iniziale dell'esploratore è l'elenco accessibile. La scelta dell'utente consente comunque la mappa. Il default è valutato all'apertura del componente, non reimposto a ogni ridimensionamento.
- **Fino a 767px:** ricerca sulla seconda riga; inspector sotto l'esploratore; pagine con padding laterale di 24px. L'indice del reader precede l'articolo ed è inizialmente chiuso. Le righe di curriculum vanno a capo. La mappa opzionale conserva spazio di disegno e scorrimento interno.

**The Reading Measure Rule.** Il reader limita la misura del testo e confina lo scorrimento orizzontale a codice, tabelle, formule e mappa opzionale. L'indice e i controlli rimangono raggiungibili da tastiera.

## Elevation & Depth

Il sistema usa soprattutto fondo, superficie e regole di separazione. La griglia orbitale è un riferimento spaziale in SVG; non usa immagini raster, blur o glassmorphism. I contenitori ordinari non hanno ombre. Il popup della ricerca usa l'ombra ambientale `0 12px 24px #0004` per distinguersi dal contenuto che copre; questa eccezione non è lo stile delle pagine.

**The Tonal Plane Rule.** I contenuti persistenti si separano con tono, spazio e regole. L'ombra ambientale appartiene al livello temporaneo della ricerca.

## Shapes

I controlli sono quasi squadrati, con i raggi compatti nel frontmatter; il codice inline usa un piccolo raggio di 3px. La voce attiva della navigazione desktop arrotonda solo il lato destro a 6px, mentre la navigazione orizzontale torna squadrata. I divisori ordinari sono di 1px.

I cerchi hanno un ruolo cartografico: nodi, anelli di selezione e guide orbitali. Restano parte nativa di questo mondo e non sono vietati dalla forma squadrata dei controlli. Le icone sono SVG autoriali a tratto, con viewBox 24 × 24, spessore 1,5 e terminali arrotondati. La dimensione cambia secondo il controllo; non si usano caratteri tipografici come icone.

## Components

### Buttons

Comandi netti e leggibili, con etichetta testuale quando l'azione lo richiede.

- **Primary:** accento pieno, testo `accent-ink`, geometria e padding del token; altezza minima 50px e peso 700. Il passaggio del puntatore mescola il colore d'accento con bianco al 15%.
- **Secondary:** fondo trasparente, bordo `rule`, altezza minima 48px. Hover porta bordo e testo all'accento; lo stato premuto usa testo accentato e `aria-pressed`.
- **Quiet:** azione testuale con eventuale icona, senza bordo; il colore passa da `muted` ad `accent` in hover. Sul mobile i controlli della vista hanno altezza minima 44px.
- **Focus / Disabled:** contorno di focus da 2px con offset 5px; disabilitato con opacità 0,45 e semantica nativa. Lo zoom conserva controlli distinti per riduzione, aumento e adattamento.

### Chips

Le etichette di stato sono compatte, rettangolari, trasparenti e bordate. Il draft usa testo accentato; il pianificato resta attenuato. La parola è sempre visibile. Non sono badge di achievement né comandi cliccabili.

### Cards / Containers

La forma prevalente è la sezione o riga separata da regole. Il dettaglio di un nodo del grafo usa una superficie tonale, raggio compatto e padding di 24px, senza ombra. L'inspector orbitale è una colonna della pagina con divisore, non una card flottante.

### Inputs / Fields

La ricerca nel masthead è un campo trasparente con contorno, icona SVG e placeholder leggibile, alto 44px. Ha una label accessibile. I filtri del grafo usano fondo `surface`, bordo e padding di 12px. Focus usa il contorno comune. I risultati appaiono nel popup tonale con conteggio o messaggio vuoto; Escape svuota la ricerca e un comando consente di chiuderla. L'interfaccia non stabilisce una variante di campo invalido: gli errori osservati sono messaggi di pagina o di storage.

### Navigation

La voce corrente unisce superficie tonale, icona accentata e indicatore laterale di 4px; nella barra orizzontale l'indicatore diventa una linea inferiore di 2px. Le breadcrumb vanno a capo. I tab del documento usano testo accentato e sottolineatura di 2px per il corrente. Il link iniziale per saltare al contenuto compare al focus; la navigazione di route trasferisce il focus al landmark principale.

### Orbital course map and inspector

La mappa è un diagramma SVG generato da corsi e archi reali. Cerchi e tacche di fondo sono decorativi. Gli archi di prerequisito sono continui e direzionati; i consigliati, visibili su richiesta, sono tratteggiati. Il nodo selezionato ha doppio anello, ID accentato e annotazione del nome completo; l'inspector presenta ID, titolo, stato, azione e spiegazioni distinte di coverage, target e mastery.

Focus, clic, Invio e Spazio selezionano; frecce, Home ed End spostano il focus tra i corsi. Una zona di interazione più ampia del punto e un contorno tratteggiato sostengono il focus. L'elenco offre selezione e link diretto al corso. Il movimento riguarda solo colore e spessore dei tratti (180ms, `cubic-bezier(.16,1,.3,1)`) quando `prefers-reduced-motion` consente animazioni; lo stato è leggibile anche senza transizione.

### Reader and reading state

L'articolo conserva titoli, liste, link, codice, tabelle e formule del contenuto autoriale. L'indice elenca le sezioni di secondo livello; la nota draft rimane adiacente. Codice e tabelle hanno regioni scorrevoli raggiungibili da tastiera. Il comando di lettura registra consultazione locale con uno stato premuto esplicito. La pagina di studio distingue questa consultazione dalla mastery personale, che rimane non valutata senza evidenze.

Estensione dell’8 settembre: i callout mantengono il bordo sinistro d’accento della citazione, con fondo `surface`, testo `ink` e titolo esplicito. Gli errori matematici lasciano un avviso testuale sottolineato a onda e non nascondono l’articolo. L’evidenziazione del codice conserva caratteri e indentazione: keyword `#f3a8cf`, stringhe/attributi `#82dce8`, numeri/titoli `#f1d181`, commenti `#9badb7`; nel tema chiaro rispettivamente `#7040a0`, `#06677d`, `#a54116`, `#49616d`. Questi colori distinguono sintassi, senza assegnare significati di stato. Le catture di questa estensione sono in `.impeccable/review/2026-09-08/`; non sostituiscono le evidenze né chiudono il confronto formale della hero precedente.

### Empty, loading and error states

Le pagine non disponibili mantengono titolo, spiegazione e percorso utile per proseguire. Il caricamento espone `aria-busy` e un messaggio di stato; il catalogo non disponibile propone Riprova. Il contenuto pianificato spiega l'assenza di materiale e non imita una lezione esistente. Un problema di storage riceve una nota testuale corallo, senza trasformare lo stato di lettura in evidenza di abilità.

## Do's and Don'ts

### Do:

- **Do** usare i ruoli della palette in entrambi i temi e mantenere contrasto tra testo, superficie e focus.
- **Do** conservare nomi canonici completi, ID riconoscibili e significati espliciti degli stati.
- **Do** rappresentare relazioni con dati canonici e offrire un percorso da tastiera e in elenco.
- **Do** limitare la misura del reader e lasciare a codice, tabelle e formule il proprio scorrimento.
- **Do** mantenere la selezione comprensibile quando il movimento è disattivato.

### Don't:

- **Don't** rappresentare consultazione, coverage SSRI o target IronMath come mastery personale.
- **Don't** trasformare la griglia cartografica in una decorazione obbligatoria del reader.
- **Don't** aggiungere eyebrow decorativi, icone-glyph, ombre rigide o superfici glass senza un'esigenza del sistema.
- **Don't** introdurre gradienti viola/blu generici, gamification infantile o card annidate senza ragione.
- **Don't** sostituire il diagramma navigabile con un raster o inventare archi per somigliare al mock.

Non canonizzato: lo scostamento residuo del gate pixel della hero non diventa una regola di composizione o una dichiarazione di conformità. L'eyebrow rimosso non fa parte del sistema. Il mock raster approvato è un riferimento di processo; l'applicazione costruita usa SVG autoriali e dati, senza asset raster distribuiti.
