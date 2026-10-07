# Tag

A tag is a visual representation of an attribute, person or asset. It can be dismissed, and with `interactive` it becomes an interaction tag that has a primary action of its own. A `TagGroup` holds several tags, gives them a shared size, appearance and disabled state, and handles their selection and keyboard navigation.

## Usage

```svelte
<script>
	import { Tag, TagGroup } from 'fluentui-svelte';
	import { CalendarMonthRegular } from 'fluentui-icons-svelte';
</script>

<Tag icon={CalendarMonthRegular}>Primary text</Tag>

<TagGroup aria-label="Fruits">
	<Tag interactive value="apple">Apple</Tag>
	<Tag interactive value="banana">Banana</Tag>
</TagGroup>
```

## Tag API

- A plain tag is a static `span`. With `dismissible` it is a single `button`: click, Enter, Space, Delete and Backspace dismiss it.
- With `interactive` the tag is a `div` holding a primary `button` (icon or media, primary and secondary text) that carries `onclick`, followed, when the tag is `dismissible`, by a separate dismiss `button`.
- The tag never removes itself: `onDismiss` only reports the `value`, the consumer owns the data.
- Do not use `media` together with `icon` on one tag.
- Use `interactive` only for a tag that has a primary action, and a plain tag for one that does not.

## Examples

### Appearance

A tag can have a `filled`, `outline` or `brand` appearance. The default is `filled`.

```svelte
<Tag icon={CalendarMonthRegular} dismissible>filled</Tag>
<Tag appearance="outline" icon={CalendarMonthRegular} dismissible>outline</Tag>
<Tag appearance="brand" icon={CalendarMonthRegular} dismissible>brand</Tag>
```

### Disabled

A tag can show that it cannot be interacted with. Every part of it is blocked, the dismiss control included.

```svelte
<Tag disabled secondaryText="appearance=filled" icon={CalendarMonthRegular} dismissible>Disabled</Tag>
<Tag disabled appearance="outline" secondaryText="appearance=outline" icon={CalendarMonthRegular} dismissible
	>Disabled</Tag
>
<Tag disabled appearance="brand" secondaryText="appearance=brand" icon={CalendarMonthRegular} dismissible>Disabled</Tag>
```

### Dismiss

A dismissible tag shows a dismiss icon and becomes focusable. The tag only reports the dismissal through `onDismiss`, so remove it from your data. Ensure that focus is properly managed when all tags have been dismissed.

```svelte
<script>
	let dismissed = $state(false);
</script>

{#if !dismissed}
	<Tag dismissible onDismiss={() => (dismissed = true)}>Tag 1</Tag>
{/if}
<Button disabled={!dismissed} onclick={() => (dismissed = false)}>Reset the example</Button>
```

### Accessible name

Tell screen readers about the dismiss action. Either let the dismiss icon name the button, with `dismissLabel` (`'Dismiss'` by default), or name the tag itself with `aria-label` or `aria-labelledby`, and the dismiss icon is hidden from assistive technologies.

```svelte
<!-- The dismiss icon names the button: "Tag 1 Remove" -->
<Tag dismissible dismissLabel="Remove">Tag 1</Tag>

<!-- Name the tag itself, and the dismiss icon is hidden from assistive technologies -->
<Tag dismissible aria-label="Remove Tag 2">Tag 2</Tag>
```

### Interactive (primary action)

An interactive tag has a primary action (`onclick`) and, when it is dismissible, a secondary one that dismisses it. The dismiss button is named after both buttons, "Primary text Dismiss", through `aria-labelledby`. Use `primaryProps` and `dismissProps` to reach the buttons: a custom `id` on the primary button is followed by the dismiss button, and `aria-label` together with `aria-labelledby: undefined` gives the dismiss button a name that stands on its own.

```svelte
<script>
	let clicks = $state(0);
</script>

<Tag interactive dismissible onclick={() => clicks++}>Clicked {clicks} times</Tag>
<Tag interactive>Without dismiss</Tag>
<Tag interactive dismissible dismissProps={{ 'aria-label': 'Remove Tag', 'aria-labelledby': undefined }}>
	Own accessible name
</Tag>
<Button disabled={clicks === 0} onclick={() => (clicks = 0)}>Reset the example</Button>
```

### Icon

A tag can render a custom icon.

```svelte
<Tag icon={CalendarMonthRegular}>Primary text</Tag>
```

### Media

A tag can render media, for example an Avatar. Do not use it together with `icon`.

```svelte
{#snippet avatar()}
	<Avatar name="Katri Athokas" size={28} badge={{ status: 'busy' }} />
{/snippet}

<Tag media={avatar}>Primary text</Tag>
```

### Secondary text

