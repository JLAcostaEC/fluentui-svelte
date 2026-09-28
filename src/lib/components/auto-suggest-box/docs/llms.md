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

### Open on focus

Use `openOnFocus` to show suggestions as soon as the text box receives focus, before anything is typed.

```svelte
<AutoSuggestBox openOnFocus placeholder="Choose a fruit...">
	{#each fruits as fruit, index (fruit.id)}
		<AutoSuggestBoxOption {index} id={fruit.id} value={fruit.name}>
			{fruit.name}
		</AutoSuggestBoxOption>
	{/each}
</AutoSuggestBox>
```

### Virtualization

Window large suggestion sets by connecting AutoSuggestBox to a virtual list through the `virtualizer` prop. Its `size` is the total number of suggestions, while each option keeps its real `index`.

```svelte
<script>
	import SvelteVirtualList from '@humanspeak/svelte-virtual-list';

	let listRef;
</script>

<AutoSuggestBox
	placeholder="Type a name..."
	virtualizer={{
		size: people.length,
		scrollToTop: () => listRef.scroll({ index: 0, align: 'top', smoothScroll: false }),
		scrollToBottom: () => listRef.scroll({ index: people.length - 1, align: 'bottom', smoothScroll: false }),
		scrollToIndex: (index) => listRef.scroll({ index, align: 'auto', smoothScroll: false })
	}}
>
	<SvelteVirtualList items={people} bind:this={listRef} defaultEstimatedItemHeight={30}>
		{#snippet renderItem(person, index)}
			<AutoSuggestBoxOption {index} id={person.id} value={person.name}>
				{person.name}
			</AutoSuggestBoxOption>
		{/snippet}
	</SvelteVirtualList>
</AutoSuggestBox>
```

### Multiselect

Allow people to choose several suggestions and optionally show the selected values in the text box.

```svelte
<script>
	let selectedOptions = $state([]);
</script>

<AutoSuggestBox multiselect showTextualMultiselect bind:selectedOptions placeholder="Choose fruits...">
	{#each fruits as fruit, index (fruit.id)}
		<AutoSuggestBoxOption {index} id={fruit.id} value={fruit.name}>
			{fruit.name}
		</AutoSuggestBoxOption>
	{/each}
</AutoSuggestBox>
```

### Virtualization with filtering

A virtualized list must filter its source data itself and report the filtered length through `virtualizer.size`.

```svelte
<script>
	import SvelteVirtualList from '@humanspeak/svelte-virtual-list';

	let items = $state(people);
	let listRef;
</script>

<AutoSuggestBox
	placeholder="Type a name..."
	virtualizer={{
		size: items.length,
		scrollToTop: () => listRef.scroll({ index: 0, align: 'top', smoothScroll: false }),
		scrollToBottom: () => {
			if (items.length) listRef.scroll({ index: items.length - 1, align: 'bottom', smoothScroll: false });
		},
		scrollToIndex: (index) => listRef.scroll({ index, align: 'auto', smoothScroll: false })
	}}
	textChanged={(_, value) => {
		const query = value.trim().toLowerCase();
		items = people.filter(({ name }) => name.toLowerCase().includes(query));
	}}
>
	<SvelteVirtualList {items} bind:this={listRef} defaultEstimatedItemHeight={30}>
		{#snippet renderItem(person, index)}
			<AutoSuggestBoxOption {index} id={person.id} value={person.name}>
				{person.name}
			</AutoSuggestBoxOption>
		{/snippet}
	</SvelteVirtualList>
</AutoSuggestBox>
```

## Component Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:AutoSuggestBoxProps -->

