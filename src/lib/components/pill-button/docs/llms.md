# PillButton

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A native checkbox styled as a Fluent 2 pill. Use it for independent filters or multiple choices. Its role is checkbox; Space toggles it. It uses the existing theme tokens in light and dark themes.

```svelte
<script>
	import { PillButton } from 'fluentui-svelte';
	let unread = $state(false);
</script>

<PillButton name="filter" value="unread" bind:checked={unread}>Unread</PillButton>
```

## Forms

Native input attributes go on the component: `name`, `value`, `form`, `required`, `defaultChecked`, `disabled`, `oninput`, `onchange` and ARIA attributes. Only a checked, enabled input with a name is submitted. With no value, the browser submits `on`. Multiple pills can share a name. Disabled fieldsets work natively.

Omit `checked` to initialize from `defaultChecked`. An explicit `checked` value takes precedence initially. Reset restores `defaultChecked` (false when omitted) and updates `bind:checked`. Validation uses the native checkbox; `required` requires that particular pill to be checked.

## Accessibility and styling

Visible children name the input. An enclosing `Label` is supported. Explicit `aria-label` or `aria-labelledby` takes precedence; provide one when children are omitted. Icons are decorative. Use plain label content without nested interactive controls. Keyboard focus surrounds the pill, and invalid fields expose native validity and support `aria-invalid` / `aria-describedby` for error messages.

`class`, `style`, input events and `ref` target the checkbox. Use `wrapperAttributes` and `wrapperRef` for the visible pill. Sizes are `small` (24px), `medium` (32px), `large` (40px) and `extra-large` (48px); appearances are `filled`, `outline` and `brand`.

Text scales with `size`: 12px, 14px, 16px and 18px respectively. `shape` defaults to `circular` and also supports `rounded` and `square`. Invalid labels and borders use the critical theme token; pair them with an explanatory error message.

Use `media` for a decorative avatar. A snippet receives `{ shape }`; a component receives the same object as props. Forward `shape` to `Avatar` so it follows the pill, including reactive changes. Media is hidden from assistive technologies and fitted to the control height with a uniform 4px inset. It takes precedence over `icon`.

```svelte
<script>
	import { Avatar, PillButton } from 'fluentui-svelte';
</script>

<PillButton checked>
	{#snippet media({ shape })}<Avatar {shape} name="Alex" />{/snippet}
	Alex
</PillButton>
```

## Props

<!-- props:PillButtonProps -->

| Name                                                                       | Type                                                                                 | Default      | Description                                                                                                                                                                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                                           | `HTMLInputElement` &#124; `null`                                                     |              | The DOM reference of the native checkbox.                                                                                                                                                                      |
| `wrapperRef` _bindable_                                                    | `HTMLElement` &#124; `null`                                                          |              | The DOM reference of the pill surface.                                                                                                                                                                         |
| `wrapperAttributes`                                                        | `HTMLAttributes<HTMLSpanElement>`                                                    |              | Attributes for the pill surface. Input attributes belong on the component itself.                                                                                                                              |
| `checked` _bindable_                                                       | `boolean` &#124; `null`                                                              |              | Whether the pill is checked. When omitted, `defaultChecked` determines the initial state.                                                                                                                      |
| `appearance`                                                               | `'filled'` &#124; `'outline'` &#124; `'brand'`                                       | `'filled'`   | The pill appearance.                                                                                                                                                                                           |
| `size`                                                                     | `'small'` &#124; `'medium'` &#124; `'large'` &#124; `'extra-large'`                  | `'medium'`   | The height and text size of the pill: `small` is 24px/12px, `medium` is 32px/14px, `large` is 40px/16px and `extra-large` is 48px/18px.                                                                        |
| `shape`                                                                    | `'circular'` &#124; `'rounded'` &#124; `'square'`                                    | `'circular'` | The shape of the pill: `circular`, `rounded` or `square`.                                                                                                                                                      |
| `icon`                                                                     | `Snippet<[SVGAttributes<SVGElement>]>` &#124; `Component<SVGAttributes<SVGElement>>` |              | An optional decorative Fluent icon before the content.                                                                                                                                                         |
| `media`                                                                    | `Snippet<[PillButtonMediaProps]>` &#124; `Component<PillButtonMediaProps>`           |              | Decorative media before the text, usually an `Avatar`. Receives the pill's current `shape`; forward it to the media component. Fits the control height with a uniform 4px inset. Takes precedence over `icon`. |
| `children`                                                                 | `Snippet`                                                                            |              | The visible label. Provide `aria-label` or `aria-labelledby` when there is no visible text.                                                                                                                    |
| `HTMLInputAttributes` without `type`, `children`, `checked`, `size`, `on:` |                                                                                      |              |                                                                                                                                                                                                                |

<!-- /props:PillButtonProps -->
