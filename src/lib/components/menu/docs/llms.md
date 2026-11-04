# Menu

Menu is a component for displaying a list of actions or options in a dropdown format. It can be used in various contexts, such as navigation, settings, or context menus.

This component relies on the Floating UI library for positioning. It provides a flexible API for creating complex menu structures, including nested menus, checkable items, and disabled items.

To create a menu, you will need to use the following components:

- `Menu`: The root component that creates all the state and provides context to its children.
- `MenuTrigger`: Handles all the logic for the trigger element that opens the menu. It uses a render prop pattern to provide the necessary props and state to the trigger element.
- `ContextMenuTrigger`: A variant of MenuTrigger that is designed to be used for context menus. It attaches the menu to a specified element and opens on right-click.
- `MenuPopover`: The container for the menu content. It handles the positioning and accessibility of the menu.
- `MenuList`: A wrapper for the list of menu items.
- `MenuItem`: Represents a single item in the menu. It can be a simple action or a trigger for a nested menu.
- `SplitButton` or `Button`: The trigger element for the menu.

Other components that can be used within the menu include:

- `MenuGroup`: A wrapper for grouping related menu items together, with an optional header.
- `MenuDivider`: A visual separator between menu items or groups.
- `MenuItemCheckbox`: A menu item that can be checked or unchecked.
- `MenuItemSwitch`: A menu item that can be toggled on or off.
- `MenuItemRadio`: A menu item that can be selected as part of a group of radio items.
- `MenuCommandBar`: A row of icon-only commands placed at the top or at the bottom of the menu, with an optional overflow submenu.
- `MenuCommandBarItem`: A square, icon-only command of a MenuCommandBar, with a label that names it and shows as its tooltip.

## Usage

To correctly attach events to the trigger element, you should wrap the element with the `children()` `snippet`. This allows you to bind the necessary props and state to your trigger element, ensuring that the menu opens and closes as expected.

```svelte
<script>
	import { Button, Menu, MenuTrigger, MenuPopover, MenuList, MenuGroup, MenuItem, MenuDivider } from 'fluentui-svelte';
</script>

<Menu>
	<MenuTrigger>
		{#snippet children({ state, menuTriggerProps })}
			<Button bind:ref={state.ref} {...menuTriggerProps}>Open Menu</Button>
		{/snippet}
	</MenuTrigger>
	<MenuPopover>
		<MenuList>
			<MenuGroup header="Group 1">
				<MenuItem>Item 1</MenuItem>
				<MenuItem>Item 2</MenuItem>
			</MenuGroup>
			<MenuDivider />
			<MenuGroup header="Group 2">
				<MenuItem>Item 3</MenuItem>
				<MenuItem>Item 4</MenuItem>
			</MenuGroup>
		</MenuList>
	</MenuPopover>
</Menu>
```

## More Examples

### Menu with checkable items and nested submenus

```svelte
<Menu hasCheckmarks hasIcons {checkedValues} onCheckedValueChange={(e, value) => (checkedValues = value)}>
	<MenuTrigger>
		{#snippet children({ state, menuTriggerProps })}
			<Button isMenuButton bind:ref={state.ref} {...menuTriggerProps}>
				<AccessTimeRegular /> Open Menu
			</Button>
		{/snippet}
	</MenuTrigger>
	<MenuPopover>
		<MenuList>
			<MenuItem subText="An explanation here">Item With Subtext</MenuItem>
			<MenuDivider />
			<MenuItem disabled>I'm Disabled</MenuItem>
			<MenuItemCheckbox name="item4" value="item4" icon={AccessTimeRegular}>I'm a checkbox</MenuItemCheckbox>
			<MenuItemSwitch>I'm a switch</MenuItemSwitch>
			<MenuItemRadio name="item6" value="item6" icon={AccessTimeRegular}>I'm a radio</MenuItemRadio>
		</MenuList>
	</MenuPopover>
</Menu>
```

### Menu with a SplitButton trigger

```svelte
<Menu>
	<MenuTrigger>
		{#snippet children({ state, menuTriggerProps, primaryButtonProps })}
			<SplitButton
				bind:menuTriggerRef={state.ref}
				menuTriggerProps={{ ...menuTriggerProps, 'aria-label': 'More options' }}
				primaryButtonProps={{ onclick: () => alert('Primary action'), ...primaryButtonProps }}
			>
				Primary Action
			</SplitButton>
		{/snippet}
	</MenuTrigger>
	<MenuPopover>
		<MenuList>
			<MenuItem>Item 1</MenuItem>
			<MenuItem>Item 2</MenuItem>
		</MenuList>
	</MenuPopover>
</Menu>
```

### Menu with a command bar

A command bar flyout pairs a row of square, icon-only primary commands with the items of the menu. Place a `MenuCommandBar` at the top or at the bottom of the `MenuList` and set its `position` to match. Fill it with `MenuCommandBarItem`, each with an `icon` and a `label` that names it and shows as its tooltip. The `overflow` snippet adds a "more" button at the end of the row that opens the secondary commands in a submenu.

