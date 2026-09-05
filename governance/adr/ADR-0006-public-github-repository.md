# ADR-0006 — Repository pubblica GitHub

Stato: accepted · Data: 2026-09-05

## Contesto

Dopo l'inizializzazione locale verificata, l'utente richiede di creare la repository pubblica sul proprio account GitHub con informazioni iniziali coerenti, pubblicarla e poi fermarsi. Questa istruzione supera il vincolo di assenza di remote e push della prima tranche.

## Decisione

Pubblicare `samuelecorra/engineering-atlas` con branch principale `main`, README esistente aggiornato, descrizione e topic pertinenti al curriculum di software engineering. Aggiungere `origin` verso questa repository e inviare la cronologia locale verificata con un push normale. I controlli accettano l'assenza di remote oppure l'origin ufficiale HTTPS/SSH; non richiedono la rete per validarlo.

Non attivare sito, GitHub Pages, workflow di pubblicazione, deploy o servizi cloud. Nessun ampliamento della starter slice, cambio di mastery o modifica ai repository fratelli. Il package rimane privato rispetto a npm; il profilo learner reale e i workspace dei lab restano esclusi da Git. La licenza di riuso resta da scegliere e non viene aggiunta implicitamente.

## Conseguenze

README, policy, adapter e test devono descrivere la repository pubblica senza conservare un divieto assoluto di remote incompatibile con un clone GitHub. La decisione sostituisce soltanto il confine locale di ADR-0005; gli altri confini restano validi. Verificare test, freshness, visibilità pubblica e corrispondenza di `main` locale/remoto. Dopo il push iniziale fermarsi: ulteriori modifiche o push dipendono dalla prossima richiesta dell'utente.
