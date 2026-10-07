# TagPicker

A TagPicker combines a text field and a dropdown, giving people a way to choose several options from a list or to enter their own choice. Every choice becomes a dismissible `Tag` shown in the control. It is made of `TagPicker`, `TagPickerOption` and `TagPickerOptionGroup`.

## Usage

```svelte
<script>
	import { TagPicker, TagPickerOption } from 'fluentui-svelte';

	const options = ['John Doe', 'Jane Doe', 'Max Mustermann'];

	let selectedOptions = $state([]);
</script>

<TagPicker
	bind:selectedOptions
	inputProps={{ 'aria-label': 'Select Employees' }}
	tagGroupProps={{ 'aria-label': 'Selected Employees' }}
>
	{#each options as option (option)}
		<TagPickerOption value={option}>{option}</TagPickerOption>
	{/each}
</TagPicker>
```

## TagPicker API

- `selectedOptions` holds the values of the chosen options. It is bindable, and every value shows as a tag.
- Selecting an option adds a tag and clears the text. The option is not offered again until its tag is removed.
- The options are filtered by what is typed in the input: a case-insensitive substring of the `text` of the option (its `value` when there is no `text`). The first match is highlighted.
- A multiple picker keeps the list open after each choice. With `single` a new choice replaces the tag and closes the list.
- Give the input an accessible name with `inputProps={{ 'aria-label': '...' }}`, and the group of tags one with `tagGroupProps`.
- Pressing Backspace in an empty input removes the last tag. Tell your users about it.
- A tag shows the `text` of its option, and keeps it once the option leaves the screen. This holds for a tag preselected through `selectedOptions` too, as long as the options are children of the TagPicker. A value that no option has is shown as it is, and so is every value during server-side rendering. To control what a tag says, render the tags yourself with the `tag` snippet.
- Do not use an interactive `Tag` inside a TagPicker.
- Keys: ArrowDown and ArrowUp open the list and move through the options, Enter chooses the option under the cursor, Escape and Tab close the list, Home and End move the caret of the input.

## Examples

### Default

The `tag` snippet renders the tag of a chosen option, here with an `Avatar` as its media. Render a `Tag` with the given `value` and `role="listitem"`.

```svelte
<script>
	let selectedOptions = $state([]);
</script>

{#snippet tag({ value, text })}
	{#snippet media()}
		<Avatar aria-hidden="true" name={text} size={16} color="colorful" />
	{/snippet}
	<Tag role="listitem" {value} {media} title={text}>{text}</Tag>
{/snippet}

<TagPicker
	bind:selectedOptions
	{tag}
	inputProps={{ 'aria-label': 'Select Employees' }}
	tagGroupProps={{ 'aria-label': 'Selected Employees' }}
>
	{#each options as option (option)}
		<TagPickerOption value={option}>
			<Avatar aria-hidden="true" shape="square" name={option} size={20} color="colorful" />
			{option}
		</TagPickerOption>
	{/each}
</TagPicker>
```

### Button

Make the input read only with `inputProps={{ readonly: true }}` to use the TagPicker as a button that opens the list.

```svelte
<TagPicker
	bind:selectedOptions
	placeholder="Select employees"
	inputProps={{ 'aria-label': 'Select Employees', readonly: true }}
>
	{#each options as option (option)}
		<TagPickerOption value={option}>{option}</TagPickerOption>
	{/each}
</TagPicker>
```

### Disabled

A disabled TagPicker cannot be opened, typed in or changed, and its tags cannot be dismissed.

```svelte
<TagPicker disabled selectedOptions={[options[0]]} inputProps={{ 'aria-label': 'Select Employees' }}>
	{#each options as option (option)}
		<TagPickerOption value={option}>{option}</TagPickerOption>
	{/each}
</TagPicker>
```

### Expand icon

Replace the dropdown arrow with `expandIcon`, a component or a snippet, or remove it by passing `null`.

```svelte
<script>
	import { ArrowDownFilled } from 'fluentui-icons-svelte';
</script>

<!-- A custom icon -->
<TagPicker bind:selectedOptions expandIcon={ArrowDownFilled} inputProps={{ 'aria-label': 'Select Employees' }}>
	...
</TagPicker>

<!-- No icon -->
<TagPicker bind:selectedOptions expandIcon={null} inputProps={{ 'aria-label': 'Select Employees' }}>...</TagPicker>
```

