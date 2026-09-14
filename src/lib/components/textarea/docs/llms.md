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

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TextAreaProps -->

| Name                             | Type                                                               | Default      | Description                                      |
| -------------------------------- | ------------------------------------------------------------------ | ------------ | ------------------------------------------------ |
| `value` _bindable_               | `string`                                                           | `''`         | The current value of the textarea.               |
| `ref` _bindable_                 | `HTMLElement`                                                      |              | The DOM reference of the textarea element.       |
| `placeholder`                    | `string`                                                           |              | The placeholder text for the textarea.           |
| `resize`                         | `'none'` &#124; `'both'` &#124; `'horizontal'` &#124; `'vertical'` | `'vertical'` | Configures the resize behavior of the textarea.  |
| `onChange`                       | `(e: Event) => void`                                               |              | Callback function for the change event.          |
| `disabled`                       | `boolean`                                                          | `false`      | Disables the user interaction.                   |
| `wrapperAttributes`              | `HTMLAttributes`                                                   |              | The attributes to spread on the wrapper element. |
| `wrapperRef` _bindable_          | `HTMLDivElement`                                                   |              | The DOM reference of the wrapper element.        |
| `SvelteHTMLElements['textarea']` |                                                                    |              |                                                  |

<!-- /props:TextAreaProps -->
