# Lifecycle del contenuto

```text
planned → draft → reviewed → validated → deprecated
                  ↘ deferred
```

| Stato | Evidenza richiesta |
| --- | --- |
| planned | Metadata e outcome, nessuna lezione |
| draft | Contenuto autoriale presente; review ancora da svolgere |
| reviewed | `review_record`: autore della review, data, note tecniche e didattiche |
| validated | `validation_record`: assessment del contenuto, controlli, data ed esito |
| deferred | `deferral_reason` esplicita, fuori scope attuale |
| deprecated | `superseded_by` verso un ID esistente e nota di migrazione |

Le transizioni si discutono nel diff e si verificano contro lo stato precedente. I validator controllano lo stato corrente, non deducono una storia di review assente. Gli stati course sono planned e in_progress in questa tranche; possono essere in_progress soltanto i corsi con moduli autorizzati nello scope. Le skill restano planned; i sette starter e il solo EAT-021-M01 di ADR-0010 possono essere draft. Una promozione di stato richiede una tranche successiva autorizzata. Lo stato validated del contenuto non è learner mastery.