### Filtering

The options are filtered as the user types, and the first match is highlighted so that Enter chooses it. `notFoundText` is shown when no option is left.

```svelte
<TagPicker
	bind:selectedOptions
	notFoundText="We couldn't find any matches"
	inputProps={{ 'aria-label': 'Select Employees' }}
>
	{#each options as option (option)}
		<TagPickerOption value={option}>{option}</TagPickerOption>
	{/each}
</TagPicker>
```

### Grouped

Group options with `TagPickerOptionGroup`. A group with no option left on screen hides itself.

```svelte
<TagPicker bind:selectedOptions inputProps={{ 'aria-label': 'Select Employees' }}>
	<TagPickerOptionGroup label="Managers">
		{#each managers as option (option)}
			<TagPickerOption value={option}>{option}</TagPickerOption>
		{/each}
	</TagPickerOptionGroup>
	<TagPickerOptionGroup label="Developers">
		{#each devs as option (option)}
			<TagPickerOption value={option}>{option}</TagPickerOption>
		{/each}
	</TagPickerOptionGroup>
</TagPicker>
```

### No popover

Leave out the options to get a TagPicker without a list, to let users enter their own tags. Bind `value` and add the tag in `querySubmitted`, called when Enter is pressed with text in the input.

```svelte
<script>
	let selectedOptions = $state([]);
	let value = $state('');
</script>

<TagPicker
	bind:selectedOptions
	bind:value
	placeholder="Type and press Enter"
	inputProps={{ 'aria-label': 'Add Employees' }}
	querySubmitted={(e, query) => {
		if (!selectedOptions.includes(query)) selectedOptions = [...selectedOptions, query];
		value = '';
	}}
/>
```

### Secondary action

Add a button next to the dropdown arrow with the `secondaryAction` snippet.

```svelte
{#snippet allClear()}
	<Button appearance="subtle" onclick={() => (selectedOptions = [])}>All Clear</Button>
{/snippet}

<TagPicker bind:selectedOptions secondaryAction={allClear} inputProps={{ 'aria-label': 'Select Employees' }}>
	{#each options as option (option)}
		<TagPickerOption value={option}>{option}</TagPickerOption>
	{/each}
</TagPicker>
```

### Single select

With `single` a new choice replaces the current tag and closes the list.

```svelte
<TagPicker single bind:selectedOptions inputProps={{ 'aria-label': 'Select Employee' }}>
	{#each options as option (option)}
		<TagPickerOption value={option}>{option}</TagPickerOption>
	{/each}
</TagPicker>
```

### Size

A TagPicker is `medium` by default, or `large` or `extra-large`. The size of the control also picks the size of its tags.

```svelte
{#each ['medium', 'large', 'extra-large'] as size}
	<TagPicker {size} selectedOptions={[options[0]]} inputProps={{ 'aria-label': size }}>
		{#each options as option (option)}
			<TagPickerOption value={option}>{option}</TagPickerOption>
		{/each}
	</TagPicker>
{/each}
```

### Truncated text

A tag that is wider than the control, or than its own `max-width`, shortens its text with an ellipsis. Give the tag a `title` so the full text stays reachable, and truncate the text of the options yourself.

```svelte
{#snippet tag({ value, text })}
	<Tag role="listitem" {value} title={text} style="max-width: 100px;">{text}</Tag>
{/snippet}

<TagPicker bind:selectedOptions {tag} inputProps={{ 'aria-label': 'Select Employees' }}>
	{#each [...longOptions, ...options] as option (option)}
		<TagPickerOption value={option}>
			<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;">{option}</span>
		</TagPickerOption>
	{/each}
</TagPicker>
```

## Component Props (TagPicker)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TagPickerProps -->

