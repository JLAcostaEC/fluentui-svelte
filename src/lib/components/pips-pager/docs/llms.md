# PipsPager

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A PipsPager is a row of dots (pips) that shows the current page in a paginated set, such as a FlipView, and lets users move to another page. Pair it with a FlipView through the same `index`.

```svelte
<script>
	import { FlipView, PipsPager } from 'fluentui-svelte';
	let index = $state(0);
</script>

<FlipView aria-label="Photos" bind:index style="height: 14rem;">
	<img src="/one.jpg" alt="One" />
	<img src="/two.jpg" alt="Two" />
	<img src="/three.jpg" alt="Three" />
</FlipView>
<PipsPager aria-label="Photos" numberOfPages={3} bind:index />
```

- `numberOfPages` is required; `bind:index` reads or changes the selected page and `onIndexChange` reports changes.
- `maxVisiblePips` (5) caps the visible pips; the rest scroll into view.
- `buttonVisibility` shows the previous and next buttons: `'hidden'` (default), `'visible'` or `'hover'` (on hover and focus). `wrap` loops past the ends.
- `showNumbers` replaces the dot with its page number on hover, on focus and briefly after a selection.
- Name it with `aria-label`; localize `previousLabel`, `nextLabel` and `formatPage`.
- Keyboard: Tab reaches the selected pip, the arrow keys, Home and End move the focus, Enter and Space select.

## Props

<!-- props:PipsPagerProps -->

| Name                       | Type                                           | Default                        | Description                                                                                |
| -------------------------- | ---------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------ |
| `index` _bindable_         | `number`                                       | `0`                            | The index of the selected page.                                                            |
| `numberOfPages`            | `number`                                       |                                | The number of pages.                                                                       |
| `maxVisiblePips`           | `number`                                       | `5`                            | The number of pips shown at once; the rest scroll into view.                               |
| `orientation`              | `'horizontal'` &#124; `'vertical'`             | `'horizontal'`                 | The direction the pips are laid out in.                                                    |
| `buttonVisibility`         | `'hidden'` &#124; `'visible'` &#124; `'hover'` | `'hidden'`                     | When the previous and next buttons are shown: never, always or on hover and focus.         |
| `wrap`                     | `boolean`                                      |                                | Whether the buttons and arrow keys wrap from the last page to the first and back.          |
| `showNumbers`              | `boolean`                                      |                                | Whether the page number replaces the dot on hover, on focus and briefly after a selection. |
| `previousLabel`            | `string`                                       | `'Previous page'`              | Accessible name of the previous button.                                                    |
| `nextLabel`                | `string`                                       | `'Next page'`                  | Accessible name of the next button.                                                        |
| `formatPage`               | `(page: number) => string`                     | `` (page) => `Page ${page}` `` | Returns the accessible name of each pip from its page number.                              |
| `onIndexChange`            | `(index: number) => void`                      |                                | Called when the selected page changes.                                                     |
| `ref` _bindable_           | `HTMLDivElement` &#124; `null`                 |                                | The root element.                                                                          |
| Element Attributes (`div`) |                                                |                                |                                                                                            |

<!-- /props:PipsPagerProps -->
