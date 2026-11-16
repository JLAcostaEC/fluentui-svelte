# TeachingTip

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A TeachingTip is a flyout that points at an element to inform, remind and teach users about a feature. It is built on the `Flyout` and composed of parts: `TeachingTipPreview`, `TeachingTipHeader`, the content and `TeachingTipFooter`.

```svelte
<script>
	import { TeachingTip, TeachingTipPreview, TeachingTipHeader, TeachingTipFooter, Button } from 'fluentui-svelte';
	let open = $state(false);
	let target = $state(null);
</script>

{#snippet action()}
	<Button appearance="standard" onclick={() => (open = false)}>Got it</Button>
{/snippet}

<Button bind:ref={target} onclick={() => (open = !open)}>Save</Button>
<TeachingTip bind:open {target} placement="bottom">
	<TeachingTipPreview
		><img
			src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=320&fit=crop&q=60"
			alt=""
		/></TeachingTipPreview
	>
	<TeachingTipHeader title="Save automatically" />
	<p>Your changes are saved to the cloud as you work.</p>
	<TeachingTipFooter {action} />
</TeachingTip>
```

- `open` (bindable, `false` by default) shows and hides it. `onOpenChange(open)` runs when it closes from within: the close button, Escape, or a click outside with `lightDismiss`.
- `target` floats it against an element (`position: fixed`, no portal), with `placement` (`'top'` by default) and `positionConfig`. Without a target it stays in the normal flow.
- The parts throw outside a `TeachingTip`. Put `TeachingTipPreview` first for a preview at the top, or last for one at the bottom; it spans the full width.
- `TeachingTipHeader` takes `title` (a string renders an `h3`, see `headingLevel`), `icon`, `description`, `hideCloseButton` and `closeLabel` (`'Close'`).
- Step counter (outside the Fluent spec): set `step` and `totalSteps` on the header to show "1 of 3" next to the close button; `formatStep(step, totalSteps)` changes the text.
- `TeachingTipFooter` renders its `action` snippet; each action takes half of the width, aligned to the end.
- A non-modal `dialog`, named by the header title. It does not move the focus when it opens.

## TeachingTip Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TeachingTipProps -->

| Name                                                | Type                        | Default | Description                                                                                    |
| --------------------------------------------------- | --------------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                    | `HTMLElement` &#124; `null` |         | The DOM reference of the teaching tip element.                                                 |
| `id`                                                | `string`                    |         | The id of the teaching tip element. Falls back to a generated one.                             |
| `open` _bindable_                                   | `boolean`                   | `false` | Controls the open state of the teaching tip.                                                   |
| `onOpenChange`                                      | `(open: boolean) => void`   |         | Called whenever the teaching tip opens or closes from within.                                  |
| `target`                                            | `HTMLElement` &#124; `null` |         | The element the teaching tip points at. Without it, the teaching tip stays in the normal flow. |
| `placement`                                         | `Placement`                 | `'top'` | Where the teaching tip is placed relative to its target.                                       |
| `positionConfig`                                    | `ComputePositionConfig`     |         | The position configuration handed over to floating-ui.                                         |
| `lightDismiss`                                      | `boolean`                   | `false` | Closes the teaching tip on a click outside of it and its target.                               |
| `children`                                          | `Snippet`                   |         | The parts of the teaching tip: a preview, a header, the content and a footer.                  |
| `HTMLAttributes<HTMLDivElement>` without `children` |                             |         |                                                                                                |

<!-- /props:TeachingTipProps -->

## TeachingTipPreview Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TeachingTipPreviewProps -->

| Name                                                | Type                           | Default | Description                               |
| --------------------------------------------------- | ------------------------------ | ------- | ----------------------------------------- |
| `ref` _bindable_                                    | `HTMLDivElement` &#124; `null` |         | The DOM reference of the preview element. |
| `children`                                          | `Snippet`                      |         | The media to preview, usually an image.   |
| `HTMLAttributes<HTMLDivElement>` without `children` |                                |         |                                           |

<!-- /props:TeachingTipPreviewProps -->

## TeachingTipHeader Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TeachingTipHeaderProps -->

| Name                                                         | Type                                                       | Default   | Description                                                                                              |
| ------------------------------------------------------------ | ---------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                             | `HTMLDivElement` &#124; `null`                             |           | The DOM reference of the header element.                                                                 |
| `title`                                                      | `Snippet` &#124; `Component` &#124; `string`               |           | The title of the teaching tip. A snippet or a component receives the id the teaching tip is labelled by. |
| `headingLevel`                                               | `1` &#124; `2` &#124; `3` &#124; `4` &#124; `5` &#124; `6` | `3`       | The level of the heading that holds a string title, to fit the headings of the page around it.           |
| `icon`                                                       | `Snippet` &#124; `Component`                               |           | The icon rendered before the title.                                                                      |
| `description`                                                | `Snippet` &#124; `Component` &#124; `string`               |           | A second line of text below the title.                                                                   |
| `step`                                                       | `number`                                                   |           | The current step of a tour. The step counter shows when `totalSteps` is set too.                         |
| `totalSteps`                                                 | `number`                                                   |           | The number of steps of a tour. The step counter shows when `step` is set too.                            |
| `formatStep`                                                 | `(step: number, totalSteps: number) => string`             |           | Formats the text of the step counter, which reads "1 of 3" by default.                                   |
| `hideCloseButton`                                            | `boolean`                                                  |           | Removes the button that closes the teaching tip.                                                         |
| `closeLabel`                                                 | `string`                                                   | `'Close'` | The accessible name of the close button.                                                                 |
| `HTMLAttributes<HTMLDivElement>` without `children`, `title` |                                                            |           |                                                                                                          |

<!-- /props:TeachingTipHeaderProps -->

## TeachingTipFooter Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TeachingTipFooterProps -->

| Name                                                | Type                           | Default | Description                              |
| --------------------------------------------------- | ------------------------------ | ------- | ---------------------------------------- |
| `ref` _bindable_                                    | `HTMLDivElement` &#124; `null` |         | The DOM reference of the footer element. |
| `action`                                            | `Snippet` &#124; `Component`   |         | The actions rendered inside the footer.  |
| `HTMLAttributes<HTMLDivElement>` without `children` |                                |         |                                          |

<!-- /props:TeachingTipFooterProps -->
