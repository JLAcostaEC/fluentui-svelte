# TODO — Road to first release

Working notes for `fluentui-svelte`. Ordered by what blocks a publish, not by effort.

Status legend: **P0** = blocks publishing · **P1** = blocks announcing · **P2** = should land soon · **P3** = nice to have

---

## P0 — Blocks publishing

### 1. Runtime dependencies are in `devDependencies`

The library imports four external packages that are never installed with it. `peerDependencies`
only declares `svelte`, and there is no `dependencies` block, so a consumer running
`npm i fluentui-svelte` + `import { Button }` fails to resolve on first build.

| package                 | files in `src/lib` importing it               |
| ----------------------- | --------------------------------------------- |
| `fluentui-icons-svelte` | 35+ (incl. `components/button/button.svelte`) |
| `@floating-ui/dom`      | 17                                            |
| `runed`                 | 13                                            |
| `tabspot`               | 8                                             |

- [ ] Move all four to `dependencies`
- [ ] Keep `svelte` as the only `peerDependency`
- [ ] Re-run `publint --strict` afterwards

### 2. Trim the docs subtree from the published tarball

Currently **190 of 434 files (616 KB of 1.1 MB unpacked)** are `dist/components/*/docs/*`.
Keeping the AI docs in the package is intentional and worth doing — the rest is not.

| files             | size   | keep?                             |
| ----------------- | ------ | --------------------------------- |
| `llms.*` (32)     | 121 KB | **yes** — this is the whole point |
| `docs.*` (32)     | 228 KB | no — site only                    |
| `examples.*` (30) | 99 KB  | no — site only                    |
| `footer.*` (32)   | 89 KB  | no — site only                    |
| `index.*` (64)    | 77 KB  | no — site only                    |

Three things are broken in what ships today:

1. **`llms.md` is published as `llms.svelte`.** `svelte.config.js` declares
   `extensions: ['.svelte', '.svx', '.md']`, so `svelte-package` treats every `.md` as a
   component and renames it. Content survives byte-for-byte (5291 B in, 5291 B out) but the
   extension is wrong. There is not a single `.md` file in the tarball, so an agent globbing
   `**/*.md` over `node_modules/fluentui-svelte` finds nothing. This defeats the entire purpose.
2. **`dist/components/*/docs/index.js` imports files that don't exist.** It still references
   `'./docs.svx'`, `'./examples.svx'`, `'./footer.svx'` and `'./llms.md?raw'` — all four were
   renamed to `.svelte` on the way out, and `svelte-package` does not rewrite specifiers.
   `?raw` is also Vite-only syntax.
3. **93 `docs/*.svelte` files import outside the package** — `../../../../site/components/showcase/showcase.svelte`
   and `../../../../i18n/messages.js`, neither of which is published.

#### How to exclude (`svelte-package` has no exclude option)

`@sveltejs/package` v2 only accepts `--input`, `--output`, `--types`, `--watch`, `--tsconfig`.
It copies everything under `src/lib` unconditionally. So filter one layer up, in `files`.
**Verified working**, including re-including a file after excluding its directory — later
patterns win over earlier ones:

```jsonc
"files": [
  "dist",
  "!dist/**/*.test.*",
  "!dist/**/*.spec.*",
  "!dist/**/docs/**",          // drop the whole docs subtree
  "dist/**/docs/llms.txt"      // ...then put the AI docs back
]
```

- [ ] Rename the 32 source `llms.md` → `llms.txt` (not in `extensions`, so it is copied verbatim)
- [ ] Update the `?raw` import in each `docs/index.ts` to point at `llms.txt`
- [ ] Add the `files` patterns above
- [ ] Verify with `npm pack --dry-run` that only `llms.txt` survives under `docs/`

Alternative if `dist/` itself should be clean: add a post-`svelte-package` step in `prepack`
that deletes `dist/**/docs/{docs,examples,footer,index}.*`. The `files` approach is simpler
and keeps `dist/` usable for the site build.

### 3. No LICENSE file

`package.json` declares `"license": "MIT"` but no `LICENSE` exists in the repo. For a project
positioned against a Microsoft design system this is not optional.

- [ ] Add `LICENSE` (MIT)
- [ ] Confirm `static/images/banner*.png` contains no Microsoft-owned assets

### 4. Real-install smoke test

The one step that catches what no tool catches.

- [ ] `npm pack` → `sv create` a clean app → `npm i ../fluentui-svelte-0.1.0.tgz`
- [ ] Import 6+ components, including ones using floating-ui (Flyout, Menu, Tooltip)
- [ ] `npm run build` with SSR enabled — confirm no `document`/`window` access at module scope
- [ ] Confirm importing one component does not pull all 32 (tree-shaking / `sideEffects`)