| Name                                                                          | Type                                                            | Default              | Description                                                                                                                                                                        |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                                              | `HTMLElement`                                                   |                      | The DOM reference of the wrapper element.                                                                                                                                          |
| `inputRef` _bindable_                                                         | `HTMLInputElement`                                              |                      | The DOM reference of the text box element.                                                                                                                                         |
| `value` _bindable_                                                            | `string`                                                        | `''`                 | The current text of the box.                                                                                                                                                       |
| `open` _bindable_                                                             | `boolean`                                                       | `false`              | Controls the open state of the suggestion list.                                                                                                                                    |
| `multiselect`                                                                 | `boolean`                                                       |                      | Lets more than one suggestion be chosen, and keeps the list open after each one.                                                                                                   |
| `selectOnFocus`                                                               | `boolean`                                                       |                      | Mirrors the suggestion under the cursor into the text box as it is walked over. Not supported together with `multiselect`.                                                         |
| `openOnFocus`                                                                 | `boolean`                                                       | `false`              | Opens the suggestion list as soon as the text box takes focus, instead of waiting for the first keystroke. Useful on touch devices, which have no arrow key to open the list with. |
| `showTextualMultiselect`                                                      | `boolean`                                                       |                      | Lists every chosen suggestion in the text box, comma separated. Multiselect only.                                                                                                  |
| `notFoundText`                                                                | `string`                                                        | `'No results found'` | The message shown in place of the list when nothing matches.                                                                                                                       |
| `selectedOptions` _bindable_                                                  | `{ id: string; value: string }[]`                               | `[]`                 | The suggestions currently chosen.                                                                                                                                                  |
| `suggestionChosen`                                                            | `(e: Event, selection: string) => void`                         |                      | Called when a suggestion is chosen: by clicking it, by pressing Enter on it, or by walking onto it while `selectOnFocus` is set.                                                   |
| `querySubmitted`                                                              | `(e: MouseEvent` &#124; `KeyboardEvent, query: string) => void` |                      | Called when Enter is pressed with no suggestion under the cursor, or when the search button is clicked. This is where a fresh set of suggestions is fetched.                       |
| `virtualizer`                                                                 | `AutoSuggestVirtualizer`                                        |                      | Bridge to a windowed list, for suggestion sets too long to render whole.                                                                                                           |
| `maxItemsInView`                                                              | `number`                                                        | `6`                  | How many suggestions are visible before the list scrolls.                                                                                                                          |
| `textBoxRef` _bindable_                                                       | `HTMLInputElement`                                              |                      | The DOM reference of the underlying text box input.                                                                                                                                |
| `textBoxProps`                                                                | `TextBoxProps`                                                  |                      | The props to spread on the text box.                                                                                                                                               |
| `flyoutRef` _bindable_                                                        | `HTMLElement`                                                   |                      | The DOM reference of the flyout holding the suggestion list.                                                                                                                       |
| `flyoutProps`                                                                 | `FlyoutProps`                                                   |                      | The props to spread on the flyout.                                                                                                                                                 |
| `listViewRef` _bindable_                                                      | `HTMLUListElement`                                              |                      | The DOM reference of the suggestion list.                                                                                                                                          |
| `listViewProps`                                                               | `ListViewItemProps`                                             |                      | The props to spread on the suggestion list.                                                                                                                                        |
| `type`, `placeholder`, `hideActionButtons`, `textChanged` from `TextBoxProps` |                                                                 |                      |                                                                                                                                                                                    |
| Element Attributes (`div`)                                                    |                                                                 |                      |                                                                                                                                                                                    |

<!-- /props:AutoSuggestBoxProps -->

## AutoSuggestBoxOption Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:AutoSuggestOptionProps -->

| Name                                            | Type            | Default | Description                                                                                                                   |
| ----------------------------------------------- | --------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `value`                                         | `string`        |         | The value reported to the box when the suggestion is chosen. Falls back to the id.                                            |
| `text`                                          | `string`        |         | The text shown in the box once the suggestion is chosen. Falls back to `value`.                                               |
| `id`                                            | `string`        |         | The id of the option element, referenced by the box through `aria-activedescendant`. Falls back to a generated id.            |
| `ref` _bindable_                                | `HTMLLIElement` |         | The DOM reference of the option element.                                                                                      |
| `disabled`                                      | `boolean`       |         | Takes the suggestion out of reach: it is shown, but the cursor steps over it.                                                 |
| `index`                                         | `number`        |         | Where the suggestion sits in the whole set. A windowed list needs the real index, not the position within the rendered slice. |
| `ListViewItemProps<'li'>` without `as`, `value` |                 |         |                                                                                                                               |

<!-- /props:AutoSuggestOptionProps -->
