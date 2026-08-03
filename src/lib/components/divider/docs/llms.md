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

| Name           | Type                                                 | Description                                                                                        |
| -------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `as`           | `string`                                             | The HTML element to render the divider as. Possible values: `'div'`, `'hr'`, `'span'`.             |
| `vertical`     | `boolean`                                            | Whether the divider is rendered vertically instead of horizontally.                                |
| `alignContent` | `string`                                             | The alignment of the content within the divider. Possible values: `'start'`, `'center'`, `'end'`.  |
| `appearance`   | `string`                                             | The appearance of the divider. Possible values: `'default'`, `'accent'`, `'standard'`, `'subtle'`. |
| `inset`        | `boolean`                                            | Whether the divider has inline padding applied.                                                    |
| `ref`          | `HTMLDivElement \| HTMLHRElement \| HTMLSpanElement` | The DOM reference of the divider element, its type depends on the `as` prop.                       |
| `children`     | `Snippet`                                            | The content to render as a label within the divider.                                               |