---

## P1 — Blocks announcing

### 5. The test suite is broken

**16 of 16 test files fail. 130 of 255 tests fail.** The components are fine; the harness
rotted after dependency upgrades. Two confirmed causes:

- `page.selector is not a function` — removed in `vitest-browser-svelte` 4
- `expect(() => render(Button, { as: 'span' })).toThrow()` no longer catches: Svelte 5 routes
  the throw through the error boundary, not the call

Publishing with a red `pnpm test` means no safety net for the first bug report.

- [ ] Repair the 16 spec files against the current vitest-browser-svelte API
- [ ] Re-run and get to green

### 6. `pnpm lint` fails — and two failures are real bugs

5 eslint errors + 3 unformatted files. Two of the "unused variable" errors are functional gaps,
not noise:

- `components/dialog/dialog-actions.svelte:7` — `tabspotAttributes` is computed and **never
  applied** to the `<div>`
- `components/list-view/list-view-item.svelte:41` — `tabsterAttrs` (vertical mover + grouper
  for `role="row"`) is computed and **never reaches the element**

Keyboard navigation in ListView and Dialog is therefore not wired up, which contradicts the
WAI-ARIA claim in the README.

- [ ] Apply the tabspot attributes in both components
- [ ] Fix remaining eslint errors, run `pnpm format`

### 7. No CI

`.github/` contains only `agents/` and `skills/` — zero workflows. Nothing runs on a PR, which
is exactly how item 5 happened.

- [ ] Workflow: `lint` + `check` + `test` on PR and push to `main`
- [ ] Workflow: publish on tag (consider npm provenance)

### 8. Types are not exported

`src/lib/index.ts` only has `export { default as ... }`. Consumers cannot write
`import type { ButtonProps } from 'fluentui-svelte'`.

- [ ] Re-export component prop types and the shared types from `src/lib/types`

### 9. Fix the corrupted comment in `src/lib/index.ts:1`

Line 1 is a single comment with 39 concatenated component paths — a generation step ate the
newlines. It is the first thing anyone reading the source sees.

---

## P2 — Technical debt

### 10. Replace custom arrow-key handling with Tabspot

Nine files still roll their own `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight` logic while eight
others already use `tabspot`. Two parallel focus models in one library is a bug factory.

Still custom:

- `auto-suggest-box/auto-suggest-box.svelte`
- `calendar-view/calendar-view-days.svelte`
- `calendar-view/calendar-view-months.svelte`
- `calendar-view/calendar-view-years.svelte`
- `calendar-view/types.ts`
- `dropdown/dropdown.svelte` (mixed — already imports tabspot too)
- `slider/slider.svelte`
- `tree-view/tree-view-item.svelte`
- `internal/components/dynamic-carousel/dynamic-carousel.svelte`

Note: Slider may be a legitimate exception — arrow keys there change a _value_, not focus.
Decide explicitly rather than by omission.

- [ ] Migrate the calendar-view trio (three near-identical implementations — good candidate for
      one shared mover)
- [ ] Migrate auto-suggest-box and tree-view-item
- [ ] Document the Slider decision

### 11. Rework `defineState` / `defineProperty`

`internal/context.ts` builds context state by reducing an array of `StateDefiner` functions,
each calling `Object.defineProperty` with a getter/setter pair. In `list-view.svelte` that is
~20 lines to expose two fields.

Problems: TypeScript cannot narrow the accumulated shape (`T` is fixed up front, so the
composition buys no type safety), `Object.defineProperty` is opaque to the Svelte compiler, and
the reactivity is implicit — it works because the getters close over `$state` variables, which
is not obvious to a reader.

The idiomatic Svelte 5 equivalent is a plain object literal with getter shorthand, or a class
with `$state` fields:

```ts
// instead of defineState([...defineProperty(...)])
const state = {
	get selectedItems() {
		return selectedItems;
	},
	set selectedItems(v) {
		selectedItems = v;
	},
	get anchorIndex() {
		return anchorIndex;
	},
	set anchorIndex(v) {
		anchorIndex = v;
	}
};
```

Same reactivity, fully typed, one third the code, no indirection.

- [ ] Prototype the rewrite on `list-view.svelte` (smallest surface)
- [ ] Roll out to the other 8 consumers
- [ ] Delete `defineState` / `defineProperty` if nothing needs them
- [ ] Also revisit `getFSContext` — it reads `getAllContexts().entries().pop()` and relies on the
      _most recently set_ context matching a name prefix. That is fragile under nesting and worth
      replacing with explicit context keys.

