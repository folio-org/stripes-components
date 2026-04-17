## Plan: stripes-router Facade (React Router v5 API Compatibility Over wouter)

Build a centralized `@folio/stripes-router` package that emulates the currently used `react-router`/`react-router-dom` v5 API while using `wouter` and focused support libraries under the hood. The migration objective is import-only changes in ui modules wherever possible.

**Goal**
1. Keep per-module edits minimal: prefer changing imports from `react-router` / `react-router-dom` to `@folio/stripes-router`.
2. Preserve behavior parity for existing routing patterns used across stripes and ui modules.
3. Hide implementation details (wouter and compatibility helpers) behind a stable facade API.

**Non-goals (for this phase)**
1. Do not force module-by-module conversion to a new routing paradigm.
2. Do not introduce broad route config rewrites in ui modules.
3. Do not require immediate migration to react-router v6/v7 APIs.

**Target Public API (v5-compatible facade)**
1. Components: `Router`, `Route`, `Switch`, `Redirect`, `Link`, `NavLink`.
2. Hooks: `useHistory`, `useLocation`, `useRouteMatch`, `useParams`.
3. HOCs/helpers: `withRouter`, `matchPath`.
4. Types/utils: v5-like `history`, `location`, `match` shapes expected by existing code.
5. Optional: compatibility export aliases for future-proofing (`Navigate`, `useNavigate`) mapped internally.

**Proposed Internal Stack**
1. `wouter` for core route matching and navigation primitives.
2. `regexparam` (or equivalent matcher utility) for route pattern parity edge cases.
3. `history` (v4/v5-compatible adapter layer) to emulate `useHistory` and history object semantics.
4. Small internal compatibility runtime for:
- `Switch` first-match ordering behavior.
- `Route` support for v5 props (`component`, `render`, `children`).
- `NavLink` active-state behavior including `activeClassName` and `activeStyle`.
- `withRouter` injection of `history`, `location`, and `match` props.
5. `path-to-regexp` only if needed for strict parity features not covered by lighter matcher tooling.

**Architecture**
1. Package: `stripes-router/` as `@folio/stripes-router` in workspace.
2. Public entrypoint: export only compatibility API consumed by modules.
3. Internal adapters:
- `adapters/historyAdapter.ts`
- `adapters/matchAdapter.ts`
- `components/RouteCompat.tsx`
- `components/SwitchCompat.tsx`
- `components/NavLinkCompat.tsx`
- `hoc/withRouterCompat.tsx`
4. Strict separation between public API and internal implementation so internals can evolve without module churn.

**Phased Execution**
1. Phase 0 - Discovery and contract freeze
2. Catalog exact v5 API surface currently used in this workspace (including uncommon props/behaviors).
3. Define compatibility contract and parity acceptance criteria.
4. Phase 1 - Package scaffolding
5. Create `@folio/stripes-router` package structure and build/test setup.
6. Add peer deps (`react`, `react-dom`) and internal deps (`wouter`, matcher/history helpers).
7. Phase 2 - Core compatibility implementation
8. Implement `Router`, `Route`, `Switch`, `Redirect` compatibility components.
9. Implement hooks and `withRouter` to preserve expected prop and hook behavior.
10. Implement `NavLink` active behavior parity.
11. Phase 3 - Conformance test suite
12. Build a dedicated parity suite that compares expected v5 behavior to facade behavior.
13. Add focused tests for edge cases: nested routes, optional params, exact matching, redirect loops, blocked nav behavior assumptions.
14. Phase 4 - Core integration path
15. Update `stripes-core` re-exports so module consumers can import from `@folio/stripes-router`.
16. Keep old exports temporarily as pass-through aliases if needed for incremental adoption.
17. Phase 5 - Module rollout (minimal-touch)
18. Run imports-only codemod across ui modules:
- `react-router` -> `@folio/stripes-router`
- `react-router-dom` -> `@folio/stripes-router`
19. Avoid behavioral rewrites unless parity gaps are detected.
20. Phase 6 - Stabilization
21. Run pilot rollout on high-complexity modules.
22. Fix parity gaps in facade instead of pushing code churn into modules.
23. Expand rollout platform-wide after pilot signoff.

**Codemod Strategy (Import-Only First)**
1. Replace source imports to central facade.
2. Preserve symbol names to avoid touching call sites.
3. Emit report of modules requiring non-import changes due to uncovered parity gaps.
4. Keep codemod idempotent and safe for repeated runs.

**Verification**
1. Unit conformance tests for each compatibility API surface.
2. Integration tests in `stripes-core` route composition paths.
3. Pilot ui module smoke tests:
- deep links
- route guards
- redirects
- query param updates
- back/forward navigation
4. Federation/runtime checks for singleton behavior and duplicated router runtime avoidance.
5. Static scan: track reduction of direct `react-router*` imports in ui modules.

**Risks and Mitigations**
1. Risk: perfect v5 parity is hard for rarely-used APIs.
- Mitigation: start with usage-driven parity (only what this repo actually uses), add explicit unsupported list.
2. Risk: history semantics mismatch.
- Mitigation: provide a strict `history` adapter and test push/replace/listen/goBack/goForward behaviors.
3. Risk: `withRouter` edge cases in class-heavy code.
- Mitigation: prioritize HOC parity tests against known complex modules.
4. Risk: route matching differences.
- Mitigation: snapshot and replay current route behavior via fixture-based tests.

**Acceptance Criteria**
1. At least 90% of module migration can be completed via import-only changes.
2. No critical regressions in pilot modules for navigation and route rendering.
3. `stripes-core` and pilot modules pass existing test suites plus new parity tests.
4. Direct `react-router`/`react-router-dom` imports are no longer required in migrated modules.

**Rollout Recommendation**
1. Pilot first in two high-complexity modules.
2. Fix compatibility in facade, not in module feature code.
3. Roll out to remaining modules in batches after pilot parity metrics are green.

**Suggested Pilot Modules**
1. `ui-agreements`
2. `ui-users`

**Deliverables**
1. New package: `@folio/stripes-router`.
2. API compatibility matrix (implemented vs intentionally unsupported).
3. Imports-only codemod + migration report.
4. Parity test suite and pilot validation report.
5. Adoption playbook for remaining ui modules.