# Expander

Control that displays a header and a collapsible content area.

## Usage

A basic expander expects a header and its content. You can configure the header by passing the `header` property. Content can be provided as child elements of the component. By default, the content container has no padding, this allows you to use 100% of the content width if needed.

```svelte
<script>
	import { Expander } from 'fluentui-svelte';
</script>

<Expander header="Expander Title">
	<p>This is the content of the expander</p>
</Expander>
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

## Examples

### Controlling Expansion

Expanders can be either expanded or collapsed. This can be controlled by setting the `expanded` property.

```svelte
<Expander header="Expander Title" expanded>
	<p>This is the content of the expander</p>
</Expander>
```

### Opening Direction

An expander doesn't have to expand downwards. You can control an expander's expansion direction using the `direction` property. To create an upwards-expanding expander, set `direction` to `up`.

```svelte
<Expander header="Expander Title" direction="up">
	<p>This is the content of the expander</p>
</Expander>
```

### Adding an Icon

You can easily add an icon to an expander's header using the `Icon` prop. You can pass either a Snippet or a Component. When using Snippet, you have two options:

- Apply the styles to the icon yourself
- Spread the Snippet props into the SVG element

```svelte
<script>
	import { Expander } from 'fluentui-svelte';
	/** As component */
	import { InfoRegular } from 'fluentui-icons-svelte';
</script>

<!-- As Snippet -->
{#snippet IconSnippet(props)}
	<!-- Spread props from Expander Component -->
	<svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M6.747..." />
	</svg>
{/snippet}

<Expander header="Expander Title" direction="up" Icon={InfoRegular}>
	<p>This is the content of the expander</p>
</Expander>
<Expander header="Expander Title" direction="up" Icon={IconSnippet}>
	<p>This is the content of the expander</p>
</Expander>
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ExpanderProps -->

| Name                           | Type                                    | Default  | Description                                                               |
| ------------------------------ | --------------------------------------- | -------- | ------------------------------------------------------------------------- |
| `header`                       | `string`                                |          | Label of the expander.                                                    |
| `description`                  | `string`                                |          | Description to render below the header.                                   |
| `direction`                    | `'down'` &#124; `'up'`                  | `'down'` | Set the opening direction of the expander.                                |
| `justify`                      | `boolean`                               | `false`  | The expander is justified to the full width of the container.             |
| `disabled`                     | `boolean`                               | `false`  | Disables the user interaction.                                            |
| `animation`                    | `{ duration: number; easing: string; }` |          | The animation configuration. Reduced motion is always honoured over this. |
| `expanded` _bindable_          | `boolean`                               | `false`  | Control the opening state of the expander.                                |
| `ref` _bindable_               | `HTMLDetailsElement`                    |          | The DOM reference of the expander element.                                |
| `Icon`                         | `Snippet` &#124; `Component`            |          | The icon to display before the label.                                     |
| `summaryRef` _bindable_        | `HTMLElement`                           |          | The DOM reference of the summary element.                                 |
| `summaryProps`                 | `HTMLAttributes`                        |          | The props to spread on the summary element.                               |
| Element Attributes (`details`) |                                         |          |                                                                           |

<!-- /props:ExpanderProps -->
