# Divider

The Divider component is used to visually separate content within a layout. It can be oriented horizontally or vertically.

## Usage

```svelte
<script>
	import { Divider } from 'fluentui-svelte';
</script>

<Divider>Divider</Divider>
```

## Divider API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Divider Props table below.

## Examples

### Appearance

Controls the color of the divider. Possible values: `'standard'`, `'accent'`, `'subtle'`.

```svelte
<Divider appearance="standard">Standard Divider</Divider>
<Divider appearance="accent">Accent Divider</Divider>
<Divider appearance="subtle">Subtle Divider</Divider>
```

### Vertical

When `vertical` is set, the divider renders on the vertical axis instead of the horizontal one. Make sure the parent container has a defined height so the divider is visible.

```svelte
<Divider vertical>Vertical</Divider>
```

### Align Content

The `alignContent` prop controls where the label content (children) is positioned along the divider. Possible values: `'start'`, `'center'`, `'end'`.

```svelte
<Divider alignContent="start">Start Aligned Divider</Divider>
<Divider alignContent="center">Center Aligned Divider</Divider>
<Divider alignContent="end">End Aligned Divider</Divider>
```

It also works combined with the `vertical` prop:

```svelte
<Divider alignContent="start" vertical>Start</Divider>
<Divider alignContent="center" vertical>Center</Divider>
<Divider alignContent="end" vertical>End</Divider>
```

### Inset

When `inset` is set, the divider gets some inline padding applied, useful when it's placed inside a container that has content touching its edges.

```svelte
<Divider inset>Inset Divider</Divider>
```

### Custom element

The `as` prop lets you change the underlying HTML element rendered by the divider. Possible values: `'div'`, `'hr'`, `'span'`.

```svelte
<Divider as="hr" />
```

## Divider Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DividerProps -->

| Name             | Type                                                                | Default     | Description                                                          |
| ---------------- | ------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| `as`             | `'div'` &#124; `'hr'` &#124; `'span'`                               | `'div'`     | The HTML element to render the divider as.                           |
| `ref` _bindable_ | `HTMLDivElement` &#124; `HTMLHRElement` &#124; `HTMLSpanElement`    |             | The DOM reference of the divider element.                            |
| `vertical`       | `boolean`                                                           |             | Renders the divider vertically instead of horizontally.              |
| `alignContent`   | `'start'` &#124; `'center'` &#124; `'end'`                          | `'center'`  | Where the content of the divider sits along the line.                |
| `inset`          | `boolean`                                                           |             | Removes the padding around the divider line.                         |
| `appearance`     | `'accent'` &#124; `'standard'` &#124; `'subtle'` &#124; `'default'` | `'default'` | The divider line can be styled for greater emphasis or to be subtle. |
| HTML Attributes  |                                                                     |             |                                                                      |

<!-- /props:DividerProps -->
