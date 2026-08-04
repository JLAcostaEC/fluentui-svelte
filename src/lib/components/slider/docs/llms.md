# Slider

A slider lets users select a value from a continuous or discrete range by dragging a thumb along a track. It supports horizontal and vertical orientations, tick marks, a value tooltip and reverse direction.

## Usage

```svelte
<script>
	import { Slider } from 'fluentui-svelte';
</script>

<Slider value={50} min={0} max={100} />
```

## Component API

A slider allows users to select a value from a continuous or discrete range by moving a thumb along a track. It supports horizontal and vertical orientations, ticks, tooltips, and reverse direction.

## Examples

### Range and Step

Use the `min`, `max`, and `step` props to control the range of values and the increment between them.

```svelte
<Slider value={20} min={0} max={50} step={5} />
```

### Ticks

Provide an array of values to the `ticks` prop to render tick marks along the track. Use `tickPlacement` to position them `around`, `before`, or `after` the rail.

```svelte
<Slider value={50} step={25} ticks={[0, 25, 50, 75, 100]} />
```

### Vertical Orientation

Set `orientation="vertical"` to lay the slider out vertically.

```svelte
<Slider value={40} orientation="vertical" />
```

### Disabled

Set the `disabled` prop to prevent interaction with the slider.

```svelte
<Slider value={30} disabled />
```

## Component Props

| Name               | Type                              | Description                                                                |
| ------------------ | --------------------------------- | -------------------------------------------------------------------------- |
| `value`            | `number`                          | The current value of the slider. Bindable. Default: `0`.                   |
| `min`              | `number`                          | The minimum value of the range. Default: `0`.                              |
| `max`              | `number`                          | The maximum value of the range. Default: `100`.                            |
| `step`             | `number`                          | The increment between selectable values. Default: `1`.                     |
| `ticks`            | `number[]`                        | An array of values at which to render tick marks. Default: `[]`.           |
| `tickPlacement`    | `'around' \| 'before' \| 'after'` | Where tick marks are placed relative to the rail. Default: `around`.       |
| `prefix`           | `string`                          | Text prepended to the value shown in the tooltip. Default: `''`.           |
| `suffix`           | `string`                          | Text appended to the value shown in the tooltip. Default: `''`.            |
| `track`            | `boolean`                         | Whether the filled track is shown. Default: `true`.                        |
| `orientation`      | `'horizontal' \| 'vertical'`      | The layout direction of the slider. Default: `horizontal`.                 |
| `reverse`          | `boolean`                         | Reverses the direction of the slider. Default: `false`.                    |
| `disabled`         | `boolean`                         | Whether the slider is disabled. Default: `false`.                          |
| `sync`             | `boolean`                         | Snaps the initial value to the nearest step on initialization.             |
| `tooltip`          | `boolean`                         | Whether the value tooltip is shown while interacting. Default: `true`.     |
| `tooltipPlacement` | `Placement`                       | The placement of the tooltip relative to the thumb. Default: `top`.        |
| `tooltipContent`   | `string \| Snippet \| Component`  | Custom content for the tooltip. Defaults to `prefix` + `value` + `suffix`. |
| `onChange`         | `(value: number) => void`         | Callback fired when the value changes.                                     |
| `class`            | `string`                          | Additional CSS classes applied to the slider.                              |
| `ref`              | `HTMLElement`                     | The DOM reference of the slider element. Bindable.                         |