A tag can have a second line of text, given as a string or a snippet.

```svelte
<Tag secondaryText="Secondary text">Primary text</Tag>
```

### Selected

`selected` paints the tag as selected. Inside a `TagGroup`, an interactive tag takes its selected state from the `selectedValues` of the group instead.

```svelte
<Tag selected secondaryText="appearance=filled" icon={CalendarMonthRegular} dismissible>Selected</Tag>
<Tag selected appearance="outline" secondaryText="appearance=outline" icon={CalendarMonthRegular} dismissible
	>Selected</Tag
>
<Tag selected appearance="brand" secondaryText="appearance=brand" icon={CalendarMonthRegular} dismissible>Selected</Tag>
```

### Shape

A tag can be `circular`, `rounded` or `square`. The default is `circular`.

```svelte
{#snippet avatar()}
	<Avatar name="Katri Athokas" size={28} badge={{ status: 'busy' }} />
{/snippet}

<Tag media={avatar}>Circular</Tag>
<Tag shape="rounded" media={avatar}>Rounded</Tag>
<Tag shape="square" media={avatar}>Square</Tag>

<Tag dismissible icon={CalendarMonthRegular} secondaryText="Secondary text">Circular</Tag>
<Tag shape="rounded" dismissible icon={CalendarMonthRegular} secondaryText="Secondary text">Rounded</Tag>
<Tag shape="square" dismissible icon={CalendarMonthRegular} secondaryText="Secondary text">Square</Tag>
```

### Size

A tag supports `medium`, `small` and `extra-small` sizes. The default is `medium`.

```svelte
{#snippet avatar()}
	<Avatar name="Katri Athokas" size={28} badge={{ status: 'busy' }} />
{/snippet}
{#snippet smallAvatar()}
	<Avatar name="Katri Athokas" size={20} badge={{ status: 'busy' }} />
{/snippet}
{#snippet extraSmallAvatar()}
	<Avatar name="Katri Athokas" size={16} badge={{ status: 'busy' }} />
{/snippet}

<Tag>Medium</Tag>
<Tag dismissible media={avatar}>Medium dismissible</Tag>
<Tag icon={CalendarMonthRegular}>Medium with icon</Tag>

<Tag size="small">Small</Tag>
<Tag size="small" dismissible media={smallAvatar}>Small dismissible</Tag>
<Tag size="small" icon={CalendarMonthRegular}>Small with icon</Tag>

<Tag size="extra-small">Extra small</Tag>
<Tag size="extra-small" dismissible media={extraSmallAvatar}>Extra small dismissible</Tag>
<Tag size="extra-small" icon={CalendarMonthRegular}>Extra small with icon</Tag>
```

## Component Props (Tag)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TagProps -->

