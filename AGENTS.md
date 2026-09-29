# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this is

`@folio/stripes-components` is the shared React component library for [Stripes](https://github.com/folio-org/stripes-core), the UI toolkit for the FOLIO project. It is consumed by nearly every FOLIO UI module (`stripes-core`, `stripes-smart-components`, and individual apps), both as JS (barrel import from `index.js` or deep imports like `@folio/stripes-components/lib/<Component>`) and as CSS (via `lib/variables.css`, `lib/global.css`, and cross-package `composes:` in CSS Modules). Breaking changes here ripple across the whole ecosystem, so keep the public surface (exports in `index.js`, `lib/**/*.css` paths, component prop APIs) stable unless a change is explicitly intended to be breaking.

## Commands

```
yarn test                      # run the full karma/mocha test suite in Chrome
yarn test-dev                  # same, but watches for changes
yarn lint                      # eslint + stylelint
yarn eslint                    # eslint only
yarn stylelint                 # stylelint on lib/**/*.css only
yarn storybook                 # run Storybook locally (dev mode, port 9001)
yarn storybook-build           # build static Storybook to .out
yarn docgen                    # regenerate docs/reactdoc.json via react-docgen
```

There is no single-test CLI flag baked into `package.json` — `stripes test karma` (from `@folio/stripes-cli`) runs the whole suite via Karma/webpack. To focus on one test while iterating, use Mocha's `it.only`/`describe.only` in the test file itself, or watch mode (`yarn test-dev`) and rely on `it.only`.

## Architecture

### Component layout convention

Every component lives under `lib/<ComponentName>/` and follows this shape (see `lib/Button/` as the canonical minimal example, `lib/Accordion/` for a multi-file example):

```
lib/<ComponentName>/
  <ComponentName>.js       # implementation
  <ComponentName>.css      # CSS Modules styles, imported as `css` in the component
  index.js                 # re-exports the public pieces
  readme.md                 # component-specific docs, linked from README.md
  stories/                 # Storybook stories
  tests/
    <ComponentName>-test.js
    interactor.js           # BigTest interactor(s) used by the tests (and reusable by consumers)
```

New components/utilities must be exported from the root `index.js` to be part of the public package surface — grep there before assuming something isn't exported.

### Public surface

- `index.js` — the package's barrel export; organized loosely into "form elements", "data containers", "layout containers", "misc" sections.
- `lib/` — components (see README.md's Component categories table for a taxonomy: structure, control, data-display, design, user-feedback, accessibility, utility, prefab, obsolete).
- `util/` — plain utility functions (not components), documented in `util/README.md`.
- `hooks/` — shared React hooks (`useFormatDate`, `useFormatTime`, `useDynamicLocale`, `useClickOutside`, etc.).
- `lib/variables.css` / `lib/global.css` / `lib/sharedStyles/` — CSS consumed across package boundaries by other FOLIO modules (via `@import` and CSS-Modules `composes:`). These paths are relied upon by hardcoded filesystem lookups in `stripes-webpack` (not just Node module resolution), so don't relocate them.

### Testing

Tests are browser tests run via Karma + Mocha + Chai, with DOM interactions/assertions performed through [BigTest interactors](https://frontside.com/interactors) (mostly from `@folio/stripes-testing`, sometimes a local `tests/interactor.js`). Full guide: `guides/Testing.mdx`.

- Test files live in each component/util/hook's `tests/` directory, named `<Name>-test.js`; `tests/index.js` auto-requires every `**/tests/*-test.js` under `lib/`, `util/`, and `hooks/` (via webpack's `require.context`), so a new test file is picked up automatically — no manual registration needed.
- Use `mount` from `tests/helpers.js` to mount a bare component; use `mountWithContext` (wraps in `tests/Harness.js`, providing redux `Provider` + react-intl `IntlProvider`) for components needing i18n/redux-form context.
- `mount`/`mountWithContext` tear down the *previous* mounted component on the *next* call (not immediately after each test), so a failed test's DOM is still inspectable afterward — useful with `it.only` when debugging.
- Always prefer an interactor over raw DOM queries for assertions/interactions; write one in the component's `tests/interactor.js` if it doesn't exist yet, since other components' tests may compose it later.
- Accessibility: many components run `runAxeTest` (from `@folio/stripes-testing`) as an `it()` case — add it for new interactive components.

### Storybook / docs

Storybook stories live in `lib/**/*.stories.[tj]s` and `lib/**/*.readme.mdx`; guides live in `guides/**/*.mdx`. The `docs:readme:generate`/`docs:readme:clean` scripts (run automatically around `yarn storybook`/`storybook-build`) generate/remove temporary `.stories.mdx` wrapper files from each component's `readme.md` — don't hand-author `.stories.mdx` files that wrap a `readme.md`.

### Linting

ESLint extends `@folio/eslint-config-stripes`. Notable local overrides (`.eslintrc`): `semi` is off for everything under `lib/**`; `func-names`/`max-classes-per-file`/`max-len`/`no-unused-expressions`/`react/prop-types`/`semi` are off inside `tests/` directories. `max-len` is a 120-char warning elsewhere. Stylelint runs against `lib/**/*.css` using `stylelint-config-standard`.

### Code and performance standards

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
