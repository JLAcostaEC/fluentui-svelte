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

| Name            | Type                  | Description                                                       |
| --------------- | --------------------- | ----------------------------------------------------------------- |
| `value`         | `number`              | The percentage of the progress ring that is filled.               |
| `min`           | `number`              | The minimum value of the progress ring. Default is 0.             |
| `max`           | `number`              | The maximum value of the progress ring. Default is 100.           |
| `size`          | `number`              | The size of the progress ring in pixels. Default is 32.           |
| `indeterminate` | `boolean`             | If true, the progress ring displays an indeterminate state.       |
| `hideRail`      | `boolean`             | If true, the progress ring hides the rail.                        |
| `status`        | `'paused' \| 'error'` | The status of the progress ring, for example 'paused' or 'error'. |
| `ref`           | `SVGElement`          | The DOM reference to the SVG element.                             |
| `railElement`   | `SVGCircleElement`    | The DOM reference to the rail element.                            |
| `trackElement`  | `SVGCircleElement`    | The DOM reference to the track element.                           |
