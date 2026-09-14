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
