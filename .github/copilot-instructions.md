# Engineering Atlas — istruzioni agente

Missione: collegare le evidenze SSRI alla manutenzione IronMath in un repository curricolare separato.
Leggi e applica la sola [policy canonica](../governance/AGENT_POLICY.md) prima di agire.
Verifica con `npm run validate`, `npm test`, `npm run check:generated` e `git diff --check`.
Vietati modifiche ai repository fratelli, lettura di secret, hosting e deploy. Frontend locale solo in apps/web secondo ADR-0009. Repository GitHub pubblica e origin ufficiale secondo la policy canonica; ulteriori push solo se autorizzati dall'utente.
Scope: sette starter invariati e sola estensione VS Code autorizzata in `governance/scope.json` secondo ADR-0010; gli altri moduli restano metadata planned.
