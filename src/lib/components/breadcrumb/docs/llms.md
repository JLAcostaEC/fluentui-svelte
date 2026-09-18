# Breadcrumb

A breadcrumb shows where a page sits in the hierarchy above it, and gives the reader a way back up. It renders a `nav` landmark around an ordered list, so a screen reader can jump straight to it.

The landmark names itself `Breadcrumb`, the trail is an `ol` so its order is part of the markup rather than of the styling, the last step carries `aria-current="page"`, and the dividers are held out of the accessibility tree — a trail of three steps reads as three, not as five. Every one of those can be overridden: pass your own `aria-label`, or an `aria-labelledby`, and the default steps aside.

To create a breadcrumb, you will need to use the following components:

- `Breadcrumb`: The landmark and the list. It creates the context the rest read.
- `BreadcrumbItem`: One step of the trail — the list item the step lives in. It takes anything, not only a step.
- `BreadcrumbButton`: A step that can be activated: an anchor when it goes somewhere, a button when it does something.
- `BreadcrumbDivider`: The mark between two steps. It is decoration, and is hidden from assistive technology.

## Usage

A breadcrumb is a list of steps with a divider between them. The last step is the page the reader is already on, so it is marked `current` rather than linked away.

```svelte
<script>
	import { Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider } from 'fluentui-svelte';
</script>

<Breadcrumb>
	<BreadcrumbItem>
		<BreadcrumbButton as="a" href="/">Home</BreadcrumbButton>
	</BreadcrumbItem>
	<BreadcrumbDivider />
	<BreadcrumbItem>
		<BreadcrumbButton as="a" href="/files">Files</BreadcrumbButton>
	</BreadcrumbItem>
	<BreadcrumbDivider />
	<BreadcrumbItem>
		<BreadcrumbButton current>Quarterly report</BreadcrumbButton>
	</BreadcrumbItem>
</Breadcrumb>
```

## Examples

### Size

`size` sets the type, the height and the divider of every step at once.

```svelte
<Breadcrumb size="small">...</Breadcrumb>
<Breadcrumb size="medium">...</Breadcrumb>
<Breadcrumb size="large">...</Breadcrumb>
```

### Icon

`icon` takes a snippet or a component and renders it beside the label, on the side `iconPosition` asks for.

```svelte
<BreadcrumbItem>
	<BreadcrumbButton as="a" href="/files" icon={FolderRegular}>Files</BreadcrumbButton>
</BreadcrumbItem>
```

### Current Step

`current` marks the step as the page the trail ends at. It announces `aria-current="page"` and reads as text rather than as a way out, so the last step does not offer to take the reader where they already are.

```svelte
<BreadcrumbItem>
	<BreadcrumbButton current>Quarterly report</BreadcrumbButton>
</BreadcrumbItem>
```

### Overflow Menu

A step takes whatever you put in it, so a long trail folds its middle into a menu by making that menu a step of its own. Which steps fold is your call — slice the list wherever the layout needs it.

```svelte
<script>
	// Keep the root and the last two steps; everything between them goes into the menu.
	const head = trail.slice(0, 1);
	const folded = trail.slice(1, -2);
	const tail = trail.slice(-2);
</script>

<Breadcrumb>
	{#each head as item (item.name)}
		<BreadcrumbItem>
			<BreadcrumbButton as="a" href={item.href}>{item.name}</BreadcrumbButton>
		</BreadcrumbItem>
		<BreadcrumbDivider />
	{/each}

	<BreadcrumbItem>
		<Menu>
			<MenuTrigger>
				{#snippet children({ state, menuTriggerProps })}
					<Button bind:ref={state.ref} {...menuTriggerProps} appearance="subtle" aria-label="More steps">
						<MoreHorizontalRegular />
					</Button>
				{/snippet}
			</MenuTrigger>
			<MenuPopover>
				<MenuList>
					<!-- A step that goes somewhere is a link, in the menu as much as in the trail. -->
					{#each folded as item (item.name)}
						<MenuItem href={item.href}>{item.name}</MenuItem>
					{/each}
				</MenuList>
			</MenuPopover>
		</Menu>
	</BreadcrumbItem>
	<BreadcrumbDivider />

	{#each tail as item (item.name)}
		<BreadcrumbItem>
			<BreadcrumbButton current>{item.name}</BreadcrumbButton>
		</BreadcrumbItem>
	{/each}
</Breadcrumb>
```

