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
				{menuTriggerProps}
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

| Name | Type | Description |
| --- | --- | --- |
| `checkedValues` | `Record<string, string[]>` | Map-like object of checked values, keyed by group name. |
| `onCheckedValueChange` | `(e: Event, checkedValues: Record<string, string[]>) => void` | Callback fired when checked values change. |
| `hasCheckmarks` | `boolean` | States that menu items can contain selectable items and reserve slots for item alignment. |
| `hasIcons` | `boolean` | States that menu items can contain icons and reserve slots for item alignment. |
| `openingDelay` | `number` | The delay in milliseconds before opening a submenu on hover. Default is 0. |
| `open` | `boolean` | Controls the open state of the menu. |
| `onOpenChange` | `(e: Event, open: boolean) => void` | Callback fired when the open state of the menu changes. |
| `openOnHover` | `boolean` | If true, the menu will open when the trigger is hovered. |
| `persistOnItemActivation` | `boolean` | If true, the menu will not close when a menu item is activated. |
| `positionConfig` | `Partial<ComputePositionConfig>` | Configuration for the Floating UI positioning. It will be passed down to MenuPopover. |

## Component Props (MenuTrigger)

| Name | Type | Description |
| --- | --- | --- |
| `shape` | `rounded \| circular \| square` | The shape of the trigger element. Default is 'rounded'. |
| `icon` | `Snippet \| Component` | An optional icon to display in the trigger element. |
| `disabled` | `boolean` | If true, the trigger element will be disabled. |

## Component Props (MenuItem)

| Name | Type | Description |
| --- | --- | --- |
| `icon` | `Snippet \| Component` | An optional icon to display in the menu item. |
| `subText` | `string` | Optional subtext to display below the main content of the menu item. |
| `secondaryContent` | `string` | Optional secondary content to display like a hint text. |
| `href` | `string` | If provided, the menu item will render as an anchor element. |
| `disabled` | `boolean` | If true, the menu item will be disabled. |
| `onClick` | `(e: Event) => void` | Callback fired when the menu item is clicked. |

## Component Props (MenuItemCheckbox/Switch/Radio)

| Name | Type | Description |
| --- | --- | --- |
| All `MenuItem` props | | All props from the MenuItem component are compatible. |
| `value` | `string` | The value of the checkbox item. This is required for the item to be checkable. |
| `checked` | `boolean` | Controls the checked state of the checkbox item. (Bindable) |
| `name` | `string` | The name of the checkbox item, used for grouping related checkboxes. |

## Component Props (MenuGroup)

| Name | Type | Description |
| --- | --- | --- |
| `header` | `string` | Optional header text to display above the group. |
