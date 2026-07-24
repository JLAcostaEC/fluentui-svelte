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

| Name | Type | Description |
| --- | --- | --- |
| `type` | `string` | The type of the input element. Possible values: `'text'`, `'search'`, `'email'`, `'url'`, `'tel'`, `'password'`, `'number'`. |
| `ref` | `HTMLInputElement` | The DOM reference of the input element. |
| `wrapperRef` | `HTMLDivElement` | The DOM reference of the wrapper element. |
| `wrapperAttributes` | `HTMLAttributes<HTMLDivElement>` | Additional attributes forwarded to the wrapper element. |
| `size` | `'small' \| 'medium' \| 'large'` | The size of the input. |
| `readonly` | `boolean` | Whether the input is read-only. |
| `placeholder` | `string` | The placeholder text for the input. |
| `hideActionButtons` | `boolean` | Whether to hide the extra action buttons in the input. |
| `justify` | `boolean` | Whether the input fills the full width of the container. |
| `contentBefore` | `string \| Snippet \| Component` | Content rendered before the input (e.g. an icon). |
| `contentAfter` | `string \| Snippet \| Component` | Content rendered after the input (e.g. an icon). |
| `textChanged` | `(e: InputEvent, text: string) => void` | Event triggered when content changes in the text box. |
| `querySubmitted` | `(e: MouseEvent \| KeyboardEvent, query: string) => void` | Event triggered when a query is submitted (Enter or search icon click on `type="search"`). |
| `onClear` | `(e: MouseEvent) => void` | Event triggered when the input is cleared. |
| `children` | `Snippet` | The children elements to render inside the input. |
