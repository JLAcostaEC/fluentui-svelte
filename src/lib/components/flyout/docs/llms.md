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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:FlyoutProps -->

| Name                       | Type                                                                      | Default    | Description                                                                     |
| -------------------------- | ------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| `ref` _bindable_           | `HTMLElement`                                                             |            | The DOM reference of the flyout element.                                        |
| `children`                 | `Snippet`                                                                 |            | The content of the flyout.                                                      |
| `floating`                 | `boolean`                                                                 | `false`    | Positions the flyout with floating-ui instead of leaving it in the normal flow. |
| `reference`                | `HTMLElement`                                                             |            | The element the flyout is positioned against when `floating` is set.            |
| `placement`                | `Placement`                                                               | `'bottom'` | Where the flyout is placed relative to its reference.                           |
| `onPlacementChange`        | `(placement: Placement) => void`                                          |            | Called whenever floating-ui settles on a different placement.                   |
| `roundCorners`             | `'all'` &#124; `'top'` &#124; `'bottom'` &#124; `'left'` &#124; `'right'` | `'all'`    | Which corners of the flyout are rounded.                                        |
| `offset`                   | `number`                                                                  | `8`        | The distance in pixels between the flyout and its reference.                    |
| `placementConfig`          | `AutoPlacementOptions`                                                    |            | The auto placement configuration handed over to floating-ui.                    |
| Element Attributes (`div`) |                                                                           |            |                                                                                 |

<!-- /props:FlyoutProps -->