Left and Right move along the bar. Up and Down move between the bar and the items of the menu.

```svelte
<Menu>
	<MenuTrigger>
		{#snippet children({ state, menuTriggerProps })}
			<Button bind:ref={state.ref} {...menuTriggerProps}>Commands on top</Button>
		{/snippet}
	</MenuTrigger>
	<MenuPopover>
		<MenuList>
			<!-- position="bottom" when the bar comes after the items -->
			<MenuCommandBar>
				<MenuCommandBarItem icon={CutRegular} label="Cut" />
				<MenuCommandBarItem icon={CopyRegular} label="Copy" />
				<MenuCommandBarItem icon={ClipboardPasteRegular} label="Paste" />
				{#snippet overflow()}
					<MenuItem>Select all</MenuItem>
					<MenuItem>Rename</MenuItem>
				{/snippet}
			</MenuCommandBar>
			<MenuItem>Open</MenuItem>
			<MenuItem>Open with</MenuItem>
			<MenuItem>Properties</MenuItem>
		</MenuList>
	</MenuPopover>
</Menu>
```

By default every command is a square that shows only its icon. `showLabels` shows the label of every command below its icon, and `showDividers` draws a divider between every two commands; with either of them the commands share the width of the bar evenly.

```svelte
<MenuCommandBar showLabels showDividers>
	<MenuCommandBarItem icon={CutRegular} label="Cut" />
	<MenuCommandBarItem icon={CopyRegular} label="Copy" />
	<MenuCommandBarItem icon={EditRegular} label="Rename" />
	<MenuCommandBarItem icon={ShareRegular} label="Share" />
	<MenuCommandBarItem icon={DeleteRegular} label="Delete" />
</MenuCommandBar>
```

## Context Menu

This variant of the `MenuTrigger` component allows you to create context menus that open on right-click. You can specify the element to which the context menu should be attached using the `ref` prop. If no element is provided, it will attach to the `document.body` by default.

```svelte
<Menu>
	<ContextMenuTrigger ref={document.querySelector('#context-menu-box')} />
	<MenuPopover>
		<MenuList>
			<MenuItem>Item 1</MenuItem>
			<MenuItem>Item 2</MenuItem>
		</MenuList>
	</MenuPopover>
</Menu>
```

## Component Props (Menu)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:MenuProps -->

| Name                      | Type                                                          | Default | Description                                                                |
| ------------------------- | ------------------------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| `positionConfig`          | `ComputePositionConfig`                                       |         | The position configuration handed over to floating-ui.                     |
| `hasIcons`                | `boolean`                                                     |         | Reserves the room every item needs for an icon, so the labels line up.     |
| `hasCheckmarks`           | `boolean`                                                     |         | Reserves the room every item needs for a checkmark, so the labels line up. |
| `open`                    | `boolean`                                                     |         | Controls the open state of the menu.                                       |
| `onOpenChange`            | `(e: Event, open: boolean) => void`                           |         | Called whenever the menu opens or closes.                                  |
| `checkedValues`           | `Record<string, string[]>`                                    | `{}`    | The checked values of the menu, grouped by the `name` of each item.        |
| `onCheckedValueChange`    | `(e: Event, checkedValues: Record<string, string[]>) => void` |         | Called whenever a checkbox or radio item changes.                          |
| `openOnHover`             | `boolean`                                                     | `false` | Opens the menu on hover instead of on click.                               |
| `openingDelay`            | `number`                                                      | `0`     | How long to wait, in milliseconds, before opening the menu.                |
| `persistOnItemActivation` | `boolean`                                                     | `false` | Keeps the menu open after an item is activated.                            |
| `children`                | `Snippet`                                                     |         | The parts of the menu: a trigger and a popover.                            |

<!-- /props:MenuProps -->

## Component Props (MenuPopover)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:MenuPopoverProps -->

| Name              | Type                                 | Default | Description                                              |
| ----------------- | ------------------------------------ | ------- | -------------------------------------------------------- |
| `ref`             | `HTMLElement` &#124; `null`          |         | The element used to position the popover.                |
| `open` _bindable_ | `boolean` &#124; `null`              |         | Controls the open state of the popover.                  |
| `keepMounted`     | `boolean`                            | `false` | Keeps the popover mounted in the DOM while it is closed. |
| `placement`       | `ComputePositionConfig['placement']` |         | Where the popover is positioned relative to its trigger. |
| `positionConfig`  | `ComputePositionConfig`              |         | The position configuration handed over to floating-ui.   |
| `children`        | `Snippet`                            |         | The content of the popover.                              |

<!-- /props:MenuPopoverProps -->

## Component Props (MenuTrigger)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:MenuTriggerProps -->

