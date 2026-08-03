# AutoSuggestBox

The AutoSuggestBox component provides an input field with dynamic suggestions as users type. It enhances user experience by offering relevant suggestions, improving efficiency in form inputs and searches.

## Usage

```svelte
<script>
	import { AutoSuggestBox, AutoSuggestBoxOption } from 'fluentui-svelte';
</script>

<AutoSuggestBox placeholder="Type a fruit...">
	<AutoSuggestBoxOption index={0} value="Apple">Apple</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={1} value="Banana">Banana</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={2} value="Cherry">Cherry</AutoSuggestBoxOption>
</AutoSuggestBox>
```

## Component API

A brief explanation of the props that really need explaining. You can see the rest of the props in the Component Props table below.

### Suggestions

Suggestions are provided as `AutoSuggestBoxOption`, a child of the `AutoSuggestBox`. As the user types, matching options will be shown.

> **Keyboard Navigation:** Users can navigate through suggestions using the Up and Down arrow keys. Pressing Enter selects the highlighted suggestion.

## Examples

### Max Items In View

The `maxItemsInView` prop sets how many suggestions are visible before the flyout scrolls. If the number of options exceeds this value, a scrollbar will appear.

```svelte
<AutoSuggestBox placeholder="Type a fruit..." maxItemsInView={3}>
	<AutoSuggestBoxOption index={0} value="Apple">Apple</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={1} value="Banana">Banana</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={2} value="Cherry">Cherry</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={3} value="Date">Date</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={4} value="Elderberry">Elderberry</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={5} value="Fig">Fig</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={6} value="Grape">Grape</AutoSuggestBoxOption>
</AutoSuggestBox>
```

### Suggestion Chosen Event

The `suggestionChosen` event is triggered when a user selects a suggestion from the list. The chosen suggestion value is passed as the second argument.

```svelte
<AutoSuggestBox
	placeholder="Type a fruit..."
	suggestionChosen={(e, item) => console.log('Suggestion chosen:', item)}
>
	<AutoSuggestBoxOption index={0} value="Apple">Apple</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={1} value="Banana">Banana</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={2} value="Cherry">Cherry</AutoSuggestBoxOption>
</AutoSuggestBox>
```

### Query Submitted Event

The `querySubmitted` event is triggered when the user submits a query through the Search Button or typically by pressing Enter. This event can be used to handle the submission of the current input value.

```svelte
<AutoSuggestBox
	placeholder="Type a fruit..."
	querySubmitted={(e, query) => console.log('Query submitted:', query)}
>
	<AutoSuggestBoxOption index={0} value="Apple">Apple</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={1} value="Banana">Banana</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={2} value="Cherry">Cherry</AutoSuggestBoxOption>
</AutoSuggestBox>
```

## Component Props

| Name | Type | Description |
| --- | --- | --- |
| `placeholder` | `string` | Placeholder text shown in the input. |
| `value` | `string` | The current value of the input field. |
| `open` | `boolean` | Whether the suggestion flyout is open. Default: `false`. |
| `multiselect` | `boolean` | Allow selecting multiple suggestions. |
| `selectOnFocus` | `boolean` | Select a suggestion as it is focused during keyboard navigation. |
| `notFoundText` | `string` | Text shown when no suggestions match. Default: `No results found`. |
| `maxItemsInView` | `number` | Number of suggestions visible before the flyout scrolls. Default: `6`. |
| `ref` | `HTMLElement` | The DOM reference of the auto-suggest box element. |
| `suggestionChosen` | `(e: Event, selection: string) => void` | Event triggered when a suggestion is chosen. |
| `querySubmitted` | `(e: MouseEvent \| KeyboardEvent, query: string) => void` | Event triggered when a query is submitted. |
