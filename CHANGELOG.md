# fluentui-svelte

## 0.7.0

### Minor Changes

- feat: Add the `AppWindow`, `AppSurface`, `TitleBar` and `SideNav`components ([#59](https://github.com/JLAcostaEC/fluentui-svelte/pull/59))

  Add per-AppWindow context for shared host and construction state, direct SideNav/AppSurface layout, and inherited surface and title-bar state.
  New Subcomponents like `SideNavBranch`, `SideNavItem`, `TitleBarLeftControls`, `TitleBarRightControls` are introduced to facilitate complex layouts within the AppWindow context.

- feat: change every bindable prop that had no default to `null` or `false`, so a changing spread no longer resets it ([#111](https://github.com/JLAcostaEC/fluentui-svelte/pull/111))

- feat: Add Dialog's `position` and `animation` props ([#102](https://github.com/JLAcostaEC/fluentui-svelte/pull/102))

- refactor: standardize component attributes, refs and labels, and preserve internal attributes and handlers ([#109](https://github.com/JLAcostaEC/fluentui-svelte/pull/109))

  BREAKING CHANGES

  - All components: consumer attributes no longer override internal attributes.
  - Direct props now go to the input element (for form controls only) and there are dedicated object props for the wrapper and other internal elements.
  - Multiple TS types has changed to align with the new standard for wrapper attributes and internal element handling.
  - Many object props for internal elements have been renamed to end with `Attributes` or `Props` ej `checkboxIndicator` → `checkboxProps`.

  Other changes

  - Fix DropdownSelect selection and Dropdown activation through its associated Label.
  - Update attribute documentation and translations, including DropdownSelect browser compatibility notices.

- feat: add a tooltip to `Label`, shown from a badge after the label text ([#111](https://github.com/JLAcostaEC/fluentui-svelte/pull/111))

- feat: add accessible ListView disclosure branches and fix composite keyboard navigation ([#64](https://github.com/JLAcostaEC/fluentui-svelte/pull/64))

- feat: add `MenuCommandBar` and `MenuCommandBarItem` ([#123](https://github.com/JLAcostaEC/fluentui-svelte/pull/123))

  Also fix the arrow keys move through the items of a `Menu` and update `MenuPopover` to use the correct overlay border radius

- feat: make `form controls` components native form fields, allowing to submit, validate and reset with their wrapper form element ([#111](https://github.com/JLAcostaEC/fluentui-svelte/pull/111))

  BREAKING CHANGES

  Dropdown, TagPicker, DatePicker, TimePicker, CalendarDatePicker, Slider and Rating hold their value in a native field. Their direct props go to that field.

  - AutoSuggestBox: Enter with no suggestion under the cursor submits the form with the typed text, unless `querySubmitted` prevents it.
  - Checkbox, RadioButton and ToggleSwitch: inside a Label, their own text is not rendered; the Label names them.

  Other changes

  - Shows validation message and announces when form control is invalid, also carry `aria-required` and `aria-invalid`.
  - Controls fire `input` and `change` on their native field when people change the value, and draw an invalid state from `:user-invalid` or `aria-invalid`.
  - A disabled `fieldset` disables form controls too.

### Patch Changes

- fix: accessibility issues found with axe-core across the components ([#111](https://github.com/JLAcostaEC/fluentui-svelte/pull/111))

  - DatePicker and TimePicker: each list of the popup is named after its column, and its options have ids of their own, `aria-activedescendant` no longer lands in another column. New `columnLabels` prop names the columns.
  - Dropdown: the cursor starts on the selected option, or on the first one, when the list opens.
  - TreeView: `aria-multiselectable` is set on the tree only, not on its groups.
  - ListView: the checkbox of a selectable option is inert, since the option reports the selection.
  - TabView: the close button of a tab is for the pointer and hidden from assistive technology, since a tab cannot hold a control. `Delete` closes the tab, and the tab announces it with `aria-keyshortcuts`.
  - TagPicker: the group of tags is named `'Selected options'` unless `tagGroupProps` names it.
  - CardHeader and InfoBar: the new `headingLevel` prop sets the level of the heading that holds the title.
  - SplitButton: mention `aria-label` as good practice on `menuTriggerProps`.
  - MenuGroup: the header is plain text that names the group instead of an `<h3>`. A group without `header` no longer shows its internal id.

- fix: prevent inverted `Slider` when `vertical=true` ([#117](https://github.com/JLAcostaEC/fluentui-svelte/pull/117))

- fix: open the `Menu` when the icon inside its trigger is clicked ([`ec38232`](https://github.com/JLAcostaEC/fluentui-svelte/commit/ec382328402aacd677432e1f60265b700a20a042))

  A trigger button that holds an icon and no text, such as one with the `subtle` appearance, ignored the click when it landed on the icon instead of on the button.

- fix: the flyout of the compact `NumberBox` no longer drifts away from the box. ([#120](https://github.com/JLAcostaEC/fluentui-svelte/pull/120))

- fix: overlay stacking and tooltip floating positioning ([#100](https://github.com/JLAcostaEC/fluentui-svelte/pull/100))

- fix: change tooltip padding from 1 to 0.5rem ([#106](https://github.com/JLAcostaEC/fluentui-svelte/pull/106))

- fix: preserve the outline of fractional Rating stars ([#65](https://github.com/JLAcostaEC/fluentui-svelte/pull/65))

- fix: `Slider` no longer loops forever when the pointer moves over a rail without length ([#119](https://github.com/JLAcostaEC/fluentui-svelte/pull/119))

- fix: SSR components ([#99](https://github.com/JLAcostaEC/fluentui-svelte/issues/99)) ([#116](https://github.com/JLAcostaEC/fluentui-svelte/pull/116))

  - Dropdown: the button shows the text of the selected options before the list ever opens. The list stays in the page while closed, ahead of the button, so its options report their labels before the button is written. Pass `text` to each option when rendering on the server: the server cannot read the rendered children.
  - TagPicker: the tags show the text of their options on the server, not their values. Its list stays in the page while closed too.
  - Flyout: a `hidden` flyout stays in the page without being placed, and is placed once shown. It also follows a `reference` that arrives after it mounts.
  - TimePicker: the trigger shows `value`, not the current time of the server, and a popup rendered open selects `value`. So does DatePicker.
  - CalendarView: the new `today` prop sets the date treated as today, which the view highlights and opens on when there is no `value`. CalendarDatePicker passes it on. An empty multiple selection opens on `today` instead of throwing. Cells carry their date as `yyyy-mm-dd` in `data-date`, so server and browser agree across time zones.
  - CalendarDatePicker: the docs of `format` ask for the `timeZone` of the visitor when rendering on the server.
  - Menu: the popover style is valid CSS, so its `min-width` follows the trigger, and its position follows the `strategy` of `positionConfig`, `fixed` by default.
  - TreeView: a branch whose items start partly checked shows as mixed, without dropping the checked ids of items that are not in the tree yet, and the first item holds the tab stop before Tabspot runs. ListView keeps a single tab stop in composite navigation from the server on.
  - Checkbox: `indeterminate` is bound, and marked with `data-indeterminate`, so the server HTML draws the mixed state, icon included.
  - DropdownSelect: the placeholder is not selected alongside the values of a multiple select.
  - Label: the docs say that a native `<label for>` names a picker only once the page hydrates, and that a field with an id of its own needs it in `for` when the text comes first.

- fix: announce the tags of `TagPicker` as buttons, and point `aria-controls` of `Dropdown` only to a rendered listbox ([#111](https://github.com/JLAcostaEC/fluentui-svelte/pull/111))

- fix: update the horizontal padding of `TextBox` to follow the Fluent specification ([#105](https://github.com/JLAcostaEC/fluentui-svelte/pull/105))

## 0.6.0

### Minor Changes

- feat: Add the `Rating` component ([#51](https://github.com/JLAcostaEC/fluentui-svelte/pull/51))

  A row of stars that lets users give a value to an item. It supports half-filled stars with `step={0.5}`, four sizes, a custom `max`, and keyboard navigation through native radio inputs. Fractional values are drawn in quarter stars until the user rates.

- feat: Add the `Tag`, `TagGroup` and `TagPicker` components ([#52](https://github.com/JLAcostaEC/fluentui-svelte/pull/52))

### Patch Changes

- fix: complete the `Dialog` API, events handling, and docs. ([#57](https://github.com/JLAcostaEC/fluentui-svelte/pull/57))

- fix: stop shipping the docs-only example data (more than 4,000 lines) in the published package ([#56](https://github.com/JLAcostaEC/fluentui-svelte/pull/56))

## 0.5.0

### Minor Changes

- feat: Add a `keepMounted` prop to `MenuPopover` for preserving its content in the DOM while closed. ([#45](https://github.com/JLAcostaEC/fluentui-svelte/pull/45))

### Patch Changes

- fix: correctly assign ids to cards (internal RenderSoC component) ([#50](https://github.com/JLAcostaEC/fluentui-svelte/pull/50))

- fix: `Dropdown` Ctrl/Cmd + click is no longer required when `multiple` is set. Just clicking an item toggles its selection directly. ([#43](https://github.com/JLAcostaEC/fluentui-svelte/pull/43))

- fix: `ListViewItem` & `ListView` checkmark behavior and more examples docs ([#48](https://github.com/JLAcostaEC/fluentui-svelte/pull/48))

  `ListViewItem` checkmark no longer triggers `onAction` when clicked, and now toggles the selection of its item, including on `role="row"` items.

  Adds more examples to the documentation.

- fix: `TreeView` checkbox selection, alignment, events and more examples docs ([#49](https://github.com/JLAcostaEC/fluentui-svelte/pull/49))

  Clicking the checkbox of a `TreeViewItem` now checks it once instead of checking and unchecking it in the same click. Checkboxes and icons now line up between branches and leaves, `aside` and `actions` are pinned to the end of the row, and `actions` are revealed on hover and focus. `onCheckedChange` and `onOpenChange` are now called on both `TreeView` and `TreeViewItem`.

  Adds more examples to the documentation.

## 0.4.0

### Minor Changes

- feat: add the Breadcrumb component. ([#34](https://github.com/JLAcostaEC/fluentui-svelte/pull/34))

- feat: add the TabView component. ([#35](https://github.com/JLAcostaEC/fluentui-svelte/pull/35))

- feat: add the TopNav component. ([#35](https://github.com/JLAcostaEC/fluentui-svelte/pull/35))

### Patch Changes

- fix: correct the `--fs-system-attention-bg` token name. ([#37](https://github.com/JLAcostaEC/fluentui-svelte/pull/37))

## 0.3.0

### Minor Changes

- feat: add table component ([#31](https://github.com/JLAcostaEC/fluentui-svelte/pull/31))

## 0.2.1

### Patch Changes

- fix: make component contexts and constraints fully reactive ([#26](https://github.com/JLAcostaEC/fluentui-svelte/pull/26))

- docs: generate every `llms.md` props table with propsmith ([#29](https://github.com/JLAcostaEC/fluentui-svelte/pull/29))

## 0.2.0

### Minor Changes

- feat: let the AutoSuggestBox list open on focus ([#24](https://github.com/JLAcostaEC/fluentui-svelte/pull/24))

  Adds `openOnFocus` to `AutoSuggestBox`. With it set, the suggestion list opens as soon as the text
  box takes focus instead of waiting for the first keystroke.

### Patch Changes

- fix: app freezes when animating clip-path ([#21](https://github.com/JLAcostaEC/fluentui-svelte/pull/21))

  This change fixes the issue where the app would freeze when animating `clip-path`, introduced in chromium versions 150-151, see more here https://issues.chromium.org/issues/545348583

- refactor: give RenderSoC an inferable prop type ([#20](https://github.com/JLAcostaEC/fluentui-svelte/pull/20))

  `RenderSoC` now takes a single `args` object, handed to a snippet as its only argument and spread onto a component as its props. This replaces the previous two channels: an `args` tuple plus loose rest props. `SoC` no longer accepts `undefined`.

## 0.1.2

### Patch Changes

- fix: remove unnecesary styles declarations for flyout ([#15](https://github.com/JLAcostaEC/fluentui-svelte/pull/15))

- fix: add z-index 2 when flyout is floating ([#13](https://github.com/JLAcostaEC/fluentui-svelte/pull/13))

- fix: close menu when menu item radio is clicked ([#12](https://github.com/JLAcostaEC/fluentui-svelte/pull/12))

## 0.1.1

### Patch Changes

- Initial Release ([`628e5ea`](https://github.com/JLAcostaEC/fluentui-svelte/commit/628e5ea5b97b5c22182b5388f776cb6686d12b25))
