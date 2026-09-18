# TopNav

TopNav gives a single selection from a row of items, with a bar that marks the selected one. Each item carries a short label and often an icon.

The bar belongs to the strip rather than to any one item: when the selection moves it travels to the item that took it, staying on screen the whole way instead of disappearing from one and reappearing under the next.

The strip owns the selection and nothing else. What an item opens is rendered by you, wherever it belongs on the page, so an item can open a panel underneath it, swap a region somewhere else, or drive a route.

To create a top nav, you will need to use the following components:

- `TopNav`: The root component that creates the context every item reads: which item is selected, the appearance, the size and the axis. It renders the `tablist` and the bar that travels across it.
- `TopNavItem`: A single item of the strip. It reports its own selection and can carry an icon.

## Usage

A top nav expects a `value` on every item and a `selectedValue` to match it against. Bind `selectedValue` to follow the selection, and render whatever the selected item opens yourself.

```svelte
<script>
	import { TopNav, TopNavItem } from 'fluentui-svelte';

	let selectedValue = $state('arrivals');
</script>

<TopNav bind:selectedValue aria-label="Flights">
	<TopNavItem id="tab-arrivals" value="arrivals">Arrivals</TopNavItem>
	<TopNavItem id="tab-departures" value="departures">Departures</TopNavItem>
</TopNav>

{#if selectedValue === 'arrivals'}
	<div role="tabpanel" aria-labelledby="tab-arrivals">Everything landing in the next hour.</div>
{:else}
	<div role="tabpanel" aria-labelledby="tab-departures">Everything leaving in the next hour.</div>
{/if}
```

## Examples

### Appearance

`appearance` decides how the strip is painted. `transparent` has no background of its own and `subtle` fills an item while it is engaged; both mark the selection with the travelling bar. The two circular appearances trade that bar for a pill: `subtle-circular` outlines the selected item and `filled-circular` fills it.

```svelte
<TopNav appearance="transparent">...</TopNav>
<TopNav appearance="subtle">...</TopNav>
<TopNav appearance="subtle-circular">...</TopNav>
<TopNav appearance="filled-circular">...</TopNav>
```

### Size

`size` sets the padding, the type and the thickness of the bar for every item at once.

```svelte
<TopNav size="small">...</TopNav>
<TopNav size="medium">...</TopNav>
<TopNav size="large">...</TopNav>
```

### Vertical

`vertical` stacks the items in a column and moves the bar to their leading edge, where it travels up and down instead of across. The arrow keys follow the same turn.

```svelte
<TopNav bind:selectedValue vertical>
	<TopNavItem value="tab1">First Tab</TopNavItem>
	<TopNavItem value="tab2">Second Tab</TopNavItem>
</TopNav>
```

### Icon

`icon` takes a snippet or a component and renders it before the label.

```svelte
<script>
	import { TopNav, TopNavItem } from 'fluentui-svelte';
	import { AirplaneRegular, AirplaneTakeOffRegular } from 'fluentui-icons-svelte';
</script>

<TopNav bind:selectedValue>
	<TopNavItem value="arrivals" icon={AirplaneRegular}>Arrivals</TopNavItem>
	<TopNavItem value="departures" icon={AirplaneTakeOffRegular}>Departures</TopNavItem>
</TopNav>
```

### As an Anchor

`as="a"` renders the item as an anchor and takes the attributes of one, `href` among them, so the item has a real URL to open in a new tab or copy. It still reports as a `tab`, which is what a strip of tabs over one page should be; if the items are navigation between pages rather than tabs, a `nav` of plain links is the better shape.

```svelte
<TopNav bind:selectedValue>
	<TopNavItem as="a" href="#arrivals" value="arrivals">Arrivals</TopNavItem>
	<TopNavItem as="a" href="#departures" value="departures">Departures</TopNavItem>
</TopNav>
```

### Disabled

`disabled` on the strip disables every item at once, and a single item can be disabled on its own. The arrow keys pass over a disabled item rather than landing on it.

```svelte
<TopNav disabled>...</TopNav>

<TopNav>
	<TopNavItem value="tab1">First Tab</TopNavItem>
	<TopNavItem value="tab2" disabled>Second Tab</TopNavItem>
</TopNav>
```

