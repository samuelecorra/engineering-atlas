# ADR-0005 — Solo locale, senza pubblicazione

Stato: parzialmente superato da [ADR-0006](ADR-0006-public-github-repository.md) · Data: 2026-09-05

Decisione storica della prima inizializzazione. La successiva richiesta dell'utente autorizza la repository pubblica GitHub, il remote ufficiale e il push iniziale. I divieti di sito, workflow e deploy restano attivi.

## Contesto

Atlas è una source of truth personale.

## Decisione

Nessun workflow, sito, deploy, remote o push. Entry point .mjs senza dipendenze npm.

## Conseguenze

I remote dei lab sono directory bare locali sotto .lab-runs; i sibling restano immutati.
