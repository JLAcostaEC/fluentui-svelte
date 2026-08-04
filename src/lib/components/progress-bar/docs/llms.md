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

| Name                    | Type                           | Description                                               |
| ----------------------- | ------------------------------ | --------------------------------------------------------- |
| `value`                 | bindable `number \| undefined` | The current progress value of the bar, between 0 and 100. |
| `indeterminate`         | `boolean`                      | If true, the progress bar enters an indeterminate state.  |
| `hideRail`              | `boolean`                      | If true, the progress bar rail is hidden.                 |
| `status`                | `'paused' \| 'error'`          | The current status of the progress bar.                   |
| `element`               | bindable `SVGElement`          | The DOM reference of the progress bar element.            |
| `railElement`           | bindable `SVGRectElement`      | The DOM reference of the rail element.                    |
| `trackElement`          | bindable `SVGRectElement`      | The DOM reference of the track element.                   |
| `secondaryTrackElement` | bindable `SVGRectElement`      | The DOM reference of the secondary track element.         |
