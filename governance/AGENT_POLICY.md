# Policy canonica degli agenti

Missione: costruire un piccolo curriculum personale che collega le evidenze SSRI alla manutenzione IronMath, mantenendo separati prodotto, conoscenza e progresso personale.

## Autorità e preflight

Ordine vincolante: richiesta esplicita dell'utente; file utente preesistenti; questa policy; metadata canonici; report derivati. In caso di conflitto sostanziale preserva i file e descrivi il conflitto prima di agire.
Verifica cwd e inventario Git prima di scrivere. Lavora solo in Atlas; i sibling sono consultabili soltanto in lettura per documenti e file non sensibili. Non eseguire comandi applicativi nei sibling. Non leggere secret, chiavi, certificati, credenziali o dati personali; consulta soltanto nomi di configurazione documentati o `.env.example` sanitizzati. Non stampare l'environment completo.

## Evidenza e apprendimento

`ssri_coverage` misura la copertura documentata della fonte, mai l'abilità della persona. `ironmath_requirement` è un target. `learner_mastery` può cambiare solo con assessment e artifact osservabili, revisore, data ed esito. Non creare il profilo reale.
Ogni gap richiede evidenza SSRI (anche absence-check delimitato), evidenza IronMath, confidence e motivazione. L'assenza nel curriculum non implica assenza nell'applicazione viewer. Un nome di directory non dimostra contenuto. Un commit non disponibile resta baseline fornito dall'utente: non inventare una verifica live. Registra osservazione e drift separati, senza fetch o nuovo audit implicito.
Usa la [policy evidenze](EVIDENCE_POLICY.md) e i [confini delle fonti](SOURCE_AND_LICENSE_POLICY.md). roadmap.sh: sole label, URL, data e `taxonomy-label-only`; nessuna copia di roadmap, screenshot o descrizioni.

## Lifecycle e scope

Segui [CONTENT_LIFECYCLE](CONTENT_LIFECYCLE.md). La prima tranche contiene esattamente 52 skill, 20 corsi e i sette moduli elencati in `scope.json`. Non aggiungere contenuto fuori slice senza autorizzazione. Non creare directory per i moduli soltanto pianificati. Non promuovere draft a reviewed senza review tecnica e didattica registrata, né a validated senza assessment del contenuto e controlli verdi. Questo stato non concede mastery personale.
Il tentativo personale senza LLM precede la review opzionale con agente. Richiedi spiegazione, diagnosi e recupero; un output dell'agente non costituisce evidenza di autonomia.

## Modifiche e generated

Skill, course, module, assessment e grafo sono canonici. Lesson/lab/assessment Markdown sono autoriali. Indici e report sono generati: modificali solo tramite generatori deterministici; `check:generated` confronta byte senza scrivere. Mantieni atomiche le modifiche metadata + graph + report. Conserva le modifiche utente e registra decisioni architetturali negli ADR. Non cambiare versioni o coverage solo perché un sibling è più recente.

## Verifica e confini operativi

Prima di dichiarare conclusa una modifica: `npm run validate`, `npm test`, `npm run check:generated`, `git diff --check`; dopo modifiche canoniche rigenera indici e report. I test devono includere casi avversi e fallire sulla causa reale; non ridurli per ottenere verde. Dichiarare warning, limiti e strumenti non disponibili.
I lab sono offline e confinati alle fixture o a `.lab-runs/` dentro Atlas. Nessuna dipendenza npm, framework web, pubblicazione, hosting, Pages, workflow YAML, cloud config o dipendenza runtime da/verso IronMath. Nessun remote o push nel repository Atlas. I bare remote dei lab sono solo directory locali temporanee. Nessun cambio Git globale. Un commit locale segue le condizioni esplicite dell'utente.
