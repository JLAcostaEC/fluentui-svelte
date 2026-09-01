<p align="center">
	<picture>
  		<source media="(prefers-color-scheme: dark)" srcset="https://github.com/JLAcostaEC/fluentui-svelte/blob/main/static/images/banner-white.png?raw=true" height="130" style="margin-bottom: 20px">
  		<img alt="Fluent UI Svelte Logo" src="https://github.com/JLAcostaEC/fluentui-svelte/blob/main/static/images/banner.png?raw=true" height="130" style="margin-bottom: 20px"/>
	</picture>
</p>

<p align="center">
  Modern components based on <a href="https://learn.microsoft.com/en-us/windows/apps/design/">Microsoft's Fluent UI</a> for Svelte 5.
</p>

## Features

- Svelte 5 components!
- All components are accessible following [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) standards.
- Semantic HTML & Native Behavior Elements (Like: `<dialog></dialog>` or `<details></details>`)
- Reduced motion supported.
- Keyboard navigation handled by [Tabspot](https://github.com/JLAcostaEC/tabspot), so arrow keys, roving
  tabindex and `aria-activedescendant` behave the same across every component.

## Browser support

> [!IMPORTANT]
> The library relies on CSS features that, for now, ship only in Chromium-based browsers
> (Chrome, Edge, Opera, Brave). In Firefox and Safari some styles will not render correctly.

What the source actually depends on, and what it costs elsewhere:

| Feature                 | Used for                              | Outside Chromium                              |
| ----------------------- | ------------------------------------- | --------------------------------------------- |
| `field-sizing: content` | the TextArea growing with its content | no auto-grow; the textarea keeps its set size |
| `mask` (unprefixed)     | acrylic noise, the tooltip arrow      | needs `-webkit-mask`; overlays can look flat  |
| `backdrop-filter`       | the acrylic blur behind flyouts       | falls back to a solid surface                 |
| `color-mix()`, `:has()` | tokens and state-driven styling       | supported in current Firefox and Safari       |

Behaviour and accessibility are unaffected — what degrades is visual. If you need those
browsers today, treat the current release as a known limitation rather than a target.

## Installation

```sh
pnpm add fluentui-svelte
# npm install fluentui-svelte
# yarn add fluentui-svelte
```

## Setup

### 1. Import the stylesheets

The library ships its theme as plain CSS. Import it once, at the root of your app
(`src/routes/+layout.svelte` in SvelteKit):

```svelte
<script>
	import 'fluentui-svelte/theme.css';
	import 'fluentui-svelte/reset.css';
	import 'fluentui-svelte/typography.css';
	import 'fluentui-svelte/class-darkmode.css';
</script>
```

| Stylesheet           | What it does                                                                   |
| -------------------- | ------------------------------------------------------------------------------ |
| `theme.css`          | Design tokens. **Required** — every component reads its colours from here.     |
| `reset.css`          | Opinionated reset. Optional, but the components are designed against it.       |
| `typography.css`     | Fluent type ramp and the `.fs-*` text helpers. Optional.                       |
| `class-darkmode.css` | Dark theme, switched by a class on `<html>`. Pick this **or** the next.        |
| `media-darkmode.css` | Dark theme, switched by `prefers-color-scheme`. Pick this **or** the previous. |

### 2. Wrap your app in the provider

`FluentUISvelte` starts the keyboard-navigation engine and carries the reduced-motion and theme
preferences. Without it the components still render, but arrow-key navigation does not work:

```svelte
<script>
	import { FluentUISvelte } from 'fluentui-svelte';

	let { children } = $props();
</script>

<FluentUISvelte>
	{@render children()}
</FluentUISvelte>
```

## Usage

```svelte
<script>
	import { TextBox, Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogContent } from 'fluentui-svelte';

	let name = $state('');
</script>

<TextBox bind:value={name} placeholder="Your name" />

<Dialog>
	<DialogTrigger>Say hello</DialogTrigger>
	<DialogSurface>
		<DialogTitle>Greeting</DialogTitle>
		<DialogContent>Hello, {name || 'stranger'}.</DialogContent>
	</DialogSurface>
</Dialog>
```

Every component is exported from the package root. Prop tables live next to each component in
`src/lib/components/<name>/docs/`, and the same content is published for AI agents as
`llms.md` inside the package.

### Running the documentation site

The docs site is the reference while the hosted version is being built:

```sh
pnpm install
pnpm dev
```

## Component status

The documentation site is currently in the building phase, and not every component exported by
the library is documented yet.

Any undocumented component is **considered to be in the 0.x phase of development**. It may
receive breaking API changes, or be heavily reworked, before it is finalised. Components carry
a status badge in the navigation — `Beta`, `Experimental`, `Prototype` and `WIP` all mean the
API is still moving.

## Bugs and feature requests

- **Found a bug?** Open a [bug report](https://github.com/JLAcostaEC/fluentui-svelte/issues/new?template=bug_report.yml).
  Please include the browser, the Svelte version, and a minimal reproduction — a
  [SvelteLab](https://sveltelab.dev) or StackBlitz link is ideal.
- **Want a component or a prop?** Open a
  [feature request](https://github.com/JLAcostaEC/fluentui-svelte/issues/new?template=feature_request.yml)
  and say which Fluent UI / WinUI control it maps to.
- **Security issue?** Please do not open a public issue — contact the maintainer directly.

Before filing, a quick search of the
[open issues](https://github.com/JLAcostaEC/fluentui-svelte/issues) saves everyone a round trip.

## Contributing

This is a large project maintained by one person in their free time, so help is genuinely
welcome — code, documentation, translations and bug reports alike. Start with
[CONTRIBUTING.md](./CONTRIBUTING.md).

```sh
pnpm install      # install dependencies
pnpm dev          # docs site with hot reload
pnpm check        # svelte-check
pnpm lint         # prettier + eslint
pnpm test:unit    # vitest (browser mode, Chromium)
```

UI strings live in `messages/en.json` (source of truth) and `messages/es.json`. Prop tables are
generated by [propsmith](https://www.npmjs.com/package/@jlacostaec/propsmith) — run `pnpm exec propsmith`
after changing a prop's JSDoc rather than editing the generated tables by hand.

## Resources

> ### [Windows UI Kit - Figma File](https://www.figma.com/community/file/1440832812269040007)
>
> The Windows UI Toolkit is a resource for creating experiences on Windows. It contains a control library and examples of how those controls are used within the WinUI platform.

> ### Official Gallery Docs: [WinUI 3 Gallery](https://apps.microsoft.com/detail/9p3jfpwwdzrc)
>
> This app demonstrates all of the Windows UI 3 library controls and styles available to make a WinUI 3 app with the Windows App SDK.

> ### Documentation: [Microsoft's Fluent UI](https://learn.microsoft.com/en-us/windows/apps/design/)
>
> Design guidelines and UI code examples for creating Windows app experiences.

> ### [Fluent UI 2 Web - Figma File](https://www.figma.com/community/file/836828295772957889)
>
> Explore the next evolution of Microsoft's design system with the Fluent 2 Web UI Kit.

## Credits

> - [Microsoft's Fluent UI](https://learn.microsoft.com/en-us/windows/apps/design/): Thank Microsoft for creating this masterpiece.
> - [Fluent Svelte](https://github.com/Tropix126/fluent-svelte): Which was unfortunately abandoned.

## Notes

> [!IMPORTANT]
> This repository is not affiliated with or connected to Microsoft in any way. It is merely an open-source package that provides their components to use with Svelte 5 applications.

> [!NOTE]
> This package is not an exact port/reimplementation of Fluent UI (React, Web or any other official/unofficial variation), many features/APIs are not the same as those described in the Fluent UI documentation.

## License

[MIT](./LICENSE) © Jorge Acosta
