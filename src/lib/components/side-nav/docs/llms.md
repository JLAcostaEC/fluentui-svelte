# SideNav

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

App navigation built on ListView. SideNavItem renders an anchor by default. Use `as="button"` for actions, or `as="li"` / `as="div"` for content with multiple controls. The navigation owns no router: set href and active from your app's current route.

## Usage

```svelte
<script>
	import { AppWindow, AppSurface, SideNav, SideNavItem } from 'fluentui-svelte';
	import HomeRegular from 'fluentui-icons-svelte/HomeRegular.svelte';
	import FolderRegular from 'fluentui-icons-svelte/FolderRegular.svelte';
	import SettingsRegular from 'fluentui-icons-svelte/SettingsRegular.svelte';
</script>

<AppWindow width={480} height={240}>
	<SideNav header="Workspace">
		<SideNavItem href="#home" label="Home" icon={HomeRegular} active />
		<SideNavItem href="#documents" label="Documents" icon={FolderRegular} />
		<SideNavItem href="#settings" label="Settings" icon={SettingsRegular} />
	</SideNav>
	<AppSurface style="padding: 1rem">Page content</AppSurface>
</AppWindow>
```

SideNav also works on its own, in any container with a height. Use `bind:collapsed` to control it, `SideNavBranch` to nest items and the `footer` snippet to pin items to the bottom.

## Modes and accessibility

Docked navigation occupies layout space and collapses to an icon rail. Labels remain available to assistive technology. Items without icons show their initial in the rail. Opening a branch from the rail expands the navigation first.

With `floating`, SideNav overlays AppWindow's body below its optional TitleBar. Closed floating navigation shows only the hamburger; opening it does not move page content. It is non-modal and does not trap focus. Escape, an outside pointer press, moving focus outside, and activating a SideNavItem close it. Set `closeOnSelect={false}` to keep it open after activation. A standalone floating SideNav needs a positioned parent.

Inside an AppWindow whose TitleBar has a global navigation button (`TitleBarLeftControls globalNav`), that button expands and collapses the SideNav, follows its state in `aria-expanded`, and SideNav hides its own hamburger. Set `showToggle` to `true` to keep both, or to `false` to hide the hamburger and control it yourself (`getAppWindowContext().state.sideNav.setCollapsed`). While a floating navigation is open, the global button is not an outside press.

The Button toggle exposes aria-expanded and aria-controls. SideNav is a named navigation landmark with native lists and links. The underlying ListView supplies arrow navigation, disabled-item handling and selection. Avoid menu/listbox roles for ordinary route navigation. There is no back button.

## Custom content and footer

Only two regions accept text, snippets or components: `topContent`, between the hamburger section and the list, and `footerContent`, after the list and before the pinned navigation footer. Strings render as text and are hidden in the compact rail. Snippets receive `{ collapsed, floating }`; components receive these as props, so they can render compact controls or hide their content. Use a snippet to supply other required component props.

The header is plain text. SideNavItem uses its label or ordinary ListViewItem children markup. The `footer` snippet contains navigation entries and remains pinned while the main list scrolls. Compose real Menu, TextBox, Avatar and Button components in the two custom regions.

## ListView customization

`listViewProps` customizes every list of the navigation: the main one, the footer and the ones inside a SideNavBranch. Defaults are role="list", selectionMode="none" and navigationMode="items". Keep native list semantics when using branches. Selection can be enabled and bound through `selectedItems`, shared across all of them. Set each item's value when using selection.

## Component Props (SideNav)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:SideNavProps -->