| Name                                                | Type                                               | Default                  | Description                                                                                                                                                   |
| --------------------------------------------------- | -------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                    | `HTMLDivElement`                                   |                          | The DOM reference of the wrapper element.                                                                                                                     |
| `inputRef` _bindable_                               | `HTMLInputElement`                                 |                          | The DOM reference of the input element.                                                                                                                       |
| `selectedOptions` _bindable_                        | `string[]`                                         | `[]`                     | The values of the chosen options, shown as tags in the control. A value no option has is shown as it is.                                                      |
| `value` _bindable_                                  | `string`                                           | `''`                     | The text typed in the input. It filters the options, and is cleared when one is chosen.                                                                       |
| `open` _bindable_                                   | `boolean`                                          | `false`                  | Controls the open state of the option list.                                                                                                                   |
| `single`                                            | `boolean`                                          |                          | Limits the picker to one tag: choosing an option replaces the current one and closes the list.                                                                |
| `disabled`                                          | `boolean`                                          |                          | Disables the user interaction: the input, the tags and the list.                                                                                              |
| `size`                                              | `'medium'` &#124; `'large'` &#124; `'extra-large'` | `'medium'`               | The size of the control. It also picks the size of the tags.                                                                                                  |
| `placeholder`                                       | `string`                                           |                          | The placeholder text of the input.                                                                                                                            |
| `notFoundText`                                      | `string`                                           | `'No options available'` | The message shown in place of the list when there is no option left to choose.                                                                                |
| `expandIcon`                                        | `Snippet` &#124; `Component` &#124; `null`         | `ChevronDownRegular`     | The dropdown arrow. Pass `null` to remove it.                                                                                                                 |
| `secondaryAction`                                   | `Snippet`                                          |                          | A button-like element rendered at the end of the control, before the dropdown arrow.                                                                          |
| `tag`                                               | `Snippet<[{ value: string; text: string }]>`       |                          | Renders the tag of a chosen option, to give it media or custom text. Falls back to a plain tag. Render a `Tag` with the given `value`, and `role="listitem"`. |
| `tagGroupProps`                                     | `TagGroupProps`                                    |                          | The props to spread on the group holding the tags. This is where its `aria-label` goes.                                                                       |
| `inputProps`                                        | `HTMLInputAttributes`                              |                          | The props to spread on the input. This is where its accessible name (`aria-label`) and `readonly` (to turn the input into a plain trigger) go.                |
| `onSelectionChange`                                 | `(e: Event, selectedOptions: string[]) => void`    |                          | Called when an option is chosen, or a tag is removed.                                                                                                         |
| `querySubmitted`                                    | `(e: KeyboardEvent, query: string) => void`        |                          | Called when Enter is pressed with text in the input and no option under the cursor. This is where a free-form tag is added.                                   |
| `children`                                          | `Snippet`                                          |                          | The options. Leave it out to get a picker without a list.                                                                                                     |
| `HTMLAttributes<HTMLDivElement>` without `children` |                                                    |                          |                                                                                                                                                               |

<!-- /props:TagPickerProps -->

## Component Props (TagPickerOption)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TagPickerOptionProps -->

| Name                                                                     | Type            | Default | Description                                                                                                          |
| ------------------------------------------------------------------------ | --------------- | ------- | -------------------------------------------------------------------------------------------------------------------- |
| `value`                                                                  | `string`        |         | The value added to `selectedOptions` when the option is chosen.                                                      |
| `text`                                                                   | `string`        |         | The text the option is filtered by, and the text of its tag. Falls back to `value`.                                  |
| `id`                                                                     | `string`        |         | The id of the option element, referenced by the input through `aria-activedescendant`. Falls back to a generated id. |
| `ref` _bindable_                                                         | `HTMLLIElement` |         | The DOM reference of the option element.                                                                             |
| `disabled`                                                               | `boolean`       |         | Takes the option out of reach: it is shown, but the cursor steps over it.                                            |
| `ListViewItemProps<'li'>` without `as`, `value`, `onAction`, `checkmark` |                 |         |                                                                                                                      |

<!-- /props:TagPickerOptionProps -->

## Component Props (TagPickerOptionGroup)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TagPickerOptionGroupProps -->

| Name                                                  | Type               | Default | Description                             |
| ----------------------------------------------------- | ------------------ | ------- | --------------------------------------- |
| `label`                                               | `string`           |         | The label of the group.                 |
| `ref` _bindable_                                      | `HTMLUListElement` |         | The DOM reference of the group element. |
| `children`                                            | `Snippet`          |         | The options of the group.               |
| `HTMLAttributes<HTMLUListElement>` without `children` |                    |         |                                         |

<!-- /props:TagPickerOptionGroupProps -->
