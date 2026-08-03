# Contributing to FluentUI Svelte

Thanks for your interest in contributing! This is a big project maintained by a
single person in their free time, so any help — code, docs, translations, bug
reports — genuinely makes a difference.

## Getting started

1. Fork and clone the repository.
2. Install dependencies: `pnpm install`
3. Start the dev/docs site: `pnpm dev`

## Before you open a PR

- Type-check: `pnpm check`
- Lint and format: `pnpm lint` (or `pnpm format` to auto-fix formatting)
- Unit tests: `pnpm test:unit`
- End-to-end tests: `pnpm test:e2e`

## Where to start

- Check the [open issues](https://github.com/JLAcostaEC/fluentui-svelte/issues)
  for something to work on.
- Found a bug or have a feature idea that isn't tracked yet? Open an issue
  before starting work on a large change, so we can align on the approach first.

## Translations

UI strings live in `messages/en.json` (source of truth) and `messages/es.json`.
If you're adding a new component or page, add the English string first and
either provide a Spanish translation or leave a note that one is needed.

## Component conventions

- Each component lives in its own folder under `src/lib/components/<name>/`,
  with its Svelte file, `types.ts`, and a `docs/docs.svx` page.
- Follow the existing accessibility patterns (ARIA attributes, keyboard
  navigation) used by similar components.
- Keep styling consistent with the existing design tokens (CSS custom
  properties prefixed with `--fs-`).

## Pull requests

- Keep PRs focused — one component/fix per PR is easier to review.
- Describe what changed and why in the PR description.
- Be patient — this is maintained part-time, so review may take a bit.
