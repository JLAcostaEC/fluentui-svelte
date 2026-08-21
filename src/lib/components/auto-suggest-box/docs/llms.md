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

## Examples

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
