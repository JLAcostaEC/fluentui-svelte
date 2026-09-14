# Progress Ring

A circular progress indicator that shows determinate or indeterminate progress, with paused and error states.

## Usage

```svelte
<script>
	import { ProgressRing } from 'fluentui-svelte';
</script>

<ProgressRing value={50} />
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

## Examples

### Value

The value prop determines the percentage of the progress ring that is filled. It should be a number between 0 and 100.

```svelte
<ProgressRing value={0} />
<ProgressRing value={25} />
<ProgressRing value={50} />
<ProgressRing value={75} />
<ProgressRing value={100} />
```

### Indeterminate

The indeterminate prop allows the progress ring to display an indeterminate state, which is useful when the progress cannot be determined.

```svelte
<ProgressRing indeterminate />
<ProgressRing indeterminate status="paused" />
<ProgressRing indeterminate status="error" />
```

### Hide Rail

The hideRail prop allows the progress ring to hide the rail, which is a background track for the progress indicator.

```svelte
<ProgressRing value={50} hideRail />
<ProgressRing value={75} hideRail />
<ProgressRing value={100} hideRail />
```

### Status

The status prop allows you to set the status of the progress ring for visual feedback. It accepts values such as 'paused' or 'error'.

```svelte
<ProgressRing value={40} />
<ProgressRing value={50} status="paused" />
<ProgressRing value={75} status="error" />
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ProgressRingProps -->

| Name                      | Type                        | Default | Description                                                        |
| ------------------------- | --------------------------- | ------- | ------------------------------------------------------------------ |
| `value` _bindable_        | `number`                    | `0`     | The current value of the progress ring.                            |
| `min`                     | `number`                    | `0`     | The minimum value of the progress ring.                            |
| `max`                     | `number`                    | `100`   | The maximum value of the progress ring.                            |
| `indeterminate`           | `boolean`                   |         | Spins the ring continuously instead of reporting a value.          |
| `hideRail`                | `boolean`                   |         | Whether to hide the rail element.                                  |
| `size`                    | `number`                    | `32`    | The size of the progress ring in pixels.                           |
| `ref` _bindable_          | `SVGElement`                |         | The DOM reference of the progress ring element.                    |
| `railElement` _bindable_  | `SVGCircleElement`          |         | The DOM reference of the rail element.                             |
| `trackElement` _bindable_ | `SVGCircleElement`          |         | The DOM reference of the track element.                            |
| `status`                  | `'paused'` &#124; `'error'` |         | The current status of the progress ring, which recolors the track. |
| `class`                   | `string`                    |         | The class to apply to the progress ring.                           |
| Element Attributes        |                             |         |                                                                    |

<!-- /props:ProgressRingProps -->