| Name       | Type                                              | Default | Description                                                                               |
| ---------- | ------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `disabled` | `boolean`                                         |         | Disables the user interaction.                                                            |
| `shape`    | `'circular'` &#124; `'rounded'` &#124; `'square'` |         | The trigger can be rounded, circular, or square.                                          |
| `icon`     | `Snippet` &#124; `Component`                      |         | An optional icon for the trigger.                                                         |
| `children` | `Snippet`                                         |         | A custom trigger. It receives the menu state and the props to spread on your own buttons. |

<!-- /props:MenuTriggerProps -->

## Component Props (MenuItem)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:MenuItemProps -->

| Name               | Type                         | Default | Description                                      |
| ------------------ | ---------------------------- | ------- | ------------------------------------------------ |
| `icon`             | `Snippet` &#124; `Component` |         | The icon to display before the label.            |
| `secondaryContent` | `string`                     |         | Right aligned text, usually a keyboard shortcut. |
| `disabled`         | `boolean`                    |         | Disables the user interaction.                   |
| `subText`          | `string`                     |         | A second line of text below the label.           |
| `href`             | `string`                     |         | Renders the item as a link pointing to this URL. |

<!-- /props:MenuItemProps -->

## Component Props (MenuItemCheckbox/Switch/Radio)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:MenuItemActionableProps -->

| Name                           | Type                    | Default | Description                                                                                |
| ------------------------------ | ----------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `checked` _bindable_           | `boolean` &#124; `null` |         | Whether the item is checked.                                                               |
| `value`                        | `string`                | `id`    | The value reported to the menu when the item is checked. Falls back to the id of the item. |
| `name`                         | `string`                | `id`    | The group of items this one belongs to. Falls back to the id of the item.                  |
| `MenuItemProps` without `href` |                         |         |                                                                                            |
| `ButtonProps<'button'>`        |                         |         |                                                                                            |

<!-- /props:MenuItemActionableProps -->

## Component Props (MenuGroup)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:MenuGroupProps -->

| Name             | Type                           | Default | Description                             |
| ---------------- | ------------------------------ | ------- | --------------------------------------- |
| `ref` _bindable_ | `HTMLDivElement` &#124; `null` |         | The DOM reference of the group element. |
| `header`         | `string`                       |         | The label of the group.                 |
| `children`       | `Snippet`                      |         | The items of the group.                 |

<!-- /props:MenuGroupProps -->

## Component Props (MenuCommandBar)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:MenuCommandBarProps -->

| Name                                                        | Type                           | Default          | Description                                                                                                    |
| ----------------------------------------------------------- | ------------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                            | `HTMLDivElement` &#124; `null` |                  | The DOM reference of the command bar element.                                                                  |
| `position`                                                  | `'top'` &#124; `'bottom'`      | `'top'`          | Where the bar sits in the menu. A bar at the top has its divider below it, and one at the bottom has it above. |
| `label`                                                     | `string`                       | `'Commands'`     | The accessible name of the group of commands.                                                                  |
| `overflowLabel`                                             | `string`                       | `'More options'` | The accessible name of the button that opens the overflow.                                                     |
| `overflow`                                                  | `Snippet`                      |                  | The secondary commands. When present, a "more" button at the end of the bar opens them in a submenu.           |
| `showLabels`                                                | `boolean`                      | `false`          | Shows the label of every command below its icon. Without labels, every command is a square.                    |
| `showDividers`                                              | `boolean`                      | `false`          | Draws a divider between every two commands.                                                                    |
| `children`                                                  | `Snippet`                      |                  | The primary commands, as `MenuCommandBarItem`s.                                                                |
| `HTMLAttributes<HTMLDivElement>` without `children`, `role` |                                |                  |                                                                                                                |

<!-- /props:MenuCommandBarProps -->

## Component Props (MenuCommandBarItem)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:MenuCommandBarItemProps -->

| Name                                                                        | Type                              | Default | Description                                                                                                                                          |
| --------------------------------------------------------------------------- | --------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                                            | `HTMLButtonElement` &#124; `null` |         | The DOM reference of the button element.                                                                                                             |
| `icon`                                                                      | `Snippet` &#124; `Component`      |         | The icon of the command.                                                                                                                             |
| `label`                                                                     | `string`                          |         | The name of the command. Without visible labels it is the accessible name of the button and shows as its tooltip; with them it shows below the icon. |
| `disabled`                                                                  | `boolean`                         |         | Disables the user interaction.                                                                                                                       |
| `onclick`                                                                   | `(e: MouseEvent) => void`         |         | Called when the command is activated. The menu closes afterwards, unless it persists on item activation.                                             |
| `AriaAttributes` without `aria-label`                                       |                                   |         |                                                                                                                                                      |
| `id`, `class`, `onkeydown`, `onfocus`, `onblur` from `HTMLButtonAttributes` |                                   |         |                                                                                                                                                      |

<!-- /props:MenuCommandBarItemProps -->
