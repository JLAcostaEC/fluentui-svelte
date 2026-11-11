---
name: fluentui-svelte
description: Build Svelte 5 interfaces with fluentui-svelte, the Fluent UI 2 component library. Use when a project depends on `fluentui-svelte`, when code imports from it, or when asked for Fluent UI / WinUI styled components in Svelte or SvelteKit. Covers setup, theming, forms, overlays, the conventions every component shares, common pitfalls and where to read each component's API.
---

# fluentui-svelte

Fluent UI 2 components for Svelte 5, published on npm as `fluentui-svelte`. The components use runes, snippets
and plain event attributes (`onclick`), so write consumer code the same way: no `export let`, no slots, no `on:click`.

The styles rely on CSS that only Chromium ships today (`field-sizing`, unprefixed `mask`, `backdrop-filter`). In
Firefox and Safari some visuals degrade; behaviour and accessibility do not.

Written for fluentui-svelte `0.7.2`. When the installed version (`node_modules/fluentui-svelte/package.json`)
differs, the guides inside `node_modules` win.

## Before writing code

1. Find the component in the [index](#components) at the end of this file.
2. Read its guide before using it. The installed package ships one per component, matching its version:
   `node_modules/fluentui-svelte/dist/components/<folder>/docs/llms.md`.
   Without the package installed, fetch `https://fluentui-svelte.dev/docs/components/<folder>.md`.
3. Use only the props the guide lists. Do not carry props over from Fluent UI React, WinUI or other Svelte
   libraries: the names and behaviour differ.

## Setup

```sh
npm i -D fluentui-svelte
```

Import the stylesheets once, in the root layout (`src/routes/+layout.svelte` in SvelteKit), and wrap the app in
`FluentUISvelte`. The provider starts the keyboard navigation engine: without it the components render, but arrow
keys do not move focus inside lists, menus, trees and tables.

```svelte
<script>
	import 'fluentui-svelte/theme.css'; // required: the design tokens every component reads
	import 'fluentui-svelte/reset.css'; // optional; skip it if the app already has a reset (Tailwind preflight)
	import 'fluentui-svelte/typography.css'; // optional: the Fluent type ramp
	import 'fluentui-svelte/class-darkmode.css'; // dark theme via a `dark` class on <html>
	import { ModeWatcher } from 'mode-watcher';
	import { FluentUISvelte } from 'fluentui-svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<FluentUISvelte>
	{@render children()}
</FluentUISvelte>
```

- Dark mode: pick **one** of `class-darkmode.css` (a `dark` class on `<html>`, which `<ModeWatcher />` from
  `mode-watcher` sets; switch it with `setMode('dark' | 'light' | 'system')` or `toggleMode()`) and
  `media-darkmode.css` (follows `prefers-color-scheme`, no JavaScript). `mode-watcher` is already a dependency of
  the library. The provider does not render `<ModeWatcher />` for you.
- `FluentUISvelte` takes only `children` (and an optional `tabspotInstance`). It has no theme or reduced-motion
  props; reduced motion follows the operating system.
- Everything is exported from the package root: `import { Button, Dialog } from 'fluentui-svelte'`.

## Rules every component follows

**Icons** come from `fluentui-icons-svelte` (6,000+ Fluent icons as Svelte components). The library depends on it,
but an app that imports icons itself must install it too: `npm i -D fluentui-icons-svelte`. Browse the names at
https://fluentui-icons-svelte.pages.dev/icons. Import each icon from its own file, never from the package root. The
root re-exports thousands of components, and Vite prebundles all of them in dev (minutes of cold start):

```svelte
<script>
	import AddRegular from 'fluentui-icons-svelte/AddRegular.svelte'; // yes
	// import { AddRegular } from 'fluentui-icons-svelte';             // no
</script>
```

Icon props (`icon`, `indicatorIcon`, `iconBefore`, `media`, `expandIcon`, …) take either the component itself
(`icon={AddRegular}`) or a snippet when the icon needs its own props:
`{#snippet add()}<AddRegular width="1.25rem" />{/snippet}`.

**Bound state starts at `null`, not `undefined`.** Every `$bindable` prop defaults to `null` (or another simple
value), and Svelte throws when you `bind:` a prop with a default to `undefined`:

```svelte
<script>
	let date = $state(null); // not $state() / undefined
	let input = $state(null); // for bind:ref too
</script>

<CalendarDatePicker bind:value={date} />
```

**Where attributes go.** Attributes passed straight to a component (`id`, `name`, `required`, `class`, `aria-*`,
`oninput`, …) land on the element that holds the value or does the job: the native `<input>`/`<select>` of a form
control, the `<button>` of a Button. Inner parts are reached through named props instead:

- `*Attributes` for a plain element: `wrapperAttributes` (outer container), `buttonAttributes`, `inputAttributes`,
  `listAttributes`, `dismissButtonAttributes`.
- `*Props` for an inner component: `flyoutProps`, `listboxProps`, `tagGroupProps`, `tooltipProps`,
  `menuTriggerProps`, `primaryButtonProps`.
- `*Ref` to bind those elements: `wrapperRef`, `buttonRef`, `inputRef`, `menuTriggerRef`. `ref` (bindable) is the
  main element.

To label or describe an inner part, pass the attribute through its `*Props`/`*Attributes` prop. Do not look for a
dedicated prop such as `menuLabel`: there is none.

**`as` picks the rendered tag** from a fixed list (Button: `button | a | div`; Card: `div | article | section | a`;
ListViewItem: `li | a | button | div`; DialogTitle: `div | h1`–`h6`). Any other value throws.

**Callbacks** are named `onXxx` and receive `(event, data)`: `onOpenChange`, `onCheckedValueChange`,
`onSelectionChange`, `onTabSelect`, `onDismiss`, `onAction`. Exceptions: Card `onSelectionChange(id, selected)` has
no event, and the text inputs keep WinUI names (`textChanged`, `querySubmitted`, `suggestionChosen`). Native events
stay lowercase (`onclick`, `oninput`).

**You own the data.** Callbacks that report a removal never remove anything: `Tag`/`TagGroup` `onDismiss` and
`TabView` `onTabClose` tell you which item to drop from your own array.

**Parts need their parent.** `DialogTrigger`, `MenuItem`, `CardHeader`, `DropdownOption`, `TagPickerOption`,
`ListViewItem`, `TreeViewItem`, `TopNavItem`, `TabViewTab` and the other sub-components throw when rendered outside
their root component.

## Forms

Form controls are real form fields: `name`, `value`, `required`, `form`, `min`/`max`/`step` and the validation
events go to a native element, so the values reach `FormData`, the browser validates them and `form.reset()`
restores them. Plain `<form method="POST">` and SvelteKit form actions work without glue code.

```svelte
<script>
	import { Label, TextBox, Dropdown, DropdownOption, Checkbox, Button } from 'fluentui-svelte';

	let email = $state('');
	let role = $state('');
</script>

<form method="POST">
	<Label label="Email"><TextBox name="email" type="email" required bind:value={email} /></Label>
	<Label label="Role">
		<Dropdown name="role" required bind:value={role}>
			<DropdownOption value="dev" text="Developer">Developer</DropdownOption>
			<DropdownOption value="design" text="Designer">Designer</DropdownOption>
		</Dropdown>
	</Label>
	<Checkbox name="terms" required>I accept the terms</Checkbox>
	<Button type="submit">Send</Button>
</form>
```

- **Label** names the first control inside it, or the next one after it: the control takes the label's id when it
  has none. If the control has an `id` of its own and the label text comes first, pass that id as `for`. Inside a
  Label, the own text of a Checkbox, RadioButton or ToggleSwitch is not rendered: the Label names it.
- **Pickers** (Dropdown, TagPicker, DatePicker, TimePicker, CalendarDatePicker) draw a button or input and keep a
  hidden native field for the value. Attributes you pass go to that field; the visible control takes
  `buttonAttributes` / `inputAttributes`. A plain `<label for>` names a picker only after hydration, so prefer
  `Label` or `aria-labelledby`.
- **Invalid state** has no prop: the styles follow native validation (`:user-invalid`) and `aria-invalid="true"`.
  Pass `aria-invalid` and `aria-errormessage` (or `aria-describedby`) straight to the control for server errors.
- `Label` has a `required` of its own that only draws the indicator; the field still needs `required`.

## Overlays

None of them uses a portal: popups are positioned in place (`position: fixed` for Menu and Tooltip), so an
ancestor with `transform`, `filter` or `contain` moves or clips them.

**Dialog** wraps the native `<dialog>`. `type` is `'modal'` (default), `'non-modal'` or `'alert'` (no dismissal by
Escape or outside click).

```svelte
<script>
	import {
		Dialog,
		DialogTrigger,
		DialogSurface,
		DialogTitle,
		DialogContent,
		DialogActions,
		Button
	} from 'fluentui-svelte';

	let dialog = $state(null);
</script>

<Dialog bind:this={dialog} onOpenChange={(open) => console.log(open)}>
	<DialogTrigger>Edit profile</DialogTrigger>
	<DialogSurface>
		<DialogTitle>Edit profile</DialogTitle>
		<DialogContent>…</DialogContent>
		<DialogActions>
			<Button>Save</Button>
			<Button appearance="standard" onclick={() => dialog.closeDialog()}>Close</Button>
		</DialogActions>
	</DialogSurface>
</Dialog>
```

Open a modal or alert dialog with `DialogTrigger` or `dialog.openDialog()`. Setting `open` only adds the `open`
attribute, which shows the `<dialog>` without the modal layer (no backdrop, no focus trap).

**Menu** renders no trigger of its own: `MenuTrigger` hands its snippet the props and the state to bind, and the
popover appears only once `state.ref` is bound.

```svelte
<Menu hasCheckmarks {checkedValues} onCheckedValueChange={(e, values) => (checkedValues = values)}>
	<MenuTrigger>
		{#snippet children({ state, menuTriggerProps })}
			<Button bind:ref={state.ref} {...menuTriggerProps}>Sort</Button>
		{/snippet}
	</MenuTrigger>
	<MenuPopover>
		<MenuList>
			<MenuItemRadio name="sort" value="name">Name</MenuItemRadio>
			<MenuItemRadio name="sort" value="date">Date</MenuItemRadio>
			<MenuDivider />
			<MenuItem onclick={refresh}>Refresh</MenuItem>
		</MenuList>
	</MenuPopover>
</Menu>
```

- `checkedValues` (`Record<name, value[]>`) and `open` are one-way: write them back from `onCheckedValueChange` /
  `onOpenChange`. A radio item closes the menu; checkbox and switch items keep it open.
- A submenu is a nested `<Menu>`, with its own trigger and popover, inside a `MenuList`.
- `ContextMenuTrigger ref={element}` opens the menu on right click; get `element` from `bind:this`, never from
  `document.querySelector` in markup (it breaks SSR).
- With a `SplitButton`, the snippet also passes `primaryButtonProps`; bind `menuTriggerRef={state.ref}` and give
  `menuTriggerProps` an `aria-label`, because that part shows only an arrow.

**Tooltip** wraps its target and spreads attributes onto it:

```svelte
<Tooltip content="Delete the file" relationship="description" withArrow>
	{#snippet children(attrs)}
		<Button {...attrs}>Delete</Button>
	{/snippet}
</Tooltip>
```

`relationship` defaults to `'label'`, which makes the tooltip the accessible name of the target. Use
`'description'` when the target already has a name (visible text or `aria-label`). A `target` prop
(an `HTMLElement`) anchors a tooltip to an element elsewhere.

**Flyout** is only the floating surface: it has no trigger, open state or outside-click handling. Anchor it with
`floating reference={element}` (plus `placement`, `offset`), show and hide it with `hidden` or `{#if}`, and close
it yourself.

**MenuCommandBar** adds a row of square, icon-only commands at the top or bottom of a `MenuList` (set its
`position` to match). Each `MenuCommandBarItem` needs an `icon` and a `label`, which names it and shows as its
tooltip; the `overflow` snippet adds a "more" button with the secondary commands.

## App shell

`AppWindow` draws the frame of a desktop-style app (Mica, border, shell shadow). Its direct children are an
optional `TitleBar` across the top, an optional `SideNav` and the `AppSurface` that holds the page:

```svelte
<script>
	import { page } from '$app/state';
	import {
		AppWindow,
		AppSurface,
		TitleBar,
		TitleBarLeftControls,
		TitleBarRightControls,
		SideNav,
		SideNavItem
	} from 'fluentui-svelte';
	import AppsRegular from 'fluentui-icons-svelte/AppsRegular.svelte';
	import HomeRegular from 'fluentui-icons-svelte/HomeRegular.svelte';
	import FolderRegular from 'fluentui-icons-svelte/FolderRegular.svelte';

	let { children } = $props();
</script>

<div style="height: 100dvh">
	<AppWindow active>
		<TitleBar>
			{#snippet leftControls()}
				<TitleBarLeftControls globalNav appIcon={AppsRegular} appName="Contoso" />
			{/snippet}
		</TitleBar>
		<SideNav header="Workspace">
			<SideNavItem href="/" label="Home" icon={HomeRegular} active={page.url.pathname === '/'} />
			<SideNavItem href="/files" label="Files" icon={FolderRegular} active={page.url.pathname.startsWith('/files')} />
		</SideNav>
		<AppSurface>{@render children()}</AppSurface>
	</AppWindow>
</div>
```

- `AppWindow` is `100%` wide and tall unless you pass `width` and `height`, so its container needs a height. It
  clips overflow: the page scrolls inside `AppSurface`.
- `active` defaults to `false`, which draws the inactive window shadow; set it on the window that has focus.
- `SideNav` owns no router: set each item's `href` and `active` from the current route. `bind:collapsed` controls
  the icon rail; `floating` overlays the page instead of taking space (a floating SideNav outside an `AppWindow`
  needs a positioned parent). `SideNavItem` is a link; use `as="button"` for actions.
- `TitleBarLeftControls globalNav` expands and collapses the SideNav of its window. The window buttons of
  `TitleBarRightControls` (`onMinimize`, `onWindowToggle`, `onClose`, `maximized`) only report the press: the host
  (Tauri, Electron) minimizes, maximizes and closes the window.

## Choosing a component

| Need                                                   | Use                                                                          |
| ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Pick one or several values from a fixed list           | `Dropdown` + `DropdownOption` (`bind:value`, `multiple` makes it `string[]`) |
| Free text with suggestions, search box                 | `AutoSuggestBox` + `AutoSuggestBoxOption` (pass `index` to every option)     |
| Several values shown as removable tags, or new entries | `TagPicker` + `TagPickerOption` (`bind:selectedOptions`)                     |
| A few exclusive options always visible                 | `RadioButton` with `bind:group`                                              |
| Date / time                                            | `CalendarDatePicker`, `DatePicker`, `TimePicker`, inline `CalendarView`      |
| Selectable list of items                               | `ListView` + `ListViewItem value` (`bind:selectedItems`, `selectionMode`)    |
| Hierarchy                                              | `TreeView` + `TreeViewItem` (`bind:openItems`, `bind:checkedItems`)          |
| Tabular data                                           | `Table` primitives: sorting and selection are yours to wire                  |
| Document tabs                                          | `TabView` (`bind:activeTab`; you render the panels)                          |
| Section navigation                                     | `TopNav` (`bind:selectedValue`), `Breadcrumb`                                |
| Status message                                         | `InfoBar`                                                                    |
| App frame with title bar and side navigation           | `AppWindow` + `TitleBar` + `SideNav` + `AppSurface`                          |
| Icon-only commands in a menu (cut, copy, paste)        | `MenuCommandBar` + `MenuCommandBarItem` inside a `MenuList`                  |

`DropdownSelect` styles the native `<select>` with `appearance: base-select`. That needs Chrome or Edge 135+ or
Safari 27+, and Chrome or Edge 145+ with `multiple`; other browsers, Firefox included, show the native select
without rich option content. Use `Dropdown` when the select must look the same in every browser.

## SSR (SvelteKit)

Components render on the server. A few need data the server cannot read from the markup:

- `DropdownOption`: pass `text`, or the button shows the raw value until hydration.
- `TagPicker`: tags show the raw values on the server unless a custom `tag` snippet renders the text.
- `CalendarView`: pass `today` (built from year, month and day) so server and browser agree on the date;
  `CalendarDatePicker` needs the visitor's `timeZone` in `format`.
- Menu popovers are not in the server HTML; arrow-key navigation starts after hydration.
- Never read `document` or `window` in markup or at the top of `<script>`.

## Pitfalls that throw

- `AutoSuggestBox`: `selectOnFocus` with `multiselect`.
- `TagPicker`: `single` with more than one entry in `selectedOptions`.
- `Slider`: `min` not lower than `max`, or `step` larger than `max - min`.
- `Rating`: `max` not a whole number greater than 1.
- `Card`: `selected` or `showFloatingAction` without `selectable`; `as="a"` with `selectable`; an `action` inside a
  selectable card.
- An `as` value outside the component's list; a sub-component outside its parent; `bind:` to `undefined`.

Other mistakes that do not throw:

- `AutoSuggestBox` submits its form on Enter unless `querySubmitted` calls `preventDefault()`.
- An interactive `Tag` inside a `TagPicker`; `media` and `icon` together on a `Tag`.
- A `Table` without `TableHeader`, or with its parts' roles overridden.
- `Tooltip` with the default `relationship="label"` on a control that already has a name.

## Components

Folder, exports, status (only when the API may still change) and summary. Read
`node_modules/fluentui-svelte/dist/components/<folder>/docs/llms.md` before using one.

<!-- components:start -->

- `app-surface`: `AppSurface`. The area of an app that holds its content: a layer over the window or its Mica, with rounded corners next to a SideNav, in the colors of an active or an inactive window.
- `app-window`: `AppWindow`. The surface of an app: a Mica window built on the Flyout, with its own border and the shell shadow of an active or an inactive window, sized by a width and a height.
- `auto-suggest-box`: `AutoSuggestBox`, `AutoSuggestBoxOption`. An input field that shows dynamic suggestions as the user types, improving form and search efficiency.
- `avatar`: `Avatar`. A graphical representation of a user, team, or entity, showing an image, icon, or initials with optional presence status.
- `badge`: `Badge`, `BadgeIcon`. A visual decoration for UI elements that displays notifications, status indicators, or counts with configurable colors, shapes, and styles.
- `breadcrumb`: `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbButton`, `BreadcrumbDivider`. A navigation landmark that shows where a page sits in the hierarchy above it, in three sizes and with room for an overflow menu.
- `button`: `Button`, `SplitButton`. A button triggers an action or event when activated, with accent, standard, and subtle appearances.
- `calendar-date-picker`: `CalendarDatePicker`. A button trigger paired with a CalendarView popup for selecting a single date.
- `calendar-view`: `CalendarView`, `CalendarViewHeader`, `CalendarViewControls`, `CalendarViewDays`, `CalendarViewMonths`, `CalendarViewYears`, `CalendarViewItem`. An inline calendar for browsing days, months, and years and selecting dates or a range.
- `card`: `Card`, `CardHeader`, `CardFooter`, `CardPreview`. A card is a container that displays content and actions on a single topic.
- `checkbox`: `Checkbox`. A control a user can check or clear, and that can also report an indeterminate (mixed) state.
- `color-picker`: `ColorPicker`. A Fluent color picker with square and circular spectra, RGB and HSV fields, and optional opacity.
- `date-picker`: `DatePicker`. An input for selecting a date from carousel-style day, month, and year columns.
- `dialog`: `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`, `DialogSurface`, `DialogTrigger`. A window overlaid on the page that requires user attention, composed of trigger, surface, title, content, and actions.
- `divider`: `Divider`. A horizontal or vertical rule that visually separates content within a layout, with an optional label.
- `dropdown`: `Dropdown`, `DropdownOption`. A custom dropdown that lets users select one or more options from a list, with rich option content.
- `dropdown-select`: `DropdownSelect`, `DropdownSelectOption`. A native-select-based dropdown for choosing one or more options, with support for rich option content.
- `expander`: `Expander`. A control that displays a header and a collapsible content area that can expand up or down.
- `flyout`: `Flyout`. A floating panel that displays additional information or options in a non-intrusive, accessible way.
- `hyperlink`: `Hyperlink`. A clickable link that navigates to a specified URL, following Fluent UI design principles with built-in accessibility.
- `info-bar`: `InfoBar`. An inline, non-intrusive status message with built-in severity levels and an optional close button.
- `label`: `Label`. An accessible caption for a form control, with configurable size, weight, position, and required state.
- `list-view`: `ListView`, `ListViewItem`, `ListViewItemBranch`. A vertically stacked set of items that can be focused, selected, and navigated with the keyboard.
- `menu`: `Menu`, `MenuItem`, `MenuDivider`, `MenuGroup`, `MenuTrigger`, `MenuPopover`, `MenuList`, `MenuItemCheckbox`, `MenuItemRadio`, `MenuItemSwitch`, `MenuCommandBar`, `MenuCommandBarItem`, `ContextMenuTrigger`. A dropdown list of actions or options, with support for groups, submenus, checkable items, and context menus.
- `number-box`: `NumberBox`. A numeric input with min, max, and step constraints and optional spinner buttons.
- `persona`: `Persona`. A visual representation of a person combining an avatar, presence, and up to three lines of text.
- `progress-bar`: `ProgressBar`. A horizontal progress indicator that shows determinate or indeterminate progress, with paused and error states.
- `progress-ring`: `ProgressRing`. A circular progress indicator that shows determinate or indeterminate progress, with paused and error states.
- `radio-button`: `RadioButton`. A control for choosing a single option from a set of mutually exclusive choices.
- `rating`: `Rating`. A control that lets users give a value to an item by selecting one of a row of stars.
- `side-nav`: `SideNav`, `SideNavItem`, `SideNavBranch`. Collapsible app navigation with an icon rail, floating overlay, nested links, custom content and a pinned footer.
- `skeleton`: `Skeleton`. A placeholder that indicates where content will appear while it is loading.
- `slider`: `Slider`. A control that lets users select a value from a continuous or discrete range by dragging a thumb along a track.
- `tab-view`: `TabView`, `TabViewTab`. A strip of document tabs, with icons, close buttons and a new tab button, that owns the selection and leaves the content to you.
- `table`: `Table`, `TableHeader`, `TableHeaderCell`, `TableBody`, `TableRow`, `TableCell`, `TableSelectionCell`, `TableCellLayout`, `TableCellActions`. A low level set of primitives to display two dimensional data, with support for sorting, selection and custom cell layouts.
- `tag`: `Tag`, `TagGroup`. A visual representation of an attribute, person or asset that can be dismissed, selected and grouped, with an interactive variant that carries a primary action.
- `tag-picker`: `TagPicker`, `TagPickerOption`, `TagPickerOptionGroup`. A text field and a dropdown that let people choose several options from a list, or enter their own, each choice shown as a dismissible tag.
- `text-box`: `TextBox`, `TextBoxButton`. A single-line (or configurable) text input for capturing plain text, with search, password, and number types.
- `textarea`: `TextArea`. A multiline text input that lets the user enter and edit longer, free-form text.
- `time-picker`: `TimePicker`. An input for selecting a time from carousel-style hour, minute, and second columns, in 12- or 24-hour format.
- `title-bar`: `TitleBar`, `TitleBarLeftControls`, `TitleBarRightControls`. The top bar of an app shell, laid out like a Windows 11 title bar: navigation and app identity at the start, a flexible search at the center, and the person picture and window controls at the end.
- `toggle-switch`: `ToggleSwitch`. A switch that lets someone choose between two mutually exclusive options with an immediate result.
- `tooltip`: `Tooltip`. A small popup that displays additional information about an element when the user hovers over it.
- `top-nav`: `TopNav`, `TopNavItem`. A row of navigation items with a bar that travels to whichever one is selected, in four appearances and three sizes.
- `tree-view`: `TreeView`, `TreeViewItem`, `TreeViewItemContent`. A hierarchical, nested list where each item can be expanded, checked, or selected.

<!-- components:end -->
