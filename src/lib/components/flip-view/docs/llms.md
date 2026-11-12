# FlipView

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A FlipView shows one item at a time, such as images or sections, and lets users flip through them with the buttons, swipes, the mouse wheel or the keyboard. Built with CSS scroll snapping, no dependencies.

```svelte
<script>
	import { FlipView } from 'fluentui-svelte';
	let index = $state(0);
</script>

<FlipView aria-label="Landscapes" bind:index style="height: 14rem;">
	<img src="/one.jpg" alt="One" />
	<img src="/two.jpg" alt="Two" />
</FlipView>
```

- Each direct child is an item and fills the FlipView. Give it a size (`height`, `width`); `orientation="vertical"` needs a height.
- `bind:index` reads or changes the visible item; `onIndexChange` reports changes.
- Name it with `aria-label`; localize `previousLabel` and `nextLabel`.

## Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:FlipViewProps -->

| Name                       | Type                               | Default        | Description                                   |
| -------------------------- | ---------------------------------- | -------------- | --------------------------------------------- |
| `index` _bindable_         | `number`                           | `0`            | The index of the visible item.                |
| `orientation`              | `'horizontal'` &#124; `'vertical'` | `'horizontal'` | The direction the items flip in.              |
| `previousLabel`            | `string`                           | `'Previous'`   | Accessible name of the previous button.       |
| `nextLabel`                | `string`                           | `'Next'`       | Accessible name of the next button.           |
| `onIndexChange`            | `(index: number) => void`          |                | Called when the visible item changes.         |
| `ref` _bindable_           | `HTMLDivElement` &#124; `null`     |                | The root element.                             |
| `viewportRef` _bindable_   | `HTMLDivElement` &#124; `null`     |                | The element that holds and scrolls the items. |
| Element Attributes (`div`) |                                    |                |                                               |

<!-- /props:FlipViewProps -->
