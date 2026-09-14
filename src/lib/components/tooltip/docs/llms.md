# Tooltip

A tooltip displays additional information about another component. The information is displayed above and near the target component.

## Usage

```svelte
<script>
	import { Tooltip, Button } from 'fluentui-svelte';
</script>

<Tooltip content="Tooltip content" relationship="description" withArrow>
	{#snippet children(attrs)}
		<Button {...attrs}>Hover over me</Button>
	{/snippet}
</Tooltip>
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

### Content

The content prop specifies the content to be displayed in the tooltip when the user hovers over the target element. This can be a string, a Svelte component, or a Snippet.

### Position

The positionConfig prop allows you to specify your own custom position using Floating UI's position configuration. This gives you more control over the placement of the tooltip, allowing you to define custom offsets, middleware, and more.

### With Arrow

The withArrow prop is a boolean that, when set to true, adds an arrow to the tooltip pointing towards the target element. This can help visually connect the tooltip to the element it is describing.

```svelte
<Tooltip content="Tooltip with arrow" relationship="description" withArrow>
	{#snippet children(attrs)}
		<Button {...attrs}>With arrow</Button>
	{/snippet}
</Tooltip>
```

### Delay

The openDelay and hideDelay props allow you to specify a delay, in milliseconds, before the tooltip is shown or hidden after the user hovers over the target element. This can help prevent the tooltip from appearing or disappearing too quickly.

```svelte
<Tooltip content="Delayed tooltip" openDelay={500} hideDelay={200}>
	{#snippet children(attrs)}
		<Button {...attrs}>Delayed</Button>
	{/snippet}
</Tooltip>
```

### onVisibleChange

The onVisibleChange prop is a callback function that is called whenever the visibility of the tooltip changes. This allows you to programmatically respond to the tooltip being shown or hidden.

### relationship

The relationship prop allows you to specify the relationship between the tooltip and the target element. This can be used for accessibility purposes, such as indicating that the tooltip is a description of the target element.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TooltipProps -->

| Name                                                | Type                                                     | Default            | Description                                                                                              |
| --------------------------------------------------- | -------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------- |
| `content`                                           | `string` &#124; `Snippet` &#124; `Component`             | `'I am a tooltip'` | The content to display in the tooltip.                                                                   |
| `class`                                             | `string`                                                 |                    | The class to apply to the tooltip.                                                                       |
| `ref` _bindable_                                    | `HTMLElement`                                            |                    | The DOM reference of the tooltip element.                                                                |
| `target`                                            | `HTMLElement`                                            |                    | The element the tooltip is anchored to. Falls back to the rendered children.                             |
| `open` _bindable_                                   | `boolean`                                                | `false`            | Controls the open state of the tooltip.                                                                  |
| `withArrow`                                         | `boolean`                                                | `false`            | Whether the tooltip has an arrow pointing at its target.                                                 |
| `positionConfig`                                    | `ComputePositionConfig`                                  |                    | The position configuration handed over to floating-ui.                                                   |
| `openDelay`                                         | `number`                                                 | `100`              | The delay in milliseconds before the tooltip is shown.                                                   |
| `hideDelay`                                         | `number`                                                 | `300`              | The delay in milliseconds before the tooltip is hidden.                                                  |
| `onVisibleChange`                                   | `(visible: boolean) => void`                             |                    | Callback function that is called when the visibility of the tooltip changes.                             |
| `relationship`                                      | `'label'` &#124; `'description'` &#124; `'inaccessible'` | `'label'`          | The relationship of the tooltip to its target, which decides how it is announced.                        |
| `placement`                                         | `Placement`                                              |                    | Where the tooltip is placed relative to its target.                                                      |
| `id`                                                | `string`                                                 |                    | The id of the tooltip element, referenced by the target. Falls back to a generated id.                   |
| `preventClose` _bindable_                           | `boolean`                                                | `false`            | Keeps the tooltip open until it is closed by hand.                                                       |
| `animationFrame`                                    | `boolean`                                                | `false`            | Repositions the tooltip on every animation frame, for a target that keeps moving.                        |
| `children`                                          | `Snippet`                                                |                    | The target of the tooltip. It receives the ARIA attributes and the attachment to spread on your element. |
| `HTMLAttributes<HTMLDivElement>` without `children` |                                                          |                    |                                                                                                          |

<!-- /props:TooltipProps -->
