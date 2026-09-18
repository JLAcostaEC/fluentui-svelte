# TabView

TabView lays a set of tabs out as a strip, in the shape a browser gives its document tabs. Every tab can carry an icon and a close button, and a new tab button can sit at the end of the strip.

The strip owns the selection and nothing else. What a tab opens is rendered by you, wherever it belongs on the page, so a tab can open a panel underneath it, swap a region somewhere else, or drive a route.

To create a tab strip, you will need to use the following components:

- `TabView`: The root component that creates the context every tab reads: which tab is selected, whether the tabs close, and how they take their width. It renders the `tablist` and, optionally, the new tab button.
- `TabViewTab`: A single tab of the strip. It reports its own selection and can carry an icon and a close button.

## Usage

A tab strip expects a `value` on every tab and an `activeTab` to match it against. Bind `activeTab` to follow the selection, and render whatever the selected tab opens yourself.

```svelte
<script>
	import { TabView, TabViewTab } from 'fluentui-svelte';

	let activeTab = $state('document');
</script>

<TabView bind:activeTab listProps={{ 'aria-label': 'Workspaces' }}>
	<TabViewTab id="tab-document" value="document">Document</TabViewTab>
	<TabViewTab id="tab-mail" value="mail">Mail</TabViewTab>
</TabView>

{#if activeTab === 'document'}
	<div role="tabpanel" aria-labelledby="tab-document">The document you are working on.</div>
{:else}
	<div role="tabpanel" aria-labelledby="tab-mail">Everything that landed in your inbox.</div>
{/if}
```

## Examples

### Closing Tabs

`closable` gives every tab a close button, and a single tab can opt in or out on its own. The strip never removes a tab: the tabs are your markup, so `onTabClose` hands the value back and leaves the removal — and which tab takes over — to you.

```svelte
<script>
	import { TabView, TabViewTab } from 'fluentui-svelte';

	let tabs = $state([
		{ value: 'notes', label: 'Notes' },
		{ value: 'draft', label: 'Draft' }
	]);
	let activeTab = $state('notes');

	const closeTab = (event, value) => {
		const index = tabs.findIndex((tab) => tab.value === value);
		tabs = tabs.filter((tab) => tab.value !== value);
		if (activeTab !== value) return;
		activeTab = tabs[Math.min(index, tabs.length - 1)]?.value ?? '';
	};
</script>

<TabView bind:activeTab closable onTabClose={closeTab}>
	{#each tabs as tab (tab.value)}
		<TabViewTab value={tab.value}>{tab.label}</TabViewTab>
	{/each}
</TabView>
```

### New Tab Button

`showNewTabButton` adds a button at the end of the strip, outside the `tablist` so it never reads as a tab. `onNewTab` fires when it is activated.

```svelte
<TabView bind:activeTab showNewTabButton onNewTab={addTab}>
	{#each tabs as tab (tab.value)}
		<TabViewTab value={tab.value}>{tab.label}</TabViewTab>
	{/each}
</TabView>
```

### Tab Width

`tabWidthMode` decides how the tabs take their width: `equal` shares the strip evenly, `size-to-content` sizes every tab to its own label, and `compact` shrinks every resting tab to its icon and spells out only the selected one.

```svelte
<TabView tabWidthMode="equal">...</TabView>
<TabView tabWidthMode="size-to-content">...</TabView>
<TabView tabWidthMode="compact">...</TabView>
```

### Disabled

A disabled tab cannot be selected, and the arrow keys pass over it rather than landing on it.

```svelte
<TabView activeTab="mail">
	<TabViewTab value="document">Document</TabViewTab>
	<TabViewTab value="mail">Mail</TabViewTab>
	<TabViewTab value="calendar" disabled>Calendar</TabViewTab>
</TabView>
```

## Component Props (TabView)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TabViewProps -->

| Name                       | Type                                                    | Default   | Description                                                                                                                                       |
| -------------------------- | ------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_           | `HTMLDivElement`                                        |           | The DOM reference of the element wrapping the strip.                                                                                              |
| `listRef` _bindable_       | `HTMLDivElement`                                        |           | The DOM reference of the tab list.                                                                                                                |
| `listProps`                | `HTMLAttributes`                                        |           | The props to spread on the tab list element, where the `tablist` role and its label belong.                                                       |
| `activeTab` _bindable_     | `string`                                                |           | The value of the selected tab.                                                                                                                    |
| `onTabChange`              | `(event: Event, value: string) => void`                 |           | Fired when the selected tab changes.                                                                                                              |
| `closable`                 | `boolean`                                               | `false`   | Every tab shows a close button, unless the tab opts out of it.                                                                                    |
| `onTabClose`               | `(event: Event, value: string) => void`                 |           | Fired when a tab asks to be closed. Removing the tab is left to the consumer.                                                                     |
| `showNewTabButton`         | `boolean`                                               | `false`   | Shows the button that adds a new tab at the end of the strip.                                                                                     |
| `onNewTab`                 | `(event: MouseEvent) => void`                           |           | Fired when the new tab button is activated.                                                                                                       |
| `newTabButtonProps`        | `HTMLButtonAttributes`                                  |           | The props to spread on the new tab button.                                                                                                        |
| `tabWidthMode`             | `'equal'` &#124; `'size-to-content'` &#124; `'compact'` | `'equal'` | How the tabs take their width: sharing the strip evenly, sizing to their own content, or shrinking to the icon of every tab but the selected one. |
| `disableTabspot`           | `boolean`                                               | `false`   | Opts the strip out of the tabspot focus management, to wire your own.                                                                             |
| Element Attributes (`div`) |                                                         |           |                                                                                                                                                   |

<!-- /props:TabViewProps -->

## Component Props (TabViewTab)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TabViewTabProps -->

| Name                       | Type                                    | Default | Description                                                                             |
| -------------------------- | --------------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| `ref` _bindable_           | `HTMLDivElement`                        |         | The DOM reference of the tab element.                                                   |
| `value`                    | `string`                                |         | The value that identifies the tab. Defaults to a generated id.                          |
| `icon`                     | `Snippet` &#124; `Component`            |         | The icon to display before the label.                                                   |
| `closable`                 | `boolean`                               |         | Shows the close button of the tab. Falls back to the `closable` of the strip.           |
| `disabled`                 | `boolean`                               |         | Disables the user interaction.                                                          |
| `onClose`                  | `(event: Event, value: string) => void` |         | Fired when the tab asks to be closed, either from its close button or the `Delete` key. |
| Element Attributes (`div`) |                                         |         |                                                                                         |

<!-- /props:TabViewTabProps -->

## Keyboard Navigation

The strip is a single tab stop. `ArrowLeft` and `ArrowRight` walk the tabs, `Home` and `End` jump to the ends, `Enter` and `Space` select the focused tab, and `Delete` closes it when it is closable. `disableTabspot` hands the focus management back to you.

## Accessibility

The strip renders a `tablist` and every tab a `tab`, so give the list a name through the `aria-label` you pass in `listProps`. Since you render what a tab opens, give that element a `tabpanel` role and point its `aria-labelledby` at the `id` of its tab.
