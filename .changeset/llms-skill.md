---
'fluentui-svelte': patch
---

docs: agent skill and LLM-friendly docs (#60)

- The package ships an agent skill, `skills/fluentui-svelte/SKILL.md`: setup, the conventions every component shares, forms, overlays, SSR, the mistakes that throw and an index of the components. Install it with `npx skills add JLAcostaEC/fluentui-svelte --skill fluentui-svelte`, or link the copy inside the package with `npx skills experimental_sync`. It points agents to the `llms.md` of each component in `node_modules`, so the guide matches the installed version.
- Every `llms.md` starts with a pointer to the global guide, and its examples import icons from their own file (`fluentui-icons-svelte/AddRegular.svelte`).
- The docs site publishes `/llms.txt`, `/llms-full.txt`, `/docs/llms.md` and `/docs/components/<name>.md` (the old `/docs/components/<name>/llms` still works), a new "AI & LLMs" page, and "Copy as Markdown" / "View as Markdown" buttons on every component page.
