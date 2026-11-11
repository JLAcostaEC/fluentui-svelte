# ColorPicker

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

Choose a color with a hue/saturation spectrum, brightness and optional opacity sliders, and RGB or HSV fields.

```svelte
<script>
	import { ColorPicker, Label } from 'fluentui-svelte';
	let color = $state('#0078d4');
</script>

<Label label="Accent color">
	<ColorPicker name="accent" bind:value={color} defaultValue="#0078d4" shape="circular" alpha />
</Label>
```

- `shape`: the shared `Shapes` type: `rounded` (default), `square` or `circular`.
- `orientation`: `vertical` (default) or `horizontal`.
- `format`: bindable `rgb` (default) or `hsv`. Changing format preserves the color.
- `collapsed`: bindable; hides channel fields until More is pressed.
- `alpha`: enables opacity editing and hexadecimal alpha output.
- `value`: bindable CSS color. User edits emit hexadecimal strings; external updates synchronize the controls.
- RGB fields clamp to integers from 0 to 255, hue from 0 to 360, and percentages from 0 to 100. Empty fields restore the selected channel on blur. The Hex editor accepts 3/6 hexadecimal digits (also 4/8 with `alpha`), with an optional `#`; invalid edits restore the selected color.
- Native `name`, `form`, `required`, `disabled`, `readonly`, `pattern`, `oninput` and `onchange` apply to the single submitted text field. `defaultValue` is restored on form reset. Internal controls have no form names.
- Use `Label`, `aria-label`, or `aria-labelledby` to name the picker. Hue and saturation use native keyboard ranges; Left/Right move the spectrum marker horizontally and Up/Down move it vertically. Both coordinates are announced. Other channels use native number fields and sliders.
- Localize `label`, `formatLabel`, `channelLabels`, `moreLabel`, `lessLabel` and `validationMessage` as needed.

## Props

<!-- props:ColorPickerProps -->

| Name                                                                                                            | Type                                                                                                                                                             | Default          | Description                                                                  |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------- |
| `channelLabels`                                                                                                 | `Partial< Record<'hue'` &#124; `'saturation'` &#124; `'brightness'` &#124; `'opacity'` &#124; `'red'` &#124; `'green'` &#124; `'blue'` &#124; `'hex', string> >` |                  | Accessible channel labels, overriding the English defaults.                  |
| `value` _bindable_                                                                                              | `string`                                                                                                                                                         |                  | The CSS color submitted by the field. User edits produce hexadecimal colors. |
| `defaultValue`                                                                                                  | `string`                                                                                                                                                         | `'#ffffff'`      | Initial color and the value restored by a native form reset.                 |
| `shape`                                                                                                         | `'circular'` &#124; `'rounded'` &#124; `'square'`                                                                                                                | `'rounded'`      | Shape of the hue/saturation spectrum.                                        |
| `orientation`                                                                                                   | `'vertical'` &#124; `'horizontal'`                                                                                                                               | `'vertical'`     | Arrangement of the spectrum, sliders and fields.                             |
| `collapsed` _bindable_                                                                                          | `boolean`                                                                                                                                                        |                  | Hides the channel fields until the user expands them.                        |
| `format` _bindable_                                                                                             | `'rgb'` &#124; `'hsv'`                                                                                                                                           | `'rgb'`          | Channel fields displayed in the editor.                                      |
| `alpha`                                                                                                         | `boolean`                                                                                                                                                        |                  | Enables the opacity slider and alpha channel.                                |
| `label`                                                                                                         | `string`                                                                                                                                                         | `'Color picker'` | Accessible name of the picker.                                               |
| `formatLabel`                                                                                                   | `string`                                                                                                                                                         | `'Color format'` | Accessible name of the channel format selector.                              |
| `moreLabel`                                                                                                     | `string`                                                                                                                                                         | `'More'`         | Label of the expansion control.                                              |
| `lessLabel`                                                                                                     | `string`                                                                                                                                                         | `'Less'`         | Label of the collapse control.                                               |
| `validationMessage`                                                                                             | `string`                                                                                                                                                         |                  | Message used for an invalid CSS color.                                       |
| `onColorChange`                                                                                                 | `(value: string) => void`                                                                                                                                        |                  | Reports a user color edit.                                                   |
| `ref` _bindable_                                                                                                | `HTMLInputElement` &#124; `null`                                                                                                                                 |                  | Native form field reference.                                                 |
| `wrapperRef` _bindable_                                                                                         | `HTMLDivElement` &#124; `null`                                                                                                                                   |                  | Visible picker reference.                                                    |
| `wrapperAttributes`                                                                                             | `HTMLAttributes<HTMLDivElement>`                                                                                                                                 |                  | Attributes for the visible picker.                                           |
| `NativeFieldAttributes<HTMLInputAttributes>` without `value`, `defaultValue`, `type`, `size`, `children`, `on:` |                                                                                                                                                                  |                  |                                                                              |

<!-- /props:ColorPickerProps -->
