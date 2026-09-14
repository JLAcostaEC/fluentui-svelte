# TextBox

The TextBox control lets a user type text into an app. It's typically used to capture a single line of text, but can be configured to capture multiple lines of text. The text displays on the screen in a simple, uniform, plaintext format.

## Usage

```svelte
<script>
	import { TextBox } from 'fluentui-svelte';
</script>

<TextBox type="text" placeholder="Type here..." />
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

## Examples

### Type

The `type` prop specifies the type of input element. It can be set to various types such as `text`, `search`, `email`, `url`, `tel`, `password`, or `number`. This determines the behavior and validation of the input.

```svelte
<TextBox type="text" placeholder="Text" />
<TextBox type="search" placeholder="Search" />
<TextBox type="password" placeholder="Password" />
<TextBox type="number" placeholder="Number" />
```

### Input Element

The `ref` prop allows you to bind a reference to the underlying HTML input element (`bind:ref`). This can be useful for direct DOM manipulations or accessing native input properties. The wrapper element can be bound via `wrapperRef`.

### Readonly

The `readonly` prop makes the input field read-only, preventing users from modifying its value. This is useful for displaying information that should not be edited.

```svelte
<TextBox readonly value="Read-only value" />
```

### Placeholder

The `placeholder` prop sets the placeholder text for the input field, providing a hint to users about what to enter.

### Hide Buttons

The `hideActionButtons` prop allows you to hide the extra action buttons in the input, such as clear or submit buttons. This can be useful for a cleaner UI when those actions are not needed.

```svelte
<TextBox type="search" hideActionButtons placeholder="No action buttons" />
```

### Query Submitted

The `querySubmitted` event is triggered when a query is submitted, such as when the user presses Enter in a search input. This allows you to handle the submission of the input value.

### Text Changed

The `textChanged` event is triggered whenever the content of the text box changes. This can be used to react to user input in real-time, such as validating input or updating other parts of the UI.

### On Clear

The `onClear` event is triggered when the input is cleared, allowing you to handle any necessary actions when the user removes the input value.

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TextBoxProps -->

| Name                                 | Type                                                                   | Default            | Description                                                                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `type`                               | [`TextBoxTypes`](https://fluentui-svelte.dev/docs/types/#textboxtypes) | `'text'`           | The type of the input element.                                                                                                                   |
| `value` _bindable_                   | `string` &#124; `number`                                               |                    | The current value of the input.                                                                                                                  |
| `wrapperRef` _bindable_              | `HTMLDivElement`                                                       |                    | The DOM reference of the wrapper element.                                                                                                        |
| `ref` _bindable_                     | `HTMLInputElement`                                                     |                    | The DOM reference of the input element.                                                                                                          |
| `placeholder`                        | `string`                                                               | `'Fluent TextBox'` | The placeholder text for the input.                                                                                                              |
| `hideActionButtons`                  | `boolean`                                                              |                    | Whether to hide the extra action buttons in the input.                                                                                           |
| `justify`                            | `boolean`                                                              |                    | Make the input fill the full width of the container.                                                                                             |
| `contentBefore`                      | `string` &#124; `Snippet` &#124; `Component`                           |                    | Content rendered before the input, inside the wrapper.                                                                                           |
| `contentAfter`                       | `string` &#124; `Snippet` &#124; `Component`                           |                    | Content rendered after the input, inside the wrapper.                                                                                            |
| `size`                               | `'small'` &#124; `'medium'` &#124; `'large'`                           | `'medium'`         | The size of the input element.                                                                                                                   |
| `textChanged`                        | `(e: InputEvent, text: string) => void`                                |                    | Occurs when content changes in the text box.                                                                                                     |
| `querySubmitted`                     | `(e: MouseEvent` &#124; `KeyboardEvent, query: string) => void`        |                    | The QuerySubmitted event occurs when: 1. The input type is 'search'. 2. While the focus is in the text box, press Enter or click the query icon. |
| `onClear`                            | `(e: MouseEvent) => void`                                              |                    | Occurs when the clear button is clicked.                                                                                                         |
| `children`                           | `Snippet`                                                              |                    | The children elements to render inside the input.                                                                                                |
| `wrapperAttributes`                  | `HTMLAttributes`                                                       |                    | The attributes to apply to the wrapper element.                                                                                                  |
| `HTMLInputAttributes` without `size` |                                                                        |                    |                                                                                                                                                  |

<!-- /props:TextBoxProps -->
