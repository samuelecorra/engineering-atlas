# ADR-0007 — Provenance dell'audit iniziale

Data: 2026-09-05. Stato: accepted. Autorità: richiesta esplicita dell'utente di archiviare i tre artefatti originali.

Gli originali sono input storici già usati per inizializzare Atlas. Conservarli permette di distinguere il baseline fornito dall'utente dal successivo stato canonico, senza un nuovo audit implicito dei sibling.

Si conserva il [pack](../../sources/audits/2026-09-05-initial/README.md) immutabile: Markdown e DAG identici byte per byte, CSV gzip level 9 con mtime zero e senza filename. Manifest con schema chiuso, hash originali e compressi, snapshot e conteggi; hash fissati anche nel validator per rilevare riscritture coerenti del manifest e degli artifact. Prima della rimozione del CSV è stata verificata l'uguaglianza dei byte decompressi.

Solo i due JSON storici dichiarati sono affidati al validator di provenance, senza allargare le eccezioni per JSON canonici sconosciuti. Solo il gzip dichiarato evita la scansione UTF-8 ordinaria: viene decompresso, limitato in dimensione, controllato per hash, struttura, path personali e secret dal gate. La proiezione dei 51 archi course-level deve restare uguale al DAG storico. Il pack non alimenta i generatori correnti.

Le istruzioni dell'audit sono storiche. La policy corrente e [ADR-0006](ADR-0006-public-github-repository.md) descrivono la pubblicazione successiva. Licenza Atlas pendente; nessuna licenza viene scelta implicitamente. Test avversi coprono checksum, artifact mancante, gzip corrotto, natura non canonica e deriva degli archi.

Il link nell'audit al nome originario del CSV rimane identico nei byte archiviati. Solo per quel documento il link checker risolve tale destinazione sul gzip archiviato; tutti gli altri link continuano a essere verificati normalmente. Il README del pack offre i collegamenti navigabili ai nuovi nomi.

Tre righe originali usano due spazi finali per i line break Markdown. Una regola `.gitattributes` limitata al solo audit conserva questa formattazione senza errori `blank-at-eol`; gli altri controlli whitespace restano attivi. Nessun byte storico viene normalizzato.
