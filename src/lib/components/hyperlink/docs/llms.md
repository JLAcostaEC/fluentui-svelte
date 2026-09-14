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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:HyperlinkProps -->

| Name                     | Type                | Default | Description                              |
| ------------------------ | ------------------- | ------- | ---------------------------------------- |
| `href`                   | `string`            | `'#'`   | The URL the hyperlink points to.         |
| `disabled`               | `boolean`           |         | Disables the user interaction.           |
| `ref` _bindable_         | `HTMLAnchorElement` |         | The DOM reference of the anchor element. |
| Element Attributes (`a`) |                     |         |                                          |

<!-- /props:HyperlinkProps -->
