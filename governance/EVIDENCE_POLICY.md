# Policy delle evidenze

Ogni record source ha ID, repository, commit, path relativo POSIX, tipo, claim, confidence, data e provenienza. `supplied-audit` indica il baseline ricevuto; `local-audit-snapshot` indica un controllo limitato sul commit audit locale. Le osservazioni sul commit corrente vivono in repositories.json e non sono prova sul commit audit.

Un path source è un identificatore nel namespace del repository auditato, non un link locale. Directory e glob sono ammessi come scope di evidenza se dichiarati nel claim. I controlli offline non aprono i sibling. I path SSRI del baseline possono precedere il prefisso attuale `lessons/cybersecurity/`: non affermarne la risoluzione nello snapshot assente.

Absence-check: dichiarare curriculum esaminato, tecnologie assenti e limite della conclusione. Il viewer React/Vite, i suoi file TS o workflow non costituiscono insegnamento accademico. C0 significa assenza di evidenza curricolare nello snapshot, non incapacità della persona.

Ogni skill lega coverage e requirement a evidence ID distinti e aggiunge `gap.confidence` e `gap.note`. Il target M non si sottrae numericamente al livello C: sono scale diverse. La deduplicazione usa un corso proprietario per skill e rinforzi negli altri corsi. Tutte le note sono sintesi originali; non riproducono lezioni delle fonti.
