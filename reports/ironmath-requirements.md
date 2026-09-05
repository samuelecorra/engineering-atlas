GENERATED — DO NOT EDIT DIRECTLY
Source: catalog/skills/*.json; sources/evidence/ironmath-requirements.json; sources/repositories.json
Regenerate: npm run build:reports

# Requisiti IronMath

Coverage della fonte ≠ mastery personale. C descrive il materiale SSRI; M è il requisito IronMath, non una competenza attribuita al learner. Stato del contenuto e assessment personale restano separati.

- samuelecorra/cybersec_unimi_ssri2.0: audit `7467a51576a7c1514edacb26d9408bf0c1444a7d` (6310 file); locale `c691750bf85e6130b9ef59eeb357366508d05311` (6271 file), drift `different-audit-unavailable`. Oggetto commit audit non disponibile localmente. README e inventario correnti letti; lezioni ora sotto lessons/cybersecurity/. Conteggi e coverage restano quelli forniti, non riverificati sullo snapshot. Il viewer React/Vite e il workflow correnti non sono coverage curricolare.
- samuelecorra/ironmath: audit `22da98929d9c70e20a5a3a9d6fabfe2bd0279431` (4069 file); locale `ec809fb3f4dd8e5b8493fddcb53ef759d5d9d047` (4069 file), drift `ahead`. Snapshot audit accessibile e antenato di HEAD; controllati manifest e architettura, senza nuovo audit integrale.

| Skill | Titolo | Target | Evidence ID |
| --- | --- | --- | --- |
| skill.agents.repo-workflows | Agenti e workflow repository | M4 | `ev.ironmath.agents` |
| skill.analytics.learning-provenance | Analytics, provenance e calibrazione | M4 | `ev.ironmath.analytics` |
| skill.api.contracts-validation | Contratti e validazione API | M3 | `ev.ironmath.api` |
| skill.api.sse-streaming | SSE e streaming API | M3 | `ev.ironmath.sse` |
| skill.architecture.monorepo-boundaries | Architettura e boundary monorepo | M4 | `ev.ironmath.architecture` |
| skill.cicd.github-actions | GitHub Actions e CI/CD | M4 | `ev.ironmath.workflow` |
| skill.cli.environment | CLI e ambiente riproducibile | M3 | `ev.ironmath.root` |
| skill.cloud.cloudflare | Cloudflare operativo | M3 | `ev.ironmath.status` |
| skill.cloud.environments-network-policy | Ambienti e policy rete | M3 | `ev.ironmath.status` |
| skill.cloud.railway | Railway operativo | M3 | `ev.ironmath.status` |
| skill.containers.compose | Compose e stack locali | M3 | `ev.ironmath.compose` |
| skill.containers.docker | Container Docker | M3 | `ev.ironmath.docker` |
| skill.curriculum.knowledge-graph | Curriculum e knowledge graph | M4 | `ev.ironmath.curriculum` |
| skill.db.sql-transactions | SQL e transazioni | M2 | `ev.ironmath.prisma` |
| skill.docs.markdown-latex | Markdown, LaTeX e docs verificabili | M3 | `ev.ironmath.bible` |
| skill.fastify.backend | Backend Fastify | M3 | `ev.ironmath.api` |
| skill.frontend.state-errors | Stato ed errori frontend | M3 | `ev.ironmath.web-test` |
| skill.git.internals | Git internals e recovery | M4 | `ev.ironmath.root` |
| skill.git.multi-device | Git tra due macchine | M4 | `ev.ironmath.root` |
| skill.github.collaboration | Collaborazione e review GitHub | M4 | `ev.ironmath.workflow` |
| skill.governance.adr-docs | ADR e docs-as-code | M4 | `ev.ironmath.adr` |
| skill.js.browser-async | Browser e asincronia | M3 | `ev.ironmath.web-test` |
| skill.js.fundamentals | JavaScript moderno | M3 | `ev.ironmath.web` |
| skill.llm.conversation-pedagogy | Conversazione e pedagogia | M3 | `ev.ironmath.prompt` |
| skill.llm.foundations | Fondamenti LLM | M3 | `ev.ironmath.python-runtime` |
| skill.llm.prompt-routing-retrieval | Prompt, routing e retrieval | M3 | `ev.ironmath.prompt` |
| skill.llm.responses-streaming | API LLM e streaming | M3 | `ev.ironmath.python-runtime` |
| skill.llm.safety-evals | Safety LLM ed eval | M4 | `ev.ironmath.llm-test` |
| skill.native.tauri-capacitor | Adapter Tauri e Capacitor | M2 | `ev.ironmath.admin` |
| skill.node.esm-vite | ESM e Vite | M3 | `ev.ironmath.web` |
| skill.node.npm-packages | npm e package | M3 | `ev.ironmath.root` |
| skill.node.runtime | Node runtime | M3 | `ev.ironmath.root` |
| skill.postgres.operations | PostgreSQL operativo | M3 | `ev.ironmath.prisma` |
| skill.prisma.migrations | Prisma e migrazioni | M3 | `ev.ironmath.migrations` |
| skill.privacy.minors-retention-secrets | Privacy, minori e retention | M3 | `ev.ironmath.bible` |
| skill.python.fastapi-async | FastAPI e async Python | M3 | `ev.ironmath.python-runtime` |
| skill.python.language | Python applicativo | M3 | `ev.ironmath.python-package` |
| skill.python.packaging | Packaging Python | M3 | `ev.ironmath.python-package` |
| skill.react.application | React applicativo | M3 | `ev.ironmath.web` |
| skill.security.auth-crypto | Auth e crittografia applicata | M3 | `ev.ironmath.bible` |
| skill.security.tenancy-idor | Tenancy e IDOR | M3 | `ev.ironmath.api-test` |
| skill.sre.backup-incident-retention | Backup, incident e retention | M3 | `ev.ironmath.status` |
| skill.sre.observability | Osservabilità | M3 | `ev.ironmath.python-map` |
| skill.supply-chain.dependencies | Dipendenze e supply chain | M3 | `ev.ironmath.workflow` |
| skill.testing.cross-layer | Testing cross-layer | M4 | `ev.ironmath.api-test` |
| skill.testing.theory-coverage | Testing e coverage | M3 | `ev.ironmath.api-test` |
| skill.testing.toolchains | Toolchain di test | M3 | `ev.ironmath.llm-test` |
| skill.typescript.language | TypeScript e contratti | M3 | `ev.ironmath.api` |
| skill.web.accessibility | Accessibilità applicativa | M3 | `ev.ironmath.web-test` |
| skill.web.css-responsive | CSS responsive operativo | M3 | `ev.ironmath.web` |
| skill.web.html-semantic | HTML semantico | M2 | `ev.ironmath.web` |
| skill.web.http | HTTP applicato | M3 | `ev.ironmath.sse` |

## Anchor e requisiti del prodotto

| Evidence ID | Path nello snapshot | Tipo | Claim | Confidence / provenienza |
| --- | --- | --- | --- | --- |
| `ev.ironmath.root` | `package.json` | manifest | Node >=24 <25, launcher CLI, script per package indipendenti; root senza workspaces. | high / local-audit-snapshot |
| `ev.ironmath.architecture` | `ARCHITECTURE.md` | architecture | Monorepo con confini web/admin/API/LLM/curriculum; documentazione canonica, ADR e source governance. | high / local-audit-snapshot |
| `ev.ironmath.readme` | `README.md` | architecture | Ingresso documentale e istruzioni operative del prodotto nello snapshot. | medium / supplied-audit |
| `ev.ironmath.web` | `apps/web/package.json` | manifest | React 19, Vite 7, Router 7, JavaScript/JSX, CSS, Markdown/KaTeX, MathLive, Recharts e Playwright. | medium / supplied-audit |
| `ev.ironmath.api` | `apps/api/package.json` | manifest | Fastify 5, TypeScript, Zod, Prisma 5: implementazione API e toolchain separata. | medium / supplied-audit |
| `ev.ironmath.admin` | `apps/admin/package.json` | manifest | React/Vite per onboarding amministrativo; adapter Capacitor/Tauri sperimentali, senza priorità sul percorso principale. | medium / supplied-audit |
| `ev.ironmath.prisma` | `apps/api/prisma/schema.prisma` | schema | PostgreSQL: 88 modelli e 61 enum nel baseline; transazioni, constraint e tenancy applicativa. | medium / supplied-audit |
| `ev.ironmath.migrations` | `apps/api/prisma/migrations` | schema | 58 migrazioni nel baseline: evoluzione schema e dati, backfill, ordine e recovery. | medium / supplied-audit |
| `ev.ironmath.python-package` | `services/ironmath-llm/pyproject.toml` | manifest | Package ironmath-llm con layout src, requires-python >=3.10 e setuptools build backend. | high / local-audit-snapshot |
| `ev.ironmath.python-runtime` | `services/ironmath-llm/requirements.txt` | manifest | Runtime Python con FastAPI, Uvicorn e OpenAI API; dipendenze runtime separate da quelle di sviluppo. | medium / supplied-audit |
| `ev.ironmath.python-dev` | `services/ironmath-llm/requirements-dev.txt` | manifest | Dipendenze di sviluppo/test del servizio Python da distinguere dalle dipendenze runtime. | medium / supplied-audit |
| `ev.ironmath.python-map` | `services/ironmath-llm/MODULE_MAP.md` | architecture | Mappa package API/tutor/retrieval/safety/persistence/voice prototipale e osservabilità. | medium / supplied-audit |
| `ev.ironmath.workflow` | `.github/workflows/*.yml` | workflow | Sette workflow per CI, deploy, monitor, integrity e safety red-team; permission, pinning e required check. | medium / supplied-audit |
| `ev.ironmath.compose` | `docker-compose.yml` | manifest | Stack locale multi-servizio con Compose, network, volume, health e configurazione separata. | medium / supplied-audit |
| `ev.ironmath.docker` | `apps/api/Dockerfile` | manifest | Build container del servizio: runtime, dipendenze, immagine e riproducibilità. | medium / supplied-audit |
| `ev.ironmath.graph` | `.graph/modules.json` | architecture | Grafo di import generato con freshness check, distinto da knowledge graph e semantica curricolare. | medium / supplied-audit |
| `ev.ironmath.adr` | `docs/adr` | architecture | Decisioni architetturali versionate: boundary, contratti e governance cross-cutting. | medium / supplied-audit |
| `ev.ironmath.status` | `docs/status` | architecture | Stato operativo, ambienti e runbook; deployment Cloudflare/Railway, health e rollback nel baseline. | medium / supplied-audit |
| `ev.ironmath.bible` | `docs/bible` | architecture | Documentazione tecnica di auth, tenancy, privacy, cifratura e policy operative del prodotto. | medium / supplied-audit |
| `ev.ironmath.curriculum` | `packages/curriculum` | schema | 228 topic delle medie e nove sezioni per topic nel baseline; JSON/Markdown e semantica curricolare. | medium / supplied-audit |
| `ev.ironmath.web-test` | `apps/web/e2e` | test | Playwright per flussi utente e regressioni/a11y del frontend; UI asincrona e state/error handling. | medium / supplied-audit |
| `ev.ironmath.api-test` | `apps/api/tests` | test | Test API, contract/integration, tenancy e analytics; test inventory e confini tra strati. | medium / supplied-audit |
| `ev.ironmath.llm-test` | `services/ironmath-llm/tests` | test | pytest, golden eval e safety red-team; recovery provider e comportamento del tutor. | medium / supplied-audit |
| `ev.ironmath.sse` | `apps/api/src/services/tutorStreamProxy.ts` | source | Proxy tutor con streaming SSE e cancellazione: boundary browser, Node e servizio Python. | medium / supplied-audit |
| `ev.ironmath.prompt` | `services/ironmath-llm/src/ironmath_llm/tutor/prompt_builder.py` | source | Contratto prompt, routing, retrieval, conversation state e tutoring; safety prima del routing nel baseline. | medium / supplied-audit |
| `ev.ironmath.agents` | `AGENTS.md` | architecture | Instruction file, permessi, hook, graph check e secret discipline per agent workflow. | medium / supplied-audit |
| `ev.ironmath.analytics` | `apps/api/src/analytics` | source | Provenance, proiezioni, qualità dati e limiti della calibrazione; non inferire apprendimento dagli eventi grezzi. | medium / supplied-audit |
