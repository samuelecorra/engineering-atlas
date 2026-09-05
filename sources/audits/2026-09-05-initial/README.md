# Audit iniziale — snapshot storico

Questo pack conserva i tre artefatti originali forniti dall'utente: [audit](audit.md), [DAG dei corsi v0.1](course-dag.v0.1.json) e [inventario CSV compresso](source-inventory.csv.gz). Il [manifest](manifest.json) registra hash attesi e osservati, dimensioni, conteggi, preflight e provenienza. I byte originali coincidono con gli hash forniti. Il gzip ha timestamp zero e nessun filename; la decompressione è stata verificata prima di rimuovere il CSV dalla root.

Snapshot descritti: SSRI `7467a51576a7c1514edacb26d9408bf0c1444a7d`, 6310 file; IronMath `22da98929d9c70e20a5a3a9d6fabfe2bd0279431`, 4069 file. Totale: 10379 record più intestazione CSV. Non è stato eseguito un nuovo audit dei repository fratelli.

Il pack è **historical-snapshot**, **canonical: false**. Va preservato, senza riscriverlo per riflettere il presente. I vincoli operativi narrati nell'audit sono testo storico, non istruzioni correnti. La pubblicazione GitHub successiva è documentata in [ADR-0006](../../../governance/adr/ADR-0006-public-github-repository.md).

Le fonti correnti sono [repository e drift](../../repositories.json), [coverage evidence](../../evidence/ssri-coverage.json), [requirement evidence](../../evidence/ironmath-requirements.json), [skill](../../../catalog/skills), [curriculum](../../../curriculum/courses) e [knowledge graph](../../../graph/knowledge-graph.json). Indici e report sono derivati da quelle fonti, mai dal pack. Il vecchio grafo non sostituisce quello canonico: il validator confronta soltanto la proiezione dei 51 archi tra corsi, 37 required e 14 recommended.

Verifica offline: `npm run validate:provenance`, incluso in `npm run validate`. Decisione: [ADR-0007](../../../governance/adr/ADR-0007-historical-audit-provenance.md). La licenza di Atlas resta una decisione dell'utente; questo archivio non introduce una licenza del progetto.
