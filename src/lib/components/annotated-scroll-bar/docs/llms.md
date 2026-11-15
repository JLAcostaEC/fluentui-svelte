# AnnotatedScrollBar

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A vertical scroll bar with labels for the content of an existing scrolling element, such as the years of a photo gallery. It does not scroll anything itself: pass the scrolling element as `scrollRef` and place the bar next to it, in a flex or grid row it fills the height of.

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:a410e0cfdb7743f6c0b80ba1f1f917188e3216d78b25fa6503472de4f6dae862 -->

```svelte
<script lang="ts">
	import { AnnotatedScrollBar } from 'fluentui-svelte';
	const galleryId = $props.id();
	let gallery = $state<HTMLDivElement | null>(null);
</script>

<div style="display:flex; gap:16px; height:320px">
	<div id={galleryId} bind:this={gallery} style="flex:1; overflow:auto">
		<section data-scroll-label="2024">...</section>
		<section data-scroll-label="2023">...</section>
	</div>
	<AnnotatedScrollBar scrollRef={gallery} aria-label="Photo timeline" />
</div>
```

<!-- /coderabbit-ai-generated:v1 -->

- Without `labels`, the bar reads them from the content: each element that `selector` matches, `'[data-scroll-label]'` by default, starts a label named after its `data-scroll-label`, `aria-label`, first heading or text. Elements with `data-scroll-subgroup` inside a match are its subgroups. The bar follows the content as it changes.
- `labels` is an array of `{ label, selector, subgroups? }` or `{ label, offset, subgroups? }`: `selector` matches the element where the label starts, `offset` is pixels from the top of the content. A virtualized list needs `offset`: its rows are not all rendered.
- The default detail and `aria-valuetext` read as `2024: June, July`.
- A label runs to the next one. A subgroup from the content spans its element; one at a number of pixels runs to the next subgroup.
- `detail` is a snippet for the tooltip that previews a position: it gets `{ offset, label, subgroups }`. Keep it noninteractive.
- `onScrolling(offset, kind)` runs before the bar scrolls; return `false` to cancel. `kind` is `click`, `drag`, `arrow`, `wheel` or `keyboard`.
- One tab stop. Arrow keys scroll by `arrowStep`, Page Up and Page Down by a viewport, Home and End to the ends; Escape closes the detail.
- Name it with `aria-label`, `aria-labelledby` or a `Label`. The bar is off when `disabled` or when the content fits.

## Props

<!-- props:AnnotatedScrollBarProps -->

| Name                                                | Type                                                                                                                             | Default                 | Description                                                                    |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------ |
| `scrollRef`                                         | `HTMLElement` &#124; `null`                                                                                                      |                         | The element to scroll.                                                         |
| `labels`                                            | `readonly AnnotatedScrollBarLabel[]`                                                                                             |                         | The labels. Without them, the bar reads them from the content with `selector`. |
| `selector`                                          | `string`                                                                                                                         | `'[data-scroll-label]'` | A CSS selector of the elements in the content that start a label.              |
| `position`                                          | `'left'` &#124; `'right'`                                                                                                        | `'right'`               | The side of the content the bar is on.                                         |
| `arrowStep`                                         | `number`                                                                                                                         | `48`                    | Pixels scrolled per arrow press.                                               |
| `labelSpacing`                                      | `number`                                                                                                                         | `4`                     | The minimum space in pixels between labels.                                    |
| `hideArrows`                                        | `boolean`                                                                                                                        |                         | Hides the arrow buttons.                                                       |
| `hideSubgroups`                                     | `boolean`                                                                                                                        |                         | Hides the subgroup labels on the rail.                                         |
| `disabled`                                          | `boolean`                                                                                                                        |                         | Disables the bar.                                                              |
| `detail`                                            | `Snippet`                                                                                                                        |                         | The content of the tooltip that previews a position.                           |
| `onScrolling`                                       | `(offset: number, kind: 'click'` &#124; `'drag'` &#124; `'arrow'` &#124; `'wheel'` &#124; `'keyboard') => boolean` &#124; `void` |                         | Called before the bar scrolls the content. Return `false` to cancel.           |
| `ref` _bindable_                                    | `HTMLDivElement` &#124; `null`                                                                                                   |                         | The root element.                                                              |
| `HTMLAttributes<HTMLDivElement>` without `children` |                                                                                                                                  |                         |                                                                                |

<!-- /props:AnnotatedScrollBarProps -->
