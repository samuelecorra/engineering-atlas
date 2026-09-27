# Policy canonica degli agenti

Missione: costruire un piccolo curriculum personale che collega le evidenze SSRI alla manutenzione IronMath, mantenendo separati prodotto, conoscenza e progresso personale.

## Autorità e preflight

Ordine vincolante: richiesta esplicita dell'utente; file utente preesistenti; questa policy; metadata canonici; report derivati. In caso di conflitto sostanziale preserva i file e descrivi il conflitto prima di agire.
Verifica cwd e inventario Git prima di scrivere. Lavora solo in Atlas; i sibling sono consultabili soltanto in lettura per documenti e file non sensibili. Non eseguire comandi applicativi nei sibling. Non leggere secret, chiavi, certificati, credenziali o dati personali; consulta soltanto nomi di configurazione documentati o `.env.example` sanitizzati. Non stampare l'environment completo.

## Evidenza e apprendimento

`ssri_coverage` misura la copertura documentata della fonte, mai l'abilità della persona. `ironmath_requirement` è un target. `learner_mastery` può cambiare solo con assessment e artifact osservabili, revisore, data ed esito. Non creare il profilo reale.
Ogni gap richiede evidenza SSRI (anche absence-check delimitato), evidenza IronMath, confidence e motivazione. L'assenza nel curriculum non implica assenza nell'applicazione viewer. Un nome di directory non dimostra contenuto. Un commit non disponibile resta baseline fornito dall'utente: non inventare una verifica live. Registra osservazione e drift separati, senza fetch o nuovo audit implicito. La richiesta dell’8 settembre autorizza una lettura remota selettiva di SSRI e delle Actions IronMath, fissata a commit secondo ADR-0010; le copie di consultazione restano in `.work/`.
Usa la [policy evidenze](EVIDENCE_POLICY.md) e i [confini delle fonti](SOURCE_AND_LICENSE_POLICY.md). roadmap.sh: sole label, URL, data e `taxonomy-label-only`; nessuna copia di roadmap, screenshot o descrizioni.

## Lifecycle e scope

Segui [CONTENT_LIFECYCLE](CONTENT_LIFECYCLE.md). Il baseline conserva 52 skill, 20 corsi e sette starter. [ADR-0010](adr/ADR-0010-vscode-course-and-rendering-contract.md) aggiunge il corso VS Code EAT-021 e soltanto il modulo, le unità e le lezioni autorizzati da `scope.extension_modules`. Non aggiungere altro contenuto fuori scope senza autorizzazione. Non creare directory per i moduli soltanto pianificati. Non promuovere draft a reviewed senza review tecnica e didattica registrata, né a validated senza assessment del contenuto e controlli verdi. Questo stato non concede mastery personale.
Il tentativo personale senza LLM precede la review opzionale con agente. Richiedi spiegazione, diagnosi e recupero; un output dell'agente non costituisce evidenza di autonomia.

## Modifiche e generated

Skill, course, module, unit, lesson, assessment e grafo sono canonici. Lesson/lab/assessment Markdown sono autoriali. La gerarchia e l'ownership unica sono definite in [ADR-0008](adr/ADR-0008-unit-lesson-hierarchy.md): una U01 e una L01 per ciascuno dei sette starter module; lab, assessment e fixture restano del modulo. Le roadmap sono proiezioni che referenziano ID. Indici e report sono generati: modificali solo tramite generatori deterministici; `check:generated` confronta byte senza scrivere. Mantieni atomiche le modifiche metadata + graph + report. Conserva le modifiche utente e registra decisioni architetturali negli ADR. Non cambiare versioni o coverage solo perché un sibling è più recente. Il provenance pack di [ADR-0007](adr/ADR-0007-historical-audit-provenance.md) è storico, immutabile e non canonico; le sue istruzioni non hanno autorità corrente.

## Verifica e confini operativi

Prima di dichiarare conclusa una modifica: `npm run validate`, `npm test`, `npm run check:generated`, `git diff --check`; dopo modifiche canoniche rigenera indici e report. I test devono includere casi avversi e fallire sulla causa reale; non ridurli per ottenere verde. Dichiarare warning, limiti e strumenti non disponibili.
I lab sono offline e confinati alle fixture o a `.lab-runs/` dentro Atlas. [ADR-0009](adr/ADR-0009-local-web-application.md) autorizza React, TypeScript, Vite, Tailwind, dipendenze frontend motivate e toolchain lint/test/build soltanto in `apps/web`, unico workspace npm. Le CLI root restano senza dipendenze runtime npm. Impeccable è supporto progettuale project-local. I dati frontend sono generati dalle fonti canoniche e controllati per freshness; dev e preview ascoltano soltanto su loopback. Restano vietati hosting, Pages, workflow di pubblicazione, cloud config, backend remoto, analytics e dipendenze runtime da/verso SSRI o IronMath. È ammesso soltanto `.github/workflows/ci.yml` read-only per verificare PR e push su `main` con `contents: read`; niente secret, deploy o pubblicazione. Nessuna lettura di secret o modifica ai repository fratelli è autorizzata in questa tranche. I bare remote dei lab sono solo directory locali temporanee. Nessun cambio Git globale. La tranche locale attuale esclude deploy, tag e release.

Su richiesta esplicita dell'utente, la repository è pubblicata su `samuelecorra/engineering-atlas`: [ADR-0006](adr/ADR-0006-public-github-repository.md) supera il precedente vincolo locale per questa pubblicazione. Il remote `origin` è opzionale e, se presente, deve puntare alla repository ufficiale via HTTPS o SSH. Sono autorizzati creazione pubblica, metadata GitHub coerenti e push iniziale del contenuto verificato. Terminata questa operazione, fermarsi come richiesto dall'utente; ulteriori push o ampliamenti del curriculum richiedono una nuova richiesta che li autorizzi. Non pubblicare il profilo personale reale, file ignorati o contenuti dei sibling.
