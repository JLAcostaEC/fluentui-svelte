# Flyout

The Flyout component is a floating panel that can be used to display additional information or options in a non-intrusive way. It is fully accessible and follows Fluent UI design principles for a seamless user experience.

## Usage

```svelte
<script>
	import { Flyout } from 'fluentui-svelte';
</script>

<Flyout>
	<p>This is the content of the flyout.</p>
</Flyout>
```

The Flyout.

## Component Props

| Name | Type | Description |
| --- | --- | --- |
| `ref` | Bindable `HTMLElement` | The DOM reference to the flyout element. |
| `children` | `Snippet` | The content to be displayed inside the flyout. |
| `floating` | `boolean` | Whether to use Floating UI for positioning. Default: false. |
| `reference` | `HTMLElement` | The reference element for Floating UI. |
| `placement` | `Placement` | The placement for Floating UI positioning. Default: 'bottom'. |
| `onPlacementChange` | `(placement: Placement) => void` | A callback that is called when the placement changes. |
| `roundCorners` | `'all' \| 'top' \| 'bottom' \| 'left' \| 'right'` | Which corners to round. Default: 'all'. |
| `offset` | `number` | The offset for Floating UI positioning. Default: 8. |
| Element Attributes | | All other attributes that can be applied to the flyout element. |
