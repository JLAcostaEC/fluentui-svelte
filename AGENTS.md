## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, vitest, playwright, mdsvex, paraglide, mcp

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

---

## Tooling

- `pnpm dev` runs `pnpm urls` first. A new component's docs page returns 500 until `pnpm urls` has run.
- `pnpm check`, `pnpm lint` and `pnpm exec vitest --run <path>` must pass before handing work over.
- `npx propsmith` regenerates the prop tables and `messages/en.json`; `npx propsmith check` must show no `catalog-*` warnings.
- Prefer CSS and existing helpers over new dependencies. A runtime import goes in `dependencies`.

## New component steps

1. `src/lib/components/<name>/`: `<name>.svelte`, `types.ts` (`/** @propsmith XProps */`), `tests/`, `docs/` (`meta.ts`, `index.ts`, `docs.svx`, `examples.svx`, `footer.svx`, `llms.md`).
2. Export it in `src/lib/index.ts` between `// Start X Component` and `// End X Component`.
3. Add it to `skills/fluentui-svelte/SKILL.md`, in alphabetical order.
4. Add the `<name>_*` messages to `en.json` and `es.json`, run `npx propsmith`, translate the new `generated_fs_*` keys in `es.json`, delete any `*.stale.json`, keep tab indentation.
5. Add a changeset: `minor` for a feature, `patch` for a fix.
6. Run `pnpm urls`, then check the page in light and dark once it has finished loading.
7. Never commit or push unless asked.

## Documentation rules

- Every `.svx` starts with a `<script>` block.
- Prop JSDoc: one short sentence ("The current value of the slider."). The page description says what the component is.
- Never edit between `<!-- props:X -->` markers; change the JSDoc instead.
- Wrap `<I18nMarkupMessage>` in `<p>`.
- Examples show the component on a visible surface, in its visible state. Group variants in one `Showcase` with `columns`, each in a `figure` with a `figcaption`.
- External images: confirm the host responds before using it.

## Wording and naming

- Never use the connector "so" or the em dash (—) in code, comments, docs, messages or changesets.
- Be concise; no filler.
- Boolean props default to `false`: name them `hideX` or `showX`, never `x={false}`.
- Component names follow Fluent and the issue title.
- Modifier classes use the `fs-<component>-` prefix. Styles for DOM the component does not own (third-party or a passed element) go in `:global`.
- Colors come from `--fs-*` tokens; icons from `fluentui-icons-svelte`.

## Component code

- The API matches existing components: same prop names, types and patterns (`ref`, `as`, `$bindable`, `*Label`, shared types from `#types`).
- Internal code is ordered and follows existing components. Parent/child components share state through context (see `AutoSuggestBox`, `TreeView`).
- Prefer the Svelte API over the native one: `bind:this` over `document.querySelector` or an attachment for a reference, `on()` over `addEventListener`, `SvelteMap`/`SvelteSet` only when reactivity is needed.
- Comments: short and only where needed, for logic a human would not read at a glance. No narration of what the code already says.
- Spacing: group related lines and separate groups with one blank line; avoid both dense walls and a blank line after every statement.
- Write component styles with CSS nesting (`&:has(...)`, `&.modifier`, nested children); use flat selectors only when nesting cannot express the rule.
- SvelteKit 3: there is no `svelte.config.js/ts`; configuration lives in `vite.config.ts`.
- The docs deploy to Cloudflare, with a 25 MB build limit. Do not preload heavy assets or import what is not needed.

## Tests

- Few and direct: cover behavior that can break (API, keyboard, forms, edge cases), not every variant.

## Docs meta

- Every component has a `docs/meta.ts`.
- `status` is `'New'` by default; `'Prototype'`, `'Experimental'`, `'Beta'` or `'WIP'` when it is incomplete or has known issues; `'AI'` when an LLM wrote more than 51% of it; `'Empty'` when it exports or renders nothing yet.
