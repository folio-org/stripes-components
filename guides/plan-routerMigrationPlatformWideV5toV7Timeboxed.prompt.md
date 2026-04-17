## Plan: Platform-Wide React Router v5 -> v7 Migration (Time-Boxed, All Modules)

This plan defines a mandatory, platform-wide migration from React Router v5 to v7 across all FOLIO modules and shared packages within a fixed timeline, with a controlled compatibility buffer using `react-router-v5-compat` only when needed to unblock delivery.

**Mission**
1. Complete migration of all router usage from v5 APIs to v7-compatible APIs across the entire workspace.
2. Keep platform behavior stable while reducing long-tail compatibility debt.
3. Finish inside a fixed 24-week program window, including a planned buffer period.

**Hard Timeline (24 Weeks Total)**
1. Weeks 1-2: Program kickoff, ownership, baseline inventory.
2. Weeks 3-5: Automated codemods, core API migration scaffolding, compatibility policy activation.
3. Weeks 6-9: `stripes-core` and shared libraries migration complete.
4. Weeks 10-18: UI module wave migrations (all modules).
5. Weeks 19-21: Platform hardening, regression burn-down, full test confidence.
6. Weeks 22-24: Buffer period (compatibility cleanup and schedule risk absorption only).

**Scope (In)**
1. All platform and workspace packages that consume `react-router` or `react-router-dom` directly or indirectly.
2. Shared infrastructure packages: `stripes-core`, `stripes-components`, `stripes-smart-components`, `stripes-connect`, and relevant build/runtime packages.
3. Every `ui-*` module in this workspace, including plugin modules.
4. Router-related tests, helper utilities, mocks, and navigation fixtures.

**Scope (Out)**
1. Feature redesign unrelated to routing behavior.
2. Non-routing refactors unless required to unblock migration.
3. New navigation paradigms beyond v7 parity for this program window.

**Migration Policy**
1. Primary path: migrate directly to v7 APIs and semantics.
2. Secondary path (temporary): allow `react-router-v5-compat` only for blocked modules during the buffer-capable window.
3. No permanent compatibility layer: all compat dependencies must be removed by end of Week 24.

**Execution Phases**
1. Phase 0 - Mobilization (Weeks 1-2)
2. Appoint stream leads: core platform, UI waves, tooling, QA.
3. Produce authoritative inventory of v5 API usage (`Switch`, `Redirect`, `withRouter`, `useHistory`, route `component`/`render`, `Prompt`, `activeClassName`).
4. Lock migration SLAs, risk rubric, and weekly reporting dashboard.

5. Phase 1 - Tooling and Baseline (Weeks 3-5)
6. Build codemods for import migration and common API swaps (`useHistory` -> `useNavigate`, `Redirect` -> `Navigate`, `Switch` -> `Routes`).
7. Add lint rules and CI guards that prevent net-new v5 API usage.
8. Define temporary compat playbook, including required ticketing and expiry metadata per usage.

9. Phase 2 - Shared/Core Cutover (Weeks 6-9)
10. Migrate `stripes-core` routing internals and top-level route composition to v7 semantics.
11. Update shared components and HOCs that currently rely on v5 assumptions.
12. Convert shared test harnesses to a v7-compatible model so UI module migrations can proceed safely.

13. Phase 3 - Module Waves (Weeks 10-18)
14. Wave A (Weeks 10-12): highest complexity modules and route-heavy flows.
15. Wave B (Weeks 13-15): medium complexity modules and plugin integrations.
16. Wave C (Weeks 16-18): remaining modules and edge-case cleanup.
17. Enforce done-definition per module: no direct v5 imports, all route tests green, smoke checks passed.

18. Phase 4 - Hardening (Weeks 19-21)
19. Run platform-wide regression passes: deep links, guards, redirects, browser history, nested routing, query param flows.
20. Resolve remaining defects and remove temporary exceptions not explicitly approved for buffer usage.
21. Freeze migration-related code paths for final stabilization.

22. Phase 5 - Buffer and Compatibility Burn-Down (Weeks 22-24)
23. Use reserved time for only two purposes: delayed module completion and `react-router-v5-compat` removal.
24. Track daily compat burn-down until zero.
25. Exit gate at Week 24: no compat dependencies, no unresolved critical router defects.

**Compatibility Buffer Rules (`react-router-v5-compat`)**
1. Allowed only after a module demonstrates blocking parity issues with direct v7 migration.
2. Each compat usage requires:
3. A linked blocker ticket.
4. Owner and target removal week.
5. Test coverage proving behavior is preserved.
6. New compat usage is prohibited after Week 20 unless approved by migration lead and QA lead jointly.
7. Global removal deadline is end of Week 24 with no extensions by default.

**Governance and Reporting**
1. Weekly steering review with leads from platform, QA, and module owners.
2. Dashboard metrics:
3. Remaining v5 import count by package.
4. Remaining compat usages with expiry week.
5. Module wave completion percentage.
6. Critical and high router defect counts.
7. Any wave slippage triggers immediate recovery actions in the next sprint.

**Quality Gates**
1. Static gate: zero net-new v5 API references on every PR.
2. Build gate: affected packages compile and pass type/lint checks.
3. Test gate: migrated module tests and shared router tests pass in CI.
4. Runtime gate: smoke suite validates navigation, redirects, guarded routes, and back/forward behavior.
5. Federation gate: single router runtime integrity for host/remotes and no peer version drift.

**Risk Plan**
1. Risk: hidden v5 usage in low-traffic modules.
2. Mitigation: repeated inventory scans and PR-level import checks.
3. Risk: test harness mismatch between legacy and v7 behavior.
4. Mitigation: migrate shared harnesses before module waves.
5. Risk: deadline pressure causing permanent compat debt.
6. Mitigation: hard stop policy and dedicated buffer burn-down squad.

**Definition of Done (Program)**
1. All modules in scope run with v7-compatible router usage.
2. No direct `react-router`/`react-router-dom` v5 API usage remains.
3. No `react-router-v5-compat` dependency remains in platform or modules.
4. Platform regression suite is green for routing-critical journeys.
5. Migration closeout report documents changes, risks retired, and post-migration guardrails.

**Immediate Next 10 Working Days**
1. Publish owner map for every `ui-*` module and shared package.
2. Generate baseline inventory report and agree migration wave assignment.
3. Land CI rule preventing new v5 APIs.
4. Prototype codemod on two high-complexity pilot modules.
5. Finalize buffer usage workflow and sign-off criteria.
