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

Le transizioni si discutono nel diff e si verificano contro lo stato precedente. I validator controllano lo stato corrente, non deducono una storia di review assente. Gli stati course sono planned e in_progress in questa tranche; solo EAT-001, EAT-002, EAT-004, EAT-016 possono essere in_progress. Le skill restano planned; solo i sette moduli possono essere draft. Una promozione di stato richiede una tranche successiva autorizzata. Lo stato validated del contenuto non è learner mastery.
