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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:SliderProps -->

| Name                       | Type                                          | Default        | Description                                                                              |
| -------------------------- | --------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| `value` _bindable_         | `number`                                      | `0`            | The current value of the slider.                                                         |
| `min`                      | `number`                                      | `0`            | The minimum value of the slider.                                                         |
| `max`                      | `number`                                      | `100`          | The maximum value of the slider.                                                         |
| `step`                     | `number`                                      | `1`            | How much the value moves on every step.                                                  |
| `ticks`                    | `number[]`                                    | `[]`           | The values the tick marks are drawn at.                                                  |
| `tickPlacement`            | `'around'` &#124; `'before'` &#124; `'after'` | `'around'`     | Where the tick marks sit relative to the rail.                                           |
| `prefix`                   | `string`                                      | `''`           | Text prepended to the value in the tooltip.                                              |
| `suffix`                   | `string`                                      | `''`           | Text appended to the value in the tooltip.                                               |
| `track`                    | `boolean`                                     | `true`         | Whether to fill the rail up to the current value.                                        |
| `orientation`              | `'horizontal'` &#124; `'vertical'`            | `'horizontal'` | The direction the slider runs in.                                                        |
| `reverse`                  | `boolean`                                     | `false`        | Runs the slider from the maximum to the minimum instead.                                 |
| `disabled`                 | `boolean`                                     | `false`        | Disables the user interaction.                                                           |
| `sync`                     | `boolean`                                     |                | Snaps the thumb to the pointer as soon as it is pressed, instead of stepping towards it. |
| `tooltip`                  | `boolean`                                     | `true`         | Whether to show the value in a tooltip while dragging.                                   |
| `tooltipPlacement`         | `Placement`                                   | `'top'`        | Where the tooltip is placed relative to the thumb.                                       |
| `tooltipContent`           | `string` &#124; `Snippet` &#124; `Component`  |                | Custom content for the tooltip, replacing the plain value.                               |
| `onChange`                 | `(value: number) => void`                     |                | Called whenever the value changes.                                                       |
| `class`                    | `string`                                      |                | The class to apply to the slider.                                                        |
| `ref` _bindable_           | `HTMLElement`                                 |                | The DOM reference of the slider element.                                                 |
| `inputRef` _bindable_      | `HTMLInputElement`                            |                | The DOM reference of the underlying input element.                                       |
| `thumbRef` _bindable_      | `HTMLElement`                                 |                | The DOM reference of the thumb element.                                                  |
| `tooltipRef` _bindable_    | `HTMLElement`                                 |                | The DOM reference of the tooltip element.                                                |
| `railRef` _bindable_       | `HTMLElement`                                 |                | The DOM reference of the rail element.                                                   |
| `trackRef` _bindable_      | `HTMLElement`                                 |                | The DOM reference of the track element.                                                  |
| `tickBarRef` _bindable_    | `HTMLElement`                                 |                | The DOM reference of the tick bar element.                                               |
| Element Attributes (`div`) |                                               |                |                                                                                          |

<!-- /props:SliderProps -->
