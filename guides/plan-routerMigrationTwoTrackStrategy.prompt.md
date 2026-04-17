## Plan: Router Migration Two-Track Strategy

Recommended approach: run a stripes-router-first path as primary (lowest per-module churn), while maintaining a complete direct react-router v7 plan as fallback. Both tracks share discovery and verification artifacts to avoid duplicated effort.

**Steps**
1. Shared Phase 0 - Common baseline for both tracks
2. Freeze inventory of router API usage across packages (`Switch`, `Redirect`, `withRouter`, `useHistory`, `Route component`, `Prompt`, NavLink `activeClassName`, test helpers).
3. Define parity requirements: route resolution order, permission gating, deep-link behavior, and module federation singleton integrity.
4. Build shared migration dashboards: import-count trend, top-risk modules, and critical-path test coverage.
5. Track A - Direct react-router v7 migration (full native migration)
6. Upgrade router dependencies in platform/shared packages and resolve peer dependency/version constraints first in core packages.
7. Refactor `stripes-core` routing internals to v7-native semantics (`Switch` removal strategy, `Redirect`->`Navigate`, route element patterns).
8. Migrate module code package-by-package: `useHistory`->`useNavigate`, `withRouter` replacement via hooks, NavLink and Prompt replacements.
9. Update all router-oriented test harnesses and fixtures to v7-compatible rendering and navigation utilities.
10. Execute staged rollout by module cohorts, then remove remaining v5 compatibility code.
11. Track B - Introduce `@folio/stripes-router` first (compatibility facade)
12. Create new shared package `stripes-router` with a v5-compatible facade that mirrors the currently used API surface.
13. Re-export and centralize router dependency usage through `stripes-router`, then wire `stripes-core` exports to this facade.
14. Perform imports-only codemod across modules from direct router imports to `@folio/stripes-router` with minimal behavior edits.
15. Validate parity while still on v5-style behavior; publish and adopt across modules.
16. Within one release, upgrade internals of `stripes-router` to v7 with compatibility shims and only patch modules where shims cannot preserve behavior.
17. Cross-track Phase - Decision gate and fallback
18. Gate after pilot modules: if facade path shows low regression and low churn, continue Track B primary.
19. If facade shims create unacceptable complexity or edge-case breakage, switch to Track A using shared baseline assets and already-updated core tests.

**Relevant files**
- `platform-complete/package.json` - platform dependency coordination and version policy anchor.
- `stripes-core/src/RootWithIntl.js` - root router composition and high-risk integration point.
- `stripes-core/src/ModuleRoutes.js` - permission-aware route rendering behavior to preserve.
- `stripes-core/src/components/NestedRouter.js` - existing compatibility behavior for Route/Switch patterns.
- `stripes-core/index.js` - central re-export surface to minimize module touchpoints.
- `stripes-webpack/module-federation-config.js` - singleton/shared dependency behavior under module federation.
- `stripes-smart-components/lib/SearchAndSort/SearchAndSortQuery.js` - `withRouter`-heavy pattern representative of difficult migrations.
- `ui-agreements/package.json` - pilot candidate with high routing complexity.
- `ui-users/package.json` - pilot candidate with high routing complexity.
- `ui-inventory/package.json` - pilot candidate with deep route/state coupling.
- `ui-invoice/package.json` - pilot candidate with notable `withRouter` usage.

**Verification**
1. Static checks: track counts of direct imports from `react-router` and `react-router-dom`, and counts of deprecated v5 APIs.
2. Build checks: workspace install plus targeted builds for `stripes-core`, `stripes-smart-components`, and pilot `ui-*` modules.
3. Runtime smoke: deep links, redirect flows, guarded routes, browser back/forward behavior, and nested module mount/unmount.
4. Test checks: update and execute router helper suites and critical module tests in pilot cohort.
5. Federation checks: verify single router runtime instance across host/remotes and no peer version drift.
6. Regression checklist: parity for route match precedence, URL param extraction, and navigation side effects.

**Decisions**
- Preferred primary path: Track B (`@folio/stripes-router` first).
- Compatibility duration: short window (1 release) before full v7-compatible internals.
- Enforcement: guidance-only initially (no hard lint rule).
- Included scope: platform-wide router migration planning for both tracks.
- Excluded scope: immediate full code rewrite of every module in one release.

**Further Considerations**
1. Pilot breadth: Option A one-module pilot, Option B two-module pilot. Recommendation: two-module pilot (`ui-agreements` + `ui-users`).
2. Codemod scope: Option A imports-only first, Option B imports+API rewrites first. Recommendation: imports-only first.
3. Cutover signal: define numeric thresholds for regression rate and migration velocity before promoting v7-only mode.