### Select on Focus

`selectTabOnFocus` selects an item as soon as the focus reaches it, so the arrow keys move the selection rather than only the focus. Use it when what an item opens is already on the page; leave it off when opening one costs a request.

```svelte
<TopNav bind:selectedValue selectTabOnFocus>
	<TopNavItem value="tab1">First Tab</TopNavItem>
	<TopNavItem value="tab2">Second Tab</TopNavItem>
</TopNav>
```

### Reserved Space

A selected item sets its label in semibold, which is wider than the same label at rest. `reserveSelectedTabSpace` is on by default and holds that width from the start, so selecting an item never shoves the ones beside it along. Turning it off lets the items size to what they are showing, and the row shifts as the selection moves.

```svelte
<TopNav bind:selectedValue reserveSelectedTabSpace={false}>
	<TopNavItem value="tab1">First Tab</TopNavItem>
	<TopNavItem value="tab2">Second Tab</TopNavItem>
</TopNav>
```

## Component Props (TopNav)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TopNavProps -->

| Name                       | Type                                                                           | Default         | Description                                                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_           | `HTMLDivElement`                                                               |                 | The DOM reference of the strip.                                                                                                                                                     |
| `selectedValue` _bindable_ | `string`                                                                       |                 | The value of the selected item.                                                                                                                                                     |
| `onTabSelect`              | `(event: Event, value: string) => void`                                        |                 | Fired when an item is selected.                                                                                                                                                     |
| `appearance`               | [`TopNavAppearance`](https://fluentui-svelte.dev/docs/types/#topnavappearance) | `'transparent'` | How the strip is painted: `transparent` has no background of its own, `subtle` fills an item while it is engaged, and the two circular appearances trade the moving bar for a pill. |
| `size`                     | `'small'` &#124; `'medium'` &#124; `'large'`                                   | `'medium'`      | The size of every item of the strip.                                                                                                                                                |
| `vertical`                 | `boolean`                                                                      | `false`         | Arranges the items in a column, with the bar down their leading edge.                                                                                                               |
| `disabled`                 | `boolean`                                                                      | `false`         | Disables the user interaction on every item.                                                                                                                                        |
| `selectTabOnFocus`         | `boolean`                                                                      | `false`         | Selects an item as soon as the focus reaches it, rather than waiting to be asked.                                                                                                   |
| `reserveSelectedTabSpace`  | `boolean`                                                                      | `true`          | A selected item sets its label in semibold, which is wider than the same label at rest. This holds that width from the start, so selecting an item never shifts the ones beside it. |
| `disableTabspot`           | `boolean`                                                                      | `false`         | Opts the strip out of the tabspot focus management, to wire your own.                                                                                                               |
| Element Attributes (`div`) |                                                                                |                 |                                                                                                                                                                                     |

<!-- /props:TopNavProps -->

## Component Props (TopNavItem)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:TopNavItemProps -->

| Name             | Type                          | Default    | Description                                                                                                                        |
| ---------------- | ----------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_ | `TopNavItemElementDOMType[T]` |            | The DOM reference of the item.                                                                                                     |
| `as`             | `'button'` &#124; `'a'`       | `'button'` | The DOM element to render. An anchor takes the attributes of one, `href` among them, and is what an item that navigates should be. |
| `value`          | `string`                      |            | The value that identifies the item. Defaults to a generated id.                                                                    |
| `icon`           | `Snippet` &#124; `Component`  |            | The icon to display before the label.                                                                                              |
| `disabled`       | `boolean`                     |            | Disables the user interaction.                                                                                                     |
| HTML Attributes  |                               |            |                                                                                                                                    |

<!-- /props:TopNavItemProps -->

## Keyboard Navigation

The strip is a single tab stop. The arrows walk the items along the axis they are laid out on, `Home` and `End` jump to the ends, and `Enter` and `Space` select the focused item — or `selectTabOnFocus` selects it on arrival. `disableTabspot` hands the focus management back to you.

## Accessibility

The strip renders a `tablist` and every item a `tab`, so give it a name through `aria-label`. Since you render what an item opens, give that element a `tabpanel` role and point its `aria-labelledby` at the `id` of its item. An item with an icon and no label needs an `aria-label` of its own.
