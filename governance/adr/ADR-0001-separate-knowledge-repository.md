# ADR-0001 — Separazione del repository di conoscenza

Stato: accepted · Data: 2026-09-05

## Contesto

Il curriculum deve evolvere senza cambiare il prodotto.

## Decisione

Atlas contiene riferimenti a IronMath e SSRI, senza copie di codice o dipendenze runtime.

## Conseguenze

I path source non devono esistere nel clone Atlas.