| Name             | Type                                                            | Default          | Description                                                                                                                                                                                                                                |
| ---------------- | --------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `appearance`     | `'filled'` &#124; `'outline'` &#124; `'brand'`                  | `'filled'`       | The tag can have a filled, outlined or brand appearance. Falls back to the `appearance` of the `TagGroup` it is in.                                                                                                                        |
| `size`           | `'extra-small'` &#124; `'small'` &#124; `'medium'`              | `'medium'`       | The tag comes in three sizes. Falls back to the `size` of the `TagGroup` it is in.                                                                                                                                                         |
| `shape`          | `'circular'` &#124; `'rounded'` &#124; `'square'`               | `'circular'`     | The tag can have a circular, rounded or square shape.                                                                                                                                                                                      |
| `disabled`       | `boolean`                                                       | `false`          | Shows that the tag cannot be interacted with. A tag inside a disabled `TagGroup` is disabled too.                                                                                                                                          |
| `selected`       | `boolean`                                                       | `false`          | Paints the tag as selected. Inside a `TagGroup` an interactive tag takes its selected state from the `selectedValues` of the group instead.                                                                                                |
| `dismissible`    | `boolean`                                                       | `false`          | Shows a dismiss icon and lets the tag be dismissed. Falls back to the `dismissible` of the `TagGroup` it is in. A tag that is not interactive becomes a single button: activating it, or pressing Delete or Backspace on it, dismisses it. |
| `interactive`    | `boolean`                                                       | `false`          | Renders the tag as an interaction tag: a primary button that carries the action, followed, when the tag is dismissible, by a separate dismiss button. Use it for a tag that has a primary action, and a plain tag for one that does not.   |
| `value`          | `string`                                                        |                  | Identifies the tag inside a `TagGroup`. It is what `onDismiss` and `onTagSelect` report. Falls back to a generated id.                                                                                                                     |
| `icon`           | `Snippet` &#124; `Component`                                    |                  | An icon rendered before the text. Do not use it together with `media`.                                                                                                                                                                     |
| `media`          | `Snippet` &#124; `Component`                                    |                  | A visual element rendered before the text, usually an `Avatar`. Do not use it together with `icon`.                                                                                                                                        |
| `secondaryText`  | `string` &#124; `Snippet`                                       |                  | A second line of text that describes or complements the main text.                                                                                                                                                                         |
| `dismissIcon`    | `Snippet` &#124; `Component`                                    | `DismissRegular` | The icon of the dismiss control.                                                                                                                                                                                                           |
| `dismissLabel`   | `string`                                                        | `'Dismiss'`      | The accessible name of the dismiss control. When the tag is named through `aria-label` or `aria-labelledby` instead, the dismiss icon is hidden from assistive technologies.                                                               |
| `onDismiss`      | `(e: MouseEvent` &#124; `KeyboardEvent, value: string) => void` |                  | Called when the tag is dismissed. The consumer owns the data: the tag does not remove itself.                                                                                                                                              |
| `onclick`        | `(e: MouseEvent) => void`                                       |                  | Called when the tag is activated. On an interactive tag it is the click of the primary button.                                                                                                                                             |
| `onkeydown`      | `(e: KeyboardEvent) => void`                                    |                  | Called when a key is pressed on the tag.                                                                                                                                                                                                   |
| `primaryProps`   | `Omit<HTMLButtonAttributes, 'children'` &#124; `'onclick'>`     |                  | Attributes for the primary button of an interactive tag, for example `aria-haspopup`. If you give it a custom `id`, the dismiss button is named after it.                                                                                  |
| `dismissProps`   | `Omit<HTMLButtonAttributes, 'children'` &#124; `'onclick'>`     |                  | Attributes for the dismiss button of an interactive tag. Use `aria-label` together with `aria-labelledby: undefined` to give the button a name that stands on its own.                                                                     |
| `children`       | `Snippet`                                                       |                  | The primary text of the tag.                                                                                                                                                                                                               |
| `ref` _bindable_ | `HTMLElement`                                                   |                  | The DOM reference of the tag element.                                                                                                                                                                                                      |
| HTML Attributes  |                                                                 |                  |                                                                                                                                                                                                                                            |

<!-- /props:TagProps -->

## TagGroup API

A tag group is a container for several tags. It gives its `size`, `appearance`, `disabled` and `dismissible` to the tags that do not set their own (a tag is disabled when either the tag or the group is), keeps the values of the selected interactive tags in `selectedValues`, and lets the arrow keys move focus between the tags, up and down included when the group wraps into several rows. Its default role is `toolbar`. When none of the tags is actionable, use `role="list"` on the group and `role="listitem"` on each tag.

### Usage

```svelte
<!-- Tags that are not actionable are a list -->
<TagGroup aria-label="Simple tag group with Tag" role="list">
	<Tag role="listitem">Tag 1</Tag>
	<Tag role="listitem">Tag 2</Tag>
	<Tag role="listitem">Tag 3</Tag>
</TagGroup>

<!-- Interactive tags are a toolbar, which is the default role -->
<TagGroup aria-label="Simple tag group with interactive tags">
	<Tag interactive>Tag 1</Tag>
	<Tag interactive>Tag 2</Tag>
	<Tag interactive>Tag 3</Tag>
</TagGroup>
```

### Disabled

A disabled group disables the whole collection of tags.

```svelte
<TagGroup disabled aria-label="Disabled tag group with Tag" role="list">
	<Tag role="listitem">Tag 1</Tag>
	<Tag role="listitem">Tag 2</Tag>
	<Tag role="listitem">Tag 3</Tag>
</TagGroup>

<TagGroup disabled aria-label="Disabled tag group with interactive tags">
	<Tag interactive>Tag 1</Tag>
	<Tag interactive>Tag 2</Tag>
	<Tag interactive>Tag 3</Tag>
</TagGroup>
```

### Dismiss

A group can make its tags dismissible and reports every dismissal through `onDismiss`, with the `value` of the tag. The group does not remove the tag: do it in your data. Focus moves to a neighboring tag when one is dismissed, so the keyboard stays in the group; ensure that focus is properly managed when all tags have been dismissed.

