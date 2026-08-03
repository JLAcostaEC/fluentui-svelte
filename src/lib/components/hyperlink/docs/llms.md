# Hyperlink

The Hyperlink component is used to create clickable links that navigate to a specified URL. It follows Fluent UI design principles and ensures accessibility and smooth user interactions.

## Usage

```svelte
<script>
	import { Hyperlink } from 'fluentui-svelte';
</script>

<Hyperlink href="/">Go to Home</Hyperlink>
```

## Examples

### Disabled

Disables the hyperlink and prevents navigation.

```svelte
<Hyperlink href="/" disabled>Disabled Link</Hyperlink>
```

## Component Props

| Name               | Type                | Description                                                             |
| ------------------ | ------------------- | ----------------------------------------------------------------------- |
| `href`             | `string`            | The URL to navigate to when the link is clicked.                        |
| `disabled`         | `boolean`           | Disables the hyperlink and prevents navigation.                         |
| `children`         | `Snippet`           | The content of the hyperlink.                                           |
| `ref`              | `HTMLAnchorElement` | A bindable reference to the underlying anchor element.                  |
| Element Attributes |                     | You can use any valid HTML anchor attributes (e.g., target, rel, etc.). |
