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

### Keyboard

The suggestion list is driven by [Tabspot](https://github.com/JLAcostaEC/tabspot): focus stays
in the text box and the list is walked with `aria-activedescendant`, the ARIA combobox pattern.

| Key         | Action                                                                          |
| ----------- | ------------------------------------------------------------------------------- |
| `ArrowDown` | Open the list, then walk down it.                                               |
| `ArrowUp`   | Open the list on its last suggestion, then walk up it.                          |
| `Enter`     | Choose the suggestion under the cursor, or submit the query when there is none. |
| `Escape`    | Close the list.                                                                 |

Typing selects automatically: the first suggestion the query is a prefix of is put under the
cursor, so `Enter` accepts it without arrowing. When nothing matches — or there are no
suggestions at all — the cursor sits on the text box instead and `Enter` raises
`querySubmitted`, which is where you fetch a fresh set of suggestions. The search button raises
it too.

The text box is part of the ring: arrowing past the last suggestion — or back past the first —
returns the cursor to it and restores what you typed. Disabled options are stepped over.

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

### Virtualized Suggestions

Long lists can be windowed. Pass a `virtualizer` describing the _whole_ list — `size` is the
total number of suggestions, not the number rendered — and the box drives your list component
when the cursor walks past what is on screen. Options keep their real `index`, which is what
ties a rendered row back to the data.

```svelte
<script>
	import SvelteVirtualList from '@humanspeak/svelte-virtual-list';

	let items = $state(fruits);
	let listRef;
</script>

<AutoSuggestBox
	placeholder="Type a fruit..."
	virtualizer={{
		size: items.length,
		scrollToTop: () => listRef.scroll({ index: 0, align: 'top', smoothScroll: false }),
		scrollToBottom: () => listRef.scroll({ index: items.length - 1, align: 'bottom', smoothScroll: false }),
		scrollToIndex: (index) => listRef.scroll({ index, align: 'auto', smoothScroll: false })
	}}
	textChanged={(e, val) => (items = fruits.filter((item) => item.name.toLowerCase().includes(val.toLowerCase())))}
>
	<SvelteVirtualList {items} bind:this={listRef} defaultEstimatedItemHeight={30}>
		{#snippet renderItem(item, index)}
			<AutoSuggestBoxOption {index} id={item.id} value={item.name} text={item.name}>
				{item.name}
			</AutoSuggestBoxOption>
		{/snippet}
	</SvelteVirtualList>
</AutoSuggestBox>
```

Filtering is yours to do in `textChanged`: a windowed list renders from your data, so the
built-in filter that a plain option list applies is skipped.

### Suggestion Chosen Event

The `suggestionChosen` event is triggered when a user selects a suggestion from the list. The chosen suggestion value is passed as the second argument.

```svelte
<AutoSuggestBox placeholder="Type a fruit..." suggestionChosen={(e, item) => console.log('Suggestion chosen:', item)}>
	<AutoSuggestBoxOption index={0} value="Apple">Apple</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={1} value="Banana">Banana</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={2} value="Cherry">Cherry</AutoSuggestBoxOption>
</AutoSuggestBox>
```

### Query Submitted Event

The `querySubmitted` event is triggered when the user submits a query through the Search Button or typically by pressing Enter. This event can be used to handle the submission of the current input value.

```svelte
<AutoSuggestBox placeholder="Type a fruit..." querySubmitted={(e, query) => console.log('Query submitted:', query)}>
	<AutoSuggestBoxOption index={0} value="Apple">Apple</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={1} value="Banana">Banana</AutoSuggestBoxOption>
	<AutoSuggestBoxOption index={2} value="Cherry">Cherry</AutoSuggestBoxOption>
</AutoSuggestBox>
```

## Component Props

| Name               | Type                                                      | Description                                                            |
| ------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------- |
| `placeholder`      | `string`                                                  | Placeholder text shown in the input.                                   |
| `value`            | `string`                                                  | The current value of the input field.                                  |
| `open`             | `boolean`                                                 | Whether the suggestion flyout is open. Default: `false`.               |
| `multiselect`      | `boolean`                                                 | Allow selecting multiple suggestions.                                  |
| `selectOnFocus`    | `boolean`                                                 | Select a suggestion as it is focused during keyboard navigation.       |
| `notFoundText`     | `string`                                                  | Text shown when no suggestions match. Default: `No results found`.     |
| `maxItemsInView`   | `number`                                                  | Number of suggestions visible before the flyout scrolls. Default: `6`. |
| `ref`              | `HTMLElement`                                             | The DOM reference of the auto-suggest box element.                     |
| `suggestionChosen` | `(e: Event, selection: string) => void`                   | Event triggered when a suggestion is chosen.                           |
| `querySubmitted`   | `(e: MouseEvent \| KeyboardEvent, query: string) => void` | Event triggered when a query is submitted.                             |
| `virtualizer`      | `{ size, scrollToIndex?, scrollToTop?, scrollToBottom? }` | Bridge to a windowed list. `size` is the total suggestion count.       |