| Name                                             | Type                                         | Default                 | Description                                                                                                                                                                                                                                                     |
| ------------------------------------------------ | -------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                 | `HTMLElement` &#124; `null`                  |                         | The DOM reference of the navigation landmark.                                                                                                                                                                                                                   |
| `label`                                          | `string`                                     | `'Main navigation'`     | The accessible name of the navigation landmark.                                                                                                                                                                                                                 |
| `collapsed` _bindable_                           | `boolean`                                    | `false`                 | Shows an icon rail when docked, or only the toggle when floating.                                                                                                                                                                                               |
| `position`                                       | `'left'` &#124; `'right'`                    | `'left'`                | The side of the window the navigation is on. It mirrors in right-to-left layouts, and AppSurface rounds the corners that face it.                                                                                                                               |
| `showToggle`                                     | `boolean`                                    | `Automatic`             | Whether the navigation shows its own hamburger toggle. By default it hides it when the title bar of its window has a global navigation button, which then controls the navigation. Set it to true to keep both, or to false to control the navigation yourself. |
| `floating`                                       | `boolean`                                    | `false`                 | Overlays the content of a positioned parent instead of taking layout space. The overlay is non-modal.                                                                                                                                                           |
| `width`                                          | `number` &#124; `string`                     | `200`                   | The expanded width. Numbers are pixels converted to rem; strings are CSS lengths.                                                                                                                                                                               |
| `expandLabel`                                    | `string`                                     | `'Expand navigation'`   | The accessible label of the toggle while collapsed.                                                                                                                                                                                                             |
| `collapseLabel`                                  | `string`                                     | `'Collapse navigation'` | The accessible label of the toggle while expanded.                                                                                                                                                                                                              |
| `closeOnSelect`                                  | `boolean`                                    | `true`                  | Closes a floating panel after activating a SideNavItem.                                                                                                                                                                                                         |
| `onCollapsedChange`                              | `(event: Event, collapsed: boolean) => void` |                         | Called when the user expands or collapses the navigation.                                                                                                                                                                                                       |
| `selectedItems` _bindable_                       | `string[]`                                   |                         | The selection shared by every list in the navigation. Selection is off by default.                                                                                                                                                                              |
| `listViewProps`                                  | `SideNavListViewProps`                       |                         | Overrides the defaults of every list in the navigation, the main one, the footer and the ones inside a SideNavBranch: native list semantics, no selection and one tab stop per item.                                                                            |
| `header`                                         | `string`                                     |                         | The text heading beside the hamburger button. Hidden in the compact rail.                                                                                                                                                                                       |
| `topContent`                                     | `string` &#124; `Snippet` &#124; `Component` |                         | Custom content between the hamburger section and the list. Text, snippets and components are supported. Renderers receive collapsed and floating; strings are hidden in the compact rail.                                                                       |
| `footerContent`                                  | `string` &#124; `Snippet` &#124; `Component` |                         | Custom content after the scrolling list and before the pinned footer. Text, snippets and components are supported. Renderers receive collapsed and floating; strings are hidden in the compact rail.                                                            |
| `footer`                                         | `Snippet`                                    |                         | Footer list items pinned to the bottom, outside the main list's scroll area.                                                                                                                                                                                    |
| `children`                                       | `Snippet`                                    |                         | Main navigation items. Use SideNavItem and SideNavBranch.                                                                                                                                                                                                       |
| `HTMLAttributes<HTMLElement>` without `children` |                                              |                         |                                                                                                                                                                                                                                                                 |

<!-- /props:SideNavProps -->

## Component Props (SideNavItem)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:SideNavItemProps -->

| Name                                                                                                        | Type                                                                                          | Default | Description                                                                                    |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `as`                                                                                                        | `'li'` &#124; `'a'` &#124; `'button'` &#124; `'div'`                                          | `'a'`   | The HTML tag. Links are the default; use button for actions and li or div for custom controls. |
| `ref` _bindable_                                                                                            | `HTMLLIElement` &#124; `HTMLAnchorElement` &#124; `HTMLButtonElement` &#124; `HTMLDivElement` |         | The DOM reference of the item.                                                                 |
| `label`                                                                                                     | `string`                                                                                      |         | The accessible label, also used as visible content when children are absent.                   |
| `icon`                                                                                                      | `Snippet` &#124; `Component`                                                                  |         | The decorative icon shown in both expanded and collapsed modes.                                |
| `children`                                                                                                  | `Snippet`                                                                                     |         | Optional item markup, following ListViewItem. The label is rendered when children are absent.  |
| `shape`, `value`, `active`, `role`, `disabled`, `checkmark`, `onAction`, `onfocus` from `ListViewItemProps` |                                                                                               |         |                                                                                                |
| HTML Attributes                                                                                             |                                                                                               |         |                                                                                                |

<!-- /props:SideNavItemProps -->

## Component Props (SideNavBranch)

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:SideNavBranchProps -->

| Name                                                                                                 | Type                                    | Default | Description                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`                                                                                              | `string`                                |         | The accessible label of the disclosure button. In the compact rail, its initial stands in when there is no icon.                                                                               |
| `icon`                                                                                               | `Snippet` &#124; `Component`            |         | The decorative icon before the label.                                                                                                                                                          |
| `expanded` _bindable_                                                                                | `boolean`                               | `false` | Whether the nested items are visible. Branches only expand or collapse and are never selectable. The compact rail reports a branch as collapsed, and opens the navigation when one is pressed. |
| `onExpandedChange`                                                                                   | `(e: Event, expanded: boolean) => void` |         | Called when a user expands or collapses the branch.                                                                                                                                            |
| `disabled`                                                                                           | `boolean`                               | `false` | Disables the disclosure button.                                                                                                                                                                |
| `ref` _bindable_                                                                                     | `HTMLButtonElement`                     |         | The DOM reference of the native disclosure button. Additional HTML attributes, including class and id, also target this button.                                                                |
| `wrapperRef` _bindable_                                                                              | `HTMLLIElement` &#124; `HTMLDivElement` |         | The DOM reference of the wrapper element, the list item that holds the button and the nested list.                                                                                             |
| `wrapperAttributes`                                                                                  | `HTMLAttributes`                        |         | The attributes to spread on the wrapper element.                                                                                                                                               |
| `shape`                                                                                              | `ListViewItemBranchProps['shape']`      |         | The disclosure button shape. Inherited from the list by default.                                                                                                                               |
| `children`                                                                                           | `Snippet`                               |         | The nested SideNavItem and SideNavBranch content.                                                                                                                                              |
| `HTMLButtonAttributes` without `children`, `role`, `type`, `value`, `aria-expanded`, `aria-controls` |                                         |         |                                                                                                                                                                                                |

<!-- /props:SideNavBranchProps -->
