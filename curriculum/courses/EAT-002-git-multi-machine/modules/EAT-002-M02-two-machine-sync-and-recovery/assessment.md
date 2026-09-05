# Assessment — EAT-002-M02

Assessment ID: ASM-EAT-002-M02
Module ID: EAT-002-M02

## Target mastery

Target: M2

M2 — Apply with guidance: task delimitato con checklist, esito verificato e spiegazione. Non dimostra ancora autonomia M3 o manutenzione M4. Nessun livello personale è registrato da questo documento.

## Task autentici

Prepara un handoff per un collega che lavora alternativamente su Mac e Windows. Per ciascuno dei tre cloni documenta la decisione prima dei comandi, verifica l’integrazione e dimostra un recupero. Il reviewer sceglie uno dei casi e ti chiede di spiegare la stessa procedura con un working tree non pulito: devi proporre come preservarlo prima, senza eseguire una riscrittura distruttiva.

## Vincoli

Usa una nuova fixture offline, dati sintetici e soltanto i path assegnati. Il primo tentativo è senza LLM; lesson e checklist sono ammesse. Registra gli hint ricevuti. Il reviewer può chiedere una spiegazione orale o un nuovo dato equivalente, ma non sostituire il tuo lavoro con una soluzione.

## Evidenza richiesta

- Log prima/dopo e decisione motivata per ciascuno dei tre scenari.
- Prova di abort e successiva risoluzione; hash preservati e checklist di sessione.

## Rubric analitica

| ID / criterio | 0 punti | 1 punto | 2 punti |
| --- | --- | --- | --- |
| R1 — Decisione ff/rebase/merge sul graph | Non produce evidenza o interpreta il comportamento in modo errato. | Completa il task con checklist, ma la diagnosi richiede un hint ulteriore. | Completa con checklist, predice il risultato e spiega errore e verifica. |
| R2 — Recovery con preservazione dei commit | Non produce evidenza o interpreta il comportamento in modo errato. | Completa il task con checklist, ma la diagnosi richiede un hint ulteriore. | Completa con checklist, predice il risultato e spiega errore e verifica. |
| R3 — Checklist, stash e upstream spiegati | Non produce evidenza o interpreta il comportamento in modo errato. | Completa il task con checklist, ma la diagnosi richiede un hint ulteriore. | Completa con checklist, predice il risultato e spiega errore e verifica. |

## Pass rule

Soglia: 5/6, con nessun errore bloccante. Ogni criterio vale al massimo 2. Un comando verde senza spiegazione non ottiene il punteggio pieno. Il reviewer verifica gli artifact e registra data, punteggi, esito e aiuti, separatamente dal semplice check automatico.

## Errori bloccanti

- Modifica file fuori dalla directory fixture assegnata.
- Usa credenziali reali o sostituisce il tentativo personale con una soluzione LLM.
- Usa force push sul branch condiviso o perde commit senza un riferimento di recupero.

## Retry policy

Ripeti su una nuova fixture, annota la causa del fallimento e conserva entrambe le prove. Attendi una nuova valutazione prima di attribuire il livello.

## Autovalutazione separata dalla valutazione

Scrivi prima la tua stima per ciascun criterio, una difficoltà e la prova che ritieni più forte. Il reviewer compila una valutazione distinta basata sugli artifact; confrontate le differenze senza sovrascrivere l’autovalutazione. Il profilo reale non viene creato o aggiornato da Atlas.
