# SegmentedControl

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A compact group of native radio inputs. Import `SegmentedControl`, `SegmentedControlItem` and optionally `Label` from `fluentui-svelte`. Native radio keyboard interaction and forms work without a provider. `FluentUISvelte` adds tabspot navigation, including Home/End.

Bind `selectedValue` to a unique string `value` on an item. The initial default is an empty selection. Give the group an `aria-label` or `aria-labelledby`; give icon-only items an `aria-label`. Use `icon` for a component or snippet, and children for label text.

Wrap the group in `Label` to name it automatically. Each option keeps its own label. An explicit `aria-label` or `aria-labelledby` on the group overrides the Label context.

Set `name="view"` on the group to submit the selected string in FormData. A unique generated name keeps unrelated groups independent when no name is supplied. `required` enables native validation. `form="form-id"` associates every radio with an external form. Disabled items are excluded from submission. Reset restores the initial selection and the bound selectedValue, without calling onSelectionChange.

Arrow keys move focus without changing selection; Space or Enter checks the focused radio. Set `selectOnFocus` to select during keyboard navigation. Home/End move to the first/last enabled radio. Tab enters at the checked radio and leaves the group in one step. Disabled items are skipped. This control does not create tab panels.

Item `ref` is an HTMLInputElement. Native input attributes and event handlers are forwarded to that input; `class` and `style` customize the visible segment. `onSelectionChange(event, value)` runs for user changes only. Programmatic selection changes and reset do not emit it.

Segments have equal widths by default; use `equalWidth={false}` to fit content. Small, medium and large sizes adjust both the segment and its text. Use `hideIndicator` to hide the selection indicator. Set `validationMessage` to customize the native message for an unanswered required group. The root's `disabled` prop disables every item; an item's `disabled` prop disables just that item.

## SegmentedControl props

<!-- props:SegmentedControlProps -->

| Name                       | Type                                         | Default    | Description                                                                     |
| -------------------------- | -------------------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| `ref` _bindable_           | `HTMLDivElement` &#124; `null`               |            | The DOM reference of the control.                                               |
| `selectedValue` _bindable_ | `string`                                     |            | The value of the selected item. An empty value leaves all items unselected.     |
| `name`                     | `string`                                     |            | The field name shared by every radio. Defaults to a unique generated name.      |
| `form`                     | `string`                                     |            | The id of the form that owns the radios, when outside that form.                |
| `required`                 | `boolean`                                    | `false`    | Requires a selection before the form can be submitted.                          |
| `validationMessage`        | `string`                                     |            | Custom native validation message when a required selection is missing.          |
| `hideIndicator`            | `boolean`                                    | `false`    | Hides the accent indicator beneath the selected segment.                        |
| `selectOnFocus`            | `boolean`                                    | `false`    | Selects the focused segment during arrow-key navigation.                        |
| `onSelectionChange`        | `(event: Event, value: string) => void`      |            | Fired when user interaction changes the selection.                              |
| `size`                     | `'small'` &#124; `'medium'` &#124; `'large'` | `'medium'` | The size of every segment.                                                      |
| `equalWidth`               | `boolean`                                    | `true`     | Gives every segment the same width. Disable to fit each segment to its content. |
| `disabled`                 | `boolean`                                    | `false`    | Disables every segment.                                                         |
| `disableTabspot`           | `boolean`                                    | `false`    | Disables tabspot keyboard navigation.                                           |
| HTML Attributes            |                                              |            |                                                                                 |

<!-- /props:SegmentedControlProps -->

## SegmentedControlItem props

<!-- props:SegmentedControlItemProps -->

| Name             | Type                             | Default | Description                                                                  |
| ---------------- | -------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `ref` _bindable_ | `HTMLInputElement` &#124; `null` |         | The DOM reference of the native radio input.                                 |
| `value`          | `string`                         |         | A unique value identifying this segment within its control.                  |
| `icon`           | `Snippet` &#124; `Component`     |         | An optional icon. Give icon-only items an accessible name with `aria-label`. |
| `disabled`       | `boolean`                        | `false` | Disables this segment.                                                       |
| `children`       | `Snippet`                        |         | The content of the segment's label.                                          |
| HTML Attributes  |                                  |         |                                                                              |

<!-- /props:SegmentedControlItemProps -->