### 12. Finish the incomplete components

Current self-declared status from each `docs/index.ts`:

| component          | status                     |
| ------------------ | -------------------------- |
| `dropdown-select`  | `Prototype`                |
| `tree-view`        | `Experimental`             |
| `list-view`        | `Beta`                     |
| `auto-suggest-box` | `Beta`                     |
| `date-picker`      | `AI`                       |
| `time-picker`      | `AI`                       |
| `slider`           | `WIP` (in source docblock) |

- [ ] DropdownSelect (native) — finish and promote past `Prototype`
- [ ] ListView — finish, wire up the tabspot attrs from item 6
- [ ] TreeView — finish; also resolve the `TODO: investigate further` at
      `tree-view-item.svelte:126`
- [ ] Decide what `status: 'AI'` means publicly on DatePicker/TimePicker — either review and
      re-label, or be explicit in the docs about what it signals
- [ ] Either ship these or exclude them from `index.ts` for the first release. Shipping a
      `Prototype` from the root entry point sets an expectation you will have to honour.

### 13. Remove or rework GEO

Every `docs/index.ts` carries a hand-written `geo: { summary, topics, entities, category, faq }`
block, ~20 lines each × 32 components. It is maintained entirely by hand and nothing validates
it against the actual component API, so it will drift the moment props change.

Options, in order of preference:

1. **Drop it.** The `llms.txt` files already carry the same information in a format agents
   actually consume, and those sit next to the code so they rot more visibly.
2. **Generate it** from the `llms.txt` + prop types at build time.
3. **Keep it but shrink it** to the fields the site actually renders, and delete `faq`/`entities`
   if nothing consumes them.

- [ ] Confirm what the site actually reads from `META.geo` today
- [ ] Pick an option and apply it across all 32 files in one pass

---

## P3 — Should land, not urgent

### 14. Ship the AI docs properly

The intent is good and almost nobody does it — make it a deliberate feature instead of a
packaging side effect.

- [ ] Generate a concatenated `dist/llms-full.txt` during `prepack`
- [ ] Serve `/llms.txt` and `/llms-full.txt` from the docs site — this matters more than the
      package copy, because Cursor excludes `node_modules` from its index by default and Claude
      Code does not walk it unless pointed there
- [ ] Add a short README section telling people where to point their agent

### 15. Browser support policy

The Chromium-only caveat is currently the last note in the README. It is the first question
anyone will ask.

- [ ] Move it near the top
- [ ] List the specific CSS features involved and what visibly breaks in Firefox/Safari
- [ ] Decide: document as a known limitation, or add fallbacks

### 16. Test coverage gaps

17 of 32 components have no tests — including the most complex ones: `calendar-view`,
`calendar-date-picker`, `date-picker`, `time-picker`, `number-box`, `tooltip`, `radio-button`,
`persona`, `progress-bar`, `progress-ring`, `skeleton`, `textarea`, `toggle-switch`, `divider`,
`hyperlink`, `info-bar`, `label`.

- [ ] Prioritise the interactive ones (calendar/date/time pickers, number-box, tooltip)
- [ ] Add automated a11y assertions (axe) — the README makes a WAI-ARIA promise worth backing

### 17. Package metadata

- [ ] `CHANGELOG.md` (consider changesets)
- [ ] `homepage` and `bugs` fields in package.json
- [ ] `engines` field — `.npmrc` sets `engine-strict=true` but nothing declares engines, so it
      is currently a no-op
- [ ] Document the semver policy, especially what "undocumented component" means for breaking
      changes

### 18. Unify reduced-motion detection

Three implementations of the same check:

- `internal/transitions.ts` — local `reducedMotion()` function with a `typeof window` guard
- `internal/polyfills/expander.svelte.ts:18` — direct `window.matchMedia` inside a getter
- `providers/fluentui-svelte/fluentui-svelte.svelte` — `prefersReducedMotion` from `svelte/motion`

The provider's approach is the correct one and is already reactive.

- [ ] Route the other two through it (or through `runed`'s `MediaQuery`, already a dependency)

### 19. README polish

- [ ] "building fase" → "building phase"
- [ ] "recieve" → "receive"

---

## Release plan

**Before `npm publish`:** items 1–4.
**Before telling anyone:** items 5–9.
**Then:** 10–13 over the following releases.

Publish `0.1.0` with `npm publish --tag next` first. That allows installing and validating for
real without `npm i fluentui-svelte` resolving to it yet. Promote to `latest` once the smoke
test in item 4 is clean.

The name `fluentui-svelte` is currently free on npm (verified — registry returns 404).
