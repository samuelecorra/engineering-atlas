# ADR-0005 — Solo locale, senza pubblicazione

Stato: accepted · Data: 2026-09-05

## Contesto

Atlas è una source of truth personale.

## Decisione

Nessun workflow, sito, deploy, remote o push. Entry point .mjs senza dipendenze npm.

## Conseguenze

I remote dei lab sono directory bare locali sotto .lab-runs; i sibling restano immutati.
