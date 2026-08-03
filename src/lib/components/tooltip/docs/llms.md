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

| Name               | Type                             | Description                                                                                                     |
| ------------------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `content`          | `string \| Snippet \| Component` | The content to be displayed in the tooltip. This can be a string, a Svelte component, or a Snippet.             |
| `positionConfig`   | `Partial<ComputePositionConfig>` | The position configuration of the tooltip. This allows you to define custom offsets, middleware, and more.      |
| `withArrow`        | `boolean`                        | Whether the tooltip should display an arrow pointing towards the target element.                                |
| `openDelay`        | `number`                         | The delay, in milliseconds, before the tooltip is shown after the user hovers over the target element.          |
| `hideDelay`        | `number`                         | The delay, in milliseconds, before the tooltip is hidden after the user stops hovering over the target element. |
| `onVisibleChange`  | `(visible: boolean) => void`     | A callback function that is called whenever the visibility of the tooltip changes.                              |
| `element`          | `HTMLElement`                    | The DOM reference of the tooltip element.                                                                       |
| Element Attributes |                                  | All other attributes that can be applied to the tooltip element.                                                |
