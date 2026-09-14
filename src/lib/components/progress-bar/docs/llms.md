# Progress Bar

A progress bar is a horizontal indicator that communicates the progress of an operation. Set `value` for determinate progress, or omit it for an indeterminate animation when the duration is unknown.

## Usage

```svelte
<script>
	import { ProgressBar } from 'fluentui-svelte';
</script>

<ProgressBar value={50} />
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props section below.

## Examples

### Value

The value prop sets the current progress value of the bar. It should be a number between 0 and 100.

```svelte
<ProgressBar value={30} />
<ProgressBar value={50} />
<ProgressBar value={70} />
```

### Indeterminate

If you do not set the value prop, the progress bar enters an indeterminate state, meaning it does not have a specific value. This is useful for operations where the duration is unknown.

```svelte
<ProgressBar indeterminate />
```

### Hide Rail

The hideRail prop can be used to hide the progress bar rail.

```svelte
<ProgressBar value={50} hideRail />
```

### Status

The status prop allows you to set the status of the progress bar to 'paused' or 'error'. This changes the color of the progress bar to indicate different states.

```svelte
<ProgressBar value={50} status="paused" />
<ProgressBar value={50} status="error" />
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ProgressBarProps -->

| Name                               | Type                        | Default | Description                                                                     |
| ---------------------------------- | --------------------------- | ------- | ------------------------------------------------------------------------------- |
| `value` _bindable_                 | `number` &#124; `null`      |         | The current value of the progress bar. Leave it unset for an indeterminate bar. |
| `class`                            | `string`                    |         | The class to apply to the progress bar.                                         |
| `ref` _bindable_                   | `SVGElement`                |         | The DOM reference of the progress bar element.                                  |
| `min`                              | `number`                    | `0`     | The minimum value of the progress bar.                                          |
| `max`                              | `number`                    | `100`   | The maximum value of the progress bar.                                          |
| `hideRail`                         | `boolean`                   |         | Whether to hide the rail element.                                               |
| `railElement` _bindable_           | `SVGRectElement`            |         | The DOM reference of the rail element.                                          |
| `secondaryTrackElement` _bindable_ | `SVGRectElement`            |         | The DOM reference of the secondary track element, used while indeterminate.     |
| `trackElement` _bindable_          | `SVGRectElement`            |         | The DOM reference of the track element.                                         |
| `status`                           | `'paused'` &#124; `'error'` |         | The current status of the progress bar, which recolors the track.               |
| Element Attributes                 |                             |         |                                                                                 |

<!-- /props:ProgressBarProps -->
