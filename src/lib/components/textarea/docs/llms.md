# TextArea

Textarea allows the user to enter and edit multiline text.

## Usage

```svelte
<script>
	import { TextArea } from 'fluentui-svelte';
</script>

<TextArea placeholder="Type your message here..." />
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

## Examples

### Placeholder

The `placeholder` prop sets the placeholder text for the textarea, providing a hint to users about what to enter.

```svelte
<TextArea placeholder="Type your message here..." />
```

### Resize

The `resize` prop controls whether the textarea can be resized by the user. It can be set to `none`, `both`, `horizontal`, or `vertical`. This allows you to control the resizing behavior of the textarea.

```svelte
<TextArea resize="none" placeholder="No resize" />
<TextArea resize="vertical" placeholder="Vertical resize" />
<TextArea resize="both" placeholder="Resize both" />
```

### On Change

The `onChange` event is triggered whenever the content of the textarea changes. This can be used to react to user input in real-time, such as validating input or updating other parts of the UI.

```svelte
<TextArea onChange={(e) => console.log(e)} placeholder="Type..." />
```

## Component Props

| Name               | Type       | Description                                                                                                        |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `placeholder`      | `string`   | The placeholder text for the textarea.                                                                             |
| `resize`           | `string`   | Controls the resizing behavior of the textarea. Possible values: `'none'`, `'both'`, `'horizontal'`, `'vertical'`. |
| `onChange`         | `function` | Event handler for when the content of the textarea changes.                                                        |
| `element`          |            | The DOM reference of the textarea element.                                                                         |
| Element Attributes |            | All other attributes that can be applied to the textarea element.                                                  |