```svelte
<script>
	const initialTags = [
		{ value: '1', text: 'Tag 1' },
		{ value: '2', text: 'Tag 2' },
		{ value: '3', text: 'Tag 3' }
	];

	let plainTags = $state(initialTags);
	let interactiveTags = $state(initialTags);
</script>

<TagGroup
	dismissible
	aria-label="TagGroup example with dismissible tags"
	onDismiss={(e, { value }) => (plainTags = plainTags.filter((tag) => tag.value !== value))}
>
	{#each plainTags as tag (tag.value)}
		<Tag value={tag.value}>{tag.text}</Tag>
	{/each}
</TagGroup>
<Button disabled={plainTags.length === initialTags.length} onclick={() => (plainTags = initialTags)}>
	Reset the example
</Button>

<TagGroup
	dismissible
	aria-label="TagGroup example with dismissible interactive tags"
	onDismiss={(e, { value }) => (interactiveTags = interactiveTags.filter((tag) => tag.value !== value))}
>
	{#each interactiveTags as tag (tag.value)}
		<Tag interactive value={tag.value}>{tag.text}</Tag>
	{/each}
</TagGroup>
<Button disabled={interactiveTags.length === initialTags.length} onclick={() => (interactiveTags = initialTags)}>
	Reset the example
</Button>
```

### Select

Activating the primary button of an interactive tag toggles its `value` in `selectedValues`, and `onTagSelect` reports it. Remove a dismissed value from `selectedValues` yourself.

```svelte
<script>
	const initialTags = [
		{ value: '1', text: 'Tag 1' },
		{ value: '2', text: 'Tag 2' },
		{ value: '3', text: 'Tag 3' }
	];

	let selectedValues = $state([]);
	let tags = $state(initialTags);
	let dismissibleSelectedValues = $state([]);

	const reset = () => {
		selectedValues = [];
		dismissibleSelectedValues = [];
		tags = initialTags;
	};
</script>

<p>Selected values: {selectedValues.join(', ')}</p>
<TagGroup bind:selectedValues aria-label="Tag group with multiselect tags">
	<Tag interactive value="1">Tag 1</Tag>
	<Tag interactive value="2">Tag 2</Tag>
	<Tag interactive value="3">Tag 3</Tag>
</TagGroup>

<p>Selected values: {dismissibleSelectedValues.join(', ')}</p>
<TagGroup
	dismissible
	bind:selectedValues={dismissibleSelectedValues}
	aria-label="Tag group with dismissible multiselect tags"
	onDismiss={(e, { value }) => {
		dismissibleSelectedValues = dismissibleSelectedValues.filter((v) => v !== value);
		tags = tags.filter((tag) => tag.value !== value);
	}}
>
	{#each tags as tag (tag.value)}
		<Tag interactive value={tag.value}>{tag.text}</Tag>
	{/each}
</TagGroup>

<Button
	disabled={!selectedValues.length && !dismissibleSelectedValues.length && tags.length === initialTags.length}
	onclick={reset}
>
	Reset the example
</Button>
```

### Sizes

A group can set the default size of all its tags. It supports `medium`, `small` and `extra-small`. The default is `medium`.

```svelte
{#each ['medium', 'small', 'extra-small'] as size}
	<TagGroup {size} aria-label="{size} tag group example">
		<Tag interactive>{size}</Tag>
		<Tag interactive icon={CalendarMonthRegular}>{size}</Tag>
		<Tag interactive dismissible icon={CalendarMonthRegular}>{size}</Tag>
	</TagGroup>
{/each}
```

## Component Props (TagGroup)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TagGroupProps -->

| Name                        | Type                                                                      | Default     | Description                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `size`                      | `'extra-small'` &#124; `'small'` &#124; `'medium'`                        | `'medium'`  | The size given to the tags of the group that do not set their own.                                             |
| `appearance`                | `'filled'` &#124; `'outline'` &#124; `'brand'`                            |             | The appearance given to the tags of the group that do not set their own.                                       |
| `disabled`                  | `boolean`                                                                 | `false`     | Disables every tag of the group.                                                                               |
| `dismissible`               | `boolean`                                                                 |             | Makes the tags of the group that do not set their own dismissible.                                             |
| `selectedValues` _bindable_ | `string[]`                                                                | `[]`        | The values of the selected interactive tags.                                                                   |
| `onTagSelect`               | `(e: MouseEvent, data: { value: string; selected: boolean }) => void`     |             | Called when an interactive tag of the group is activated, with the value it toggles.                           |
| `onDismiss`                 | `(e: MouseEvent` &#124; `KeyboardEvent, data: { value: string }) => void` |             | Called when a tag of the group is dismissed. The consumer owns the data: the group does not remove the tag.    |
| `role`                      | `HTMLAttributes<HTMLDivElement>['role']`                                  | `'toolbar'` | The role of the group. Use `list` together with `role="listitem"` on each tag when none of them is actionable. |
| `children`                  | `Snippet`                                                                 |             | The tags of the group.                                                                                         |
| `ref` _bindable_            | `HTMLDivElement`                                                          |             | The DOM reference of the group element.                                                                        |
| HTML Attributes             |                                                                           |             |                                                                                                                |

<!-- /props:TagGroupProps -->
