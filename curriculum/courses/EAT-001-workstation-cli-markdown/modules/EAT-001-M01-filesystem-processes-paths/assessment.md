# Assessment — EAT-001-M01

Assessment ID: ASM-EAT-001-M01
Module ID: EAT-001-M01

## Target mastery

Target: M2

M2 — Apply with guidance: task delimitato con checklist, esito verificato e spiegazione. Non dimostra ancora autonomia M3 o manutenzione M4. Nessun livello personale è registrato da questo documento.

## Task autentici

Un collega riceve “file non trovato” avviando la stessa fixture da una cartella diversa. Ricostruisci le due cwd, prepara due invocazioni corrette equivalenti e dimostra che il contenuto non cambia. Associa poi il PID del solo processo loopback alla sua porta e spiega il suo termine.

## Vincoli

Usa una nuova fixture offline, dati sintetici e soltanto i path assegnati. Il primo tentativo è senza LLM; lesson e checklist sono ammesse. Registra gli hint ricevuti. Il reviewer può chiedere una spiegazione orale o un nuovo dato equivalente, ma non sostituire il tuo lavoro con una soluzione.

## Evidenza richiesta

- Trascrizione sanitizzata con cwd, comando, stdout, stderr ed exit code.
- Tabella che collega PID, porta e processo locale senza terminare processi altrui.

## Rubric analitica

| ID / criterio | 0 punti | 1 punto | 2 punti |
| --- | --- | --- | --- |
| R1 — Cwd e risoluzione path | Non produce evidenza o interpreta il comportamento in modo errato. | Completa il task con checklist, ma la diagnosi richiede un hint ulteriore. | Completa con checklist, predice il risultato e spiega errore e verifica. |
| R2 — Interpretazione di stream ed exit code | Non produce evidenza o interpreta il comportamento in modo errato. | Completa il task con checklist, ma la diagnosi richiede un hint ulteriore. | Completa con checklist, predice il risultato e spiega errore e verifica. |
| R3 — Associazione PID e porta e confine read-only | Non produce evidenza o interpreta il comportamento in modo errato. | Completa il task con checklist, ma la diagnosi richiede un hint ulteriore. | Completa con checklist, predice il risultato e spiega errore e verifica. |

## Pass rule

Soglia: 5/6, con nessun errore bloccante. Ogni criterio vale al massimo 2. Un comando verde senza spiegazione non ottiene il punteggio pieno. Il reviewer verifica gli artifact e registra data, punteggi, esito e aiuti, separatamente dal semplice check automatico.

## Errori bloccanti

- Modifica file fuori dalla directory fixture assegnata.
- Usa credenziali reali o sostituisce il tentativo personale con una soluzione LLM.

## Retry policy

Ripeti su una nuova fixture, annota la causa del fallimento e conserva entrambe le prove. Attendi una nuova valutazione prima di attribuire il livello.

## Autovalutazione separata dalla valutazione

Scrivi prima la tua stima per ciascun criterio, una difficoltà e la prova che ritieni più forte. Il reviewer compila una valutazione distinta basata sugli artifact; confrontate le differenze senza sovrascrivere l’autovalutazione. Il profilo reale non viene creato o aggiornato da Atlas.