The label on the menu button is yours to write, and it is worth writing: a trigger with only an icon says nothing to a screen reader. Note also that what lives inside a `MenuPopover` is not rendered until the menu opens, so the folded steps are not in the HTML a crawler reads.

### Focus Mode

`focusMode` decides how the focus walks the trail. `tab`, the default, leaves every step its own tab stop, which is what a reader expects of a row of links. `arrow` gives the whole trail a single tab stop and moves between steps with the arrow keys, with `Home` and `End` for the ends.

```svelte
<Breadcrumb focusMode="arrow">...</Breadcrumb>
```

## Component Props (Breadcrumb)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:BreadcrumbProps -->

| Name                 | Type                                         | Default    | Description                                                                                                                                                |
| -------------------- | -------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_     | `HTMLElement`                                |            | The DOM reference of the `nav`.                                                                                                                            |
| `listRef` _bindable_ | `HTMLOListElement`                           |            | The DOM reference of the list.                                                                                                                             |
| `listProps`          | `HTMLOlAttributes`                           |            | The props to spread on the list element.                                                                                                                   |
| `size`               | `'small'` &#124; `'medium'` &#124; `'large'` | `'medium'` | The size of every step and divider of the trail.                                                                                                           |
| `focusMode`          | `'tab'` &#124; `'arrow'`                     | `'tab'`    | How the focus walks the trail: `tab` leaves every step its own tab stop, `arrow` gives the trail a single one and moves between steps with the arrow keys. |
| Element Attributes   |                                              |            |                                                                                                                                                            |

<!-- /props:BreadcrumbProps -->

## Component Props (BreadcrumbItem)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:BreadcrumbItemProps -->

| Name                      | Type            | Default | Description                    |
| ------------------------- | --------------- | ------- | ------------------------------ |
| `ref` _bindable_          | `HTMLLIElement` |         | The DOM reference of the item. |
| Element Attributes (`li`) |                 |         |                                |

<!-- /props:BreadcrumbItemProps -->

## Component Props (BreadcrumbButton)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:BreadcrumbButtonProps -->

| Name                | Type                              | Default    | Description                                                                                            |
| ------------------- | --------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `ref` _bindable_    | `BreadcrumbItemElementDOMType[T]` |            | The DOM reference of the step.                                                                         |
| `as`                | `'button'` &#124; `'a'`           | `'button'` | The DOM element to render. A step that goes somewhere is an anchor and takes `href`.                   |
| `icon`              | `Snippet` &#124; `Component`      |            | The icon to display beside the label.                                                                  |
| `iconPosition`      | `'before'` &#124; `'after'`       | `'before'` | Which side of the label the icon sits on.                                                              |
| `current`           | `boolean`                         | `false`    | Marks the step as the page the trail ends at, which is what `aria-current` announces.                  |
| `disabled`          | `boolean`                         |            | Disables the user interaction.                                                                         |
| `disabledFocusable` | `boolean`                         | `false`    | Keeps a disabled step focusable, so the tab order stays the same for a keyboard or screen reader user. |
| HTML Attributes     |                                   |            |                                                                                                        |

<!-- /props:BreadcrumbButtonProps -->

## Component Props (BreadcrumbDivider)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:BreadcrumbDividerProps -->

| Name                      | Type            | Default | Description                       |
| ------------------------- | --------------- | ------- | --------------------------------- |
| `ref` _bindable_          | `HTMLLIElement` |         | The DOM reference of the divider. |
| Element Attributes (`li`) |                 |         |                                   |

<!-- /props:BreadcrumbDividerProps -->

## Accessibility

The landmark is named `Breadcrumb` by default, which is what a screen reader announces when jumping to it. Give it your own `aria-label` when a page carries more than one trail, so each is distinguishable, or an `aria-labelledby` pointing at a heading you already render — the default steps aside for both.

The dividers are decoration and are hidden, so the list reads as the number of steps it has. The last step carries `aria-current="page"`. A step with an icon and no label needs an `aria-label` of its own.

Structured data is left to you. A breadcrumb is one of the few components a search engine reads directly, through `BreadcrumbList` from schema.org, but the text of a step lives in your markup and the URLs live in your routing — so the trail you publish is yours to build, in whichever shape your site already uses.
