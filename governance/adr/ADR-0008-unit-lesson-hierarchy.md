# ADR-0008 — Unità e lezioni con ownership unica

Data: 2026-09-05. Stato: accepted. Autorità: richiesta esplicita dell'utente di migrare solo i sette starter module.

La gerarchia canonica diventa corso → modulo → unità → lezione. Materia e corso sono la stessa entità. Una roadmap è una proiezione ordinata del grafo che referenzia ID, non un nuovo contenitore di lezioni né un secondo insieme di record canonici.

Ogni modulo mantiene il proprio ID e referenzia `unit_ids`. Ogni `unit.json` ha un unico `module_id` e referenzia `lesson_ids`. Ogni `lesson.json` ha un unico `unit_id`, slug e `content_path: lesson.md`; path e ID sono risolti dal modello. Schemi chiusi per unit e lesson; quello module aggiunge `unit_ids`. Le versioni schema restano 1.0.0 in questa migrazione atomica del repository pre-release; vecchi record module senza unit_ids ora falliscono esplicitamente, senza conversione runtime implicita.

La slice attuale ha una U01 e una L01 per ciascuno dei sette moduli. Il Markdown viene spostato sotto `units/<id>-<slug>/lessons/<id>-<slug>/`; cambia solo la risoluzione dei link locali. Outcome e asset di esercitazione restano proprietà del modulo, senza replicarli in tre livelli di metadata. Gli ID assessment restano invariati. Lab, assessment Markdown/JSON e fixture restano nel modulo: l'assessment valuta l'intero insieme di outcome e le fixture servono il lab del modulo. I runner mantengono i loro path e vengono rieseguiti.

Il grafo aggiunge 7 nodi unit, 7 lesson e 14 archi `PART_OF` dal figlio al proprietario. Non si introduce `CONTAINS`, che duplicherebbe la relazione inversa. Il DAG dei corsi resta immutato. Indici e report riportano ID, stati e path senza copiare testi integrali.

Validator e test verificano pattern ID, parent reciproci, path, unicità, orfani, Markdown presente, allineamento del grafo e starter boundary. Nessuna directory viene creata per gli item soltanto planned; nessun draft viene promosso e nessuna mastery viene attribuita. Resta richiesta una review didattica successiva.
