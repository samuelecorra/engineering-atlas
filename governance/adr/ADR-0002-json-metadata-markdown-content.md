# ADR-0002 — JSON canonico e Markdown autoriale

Stato: accepted · Data: 2026-09-05

## Contesto

Servono controlli meccanici e contenuti leggibili.

## Decisione

JSON Schema 2020-12 per i metadata; assessment.json accanto ai quattro file richiesti per evitare metadata nascosti nel Markdown. Gli indici contengono soltanto ID, titolo, status, path.

## Conseguenze

Il validator standard library supporta soltanto le keyword effettivamente presenti e rifiuta keyword sconosciute. La prima slice Node/Python integra alcuni argomenti iniziali senza eliminare i moduli di approfondimento richiesti.
