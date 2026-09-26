# Definition of Done

Una modifica è verificabile quando ID, tipi, enum, riferimenti, evidence, taxonomy e ownership sono validi; grafo e prerequisiti concordano con course e scope, il required DAG è aciclico e rispetta l'ordine. Gli artifact generati devono essere freschi byte per byte. I link locali devono risolvere anche su filesystem case-sensitive.

Baseline: 52 skill, 20 corsi e sette moduli draft. ADR-0010 aggiunge EAT-021, un modulo, due unità e quattro lezioni draft; nessun contenuto fuori dagli ID dello scope. Ogni lesson ha tutte le sezioni e al massimo 2800 parole: soglia che consente esempi e recovery ma mantiene una sessione circoscritta. Una lesson sotto soglia non è automaticamente di qualità. Rubric e acceptance criteria devono discriminare errori reali; niente soluzioni complete immediatamente dopo i task.

Eseguire i comandi del README, incluse fixture offline Git/Node/Python. Nessun file vuoto, placeholder generico, secret riconoscibile, workflow o hosting. Il rilevatore secret è euristico: controllare anche il diff, senza pretendere una prova assoluta di assenza. Registrare ambiente effettivamente testato; le equivalenze Windows non sono un test su Windows.

Non creare progress reale o dichiarazioni personali di padronanza. Una review didattica umana resta necessaria per uscire da draft. Nel rapporto finale indicare conteggi, test, drift, commit e decisioni rinviate.

La tranche locale di ADR-0009 aggiunge il gate `npm run check`: include provenance, gerarchia, dati web freschi, lint/test/build del solo workspace `apps/web`, prove Chromium e `git diff --check`. Prima esegui l’installazione delle dipendenze e del browser indicata nel README. I test browser non richiedono il profilo personale e non certificano accessibilità universale o padronanza del curriculum. Registra separatamente eventuali limiti dei confronti visuali e il verdetto della review Impeccable.

Il controllo `npm run check:markdown` usa la pipeline del reader e deve passare prima della build web. La completezza di un corso richiede copertura del programma, esercizi e review: conteggi e test tecnici non certificano il “100%”.
