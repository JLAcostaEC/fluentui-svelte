# fluentui-svelte

## 0.7.0

### Minor Changes

- feat: Add Dialog's `position` and `animation` props ([#102](https://github.com/JLAcostaEC/fluentui-svelte/pull/102))

- refactor: standardize component attributes, refs and labels, and preserve internal attributes and handlers ([#109](https://github.com/JLAcostaEC/fluentui-svelte/pull/109))

  BREAKING CHANGES

  - All components: consumer attributes no longer override internal attributes; custom classes, styles and callbacks are preserved.
  - TextBox: `class` on the wrapper → `class` on the input; use `wrapperAttributes.class` for the wrapper. Native keyboard callbacks now run on their corresponding events.
  - NumberBox: `class` on the TextBox wrapper → `class` on the number input; `wrapperRef` now binds to the wrapper.
  - TextArea: `ref` is typed as `HTMLTextAreaElement`; wrapper classes now merge with the internal class.
  - DropdownSelect: `wrapperProps` → `wrapperAttributes`; wrapper and select classes preserve the internal classes.
  - Checkbox: polymorphic `wrapperAs`, `WrapperRef` and `CheckboxProps<T>` → a fixed div root and `CheckboxProps`; children render in a separate associated label.
  - RadioButton: `labelAttributes` → `wrapperAttributes`; the root is a div, the text is a separate associated label, and `wrapperRef` is available.
  - ToggleSwitch: `labelAttributes` → `wrapperAttributes`, `labelElement` → bindable `wrapperRef`; the root is a div with a separate associated label.
  - Dropdown: `wrapperProps` → `wrapperAttributes`, root `ref` → `wrapperRef`, `buttonRef` → `ref`, `buttonProps` → direct button attributes; unused `inputRef` is removed. `id` now identifies the trigger instead of the hidden input, replacing the old `${id}-button` trigger id.
  - TagPicker: root `ref` → `wrapperRef`, `inputRef` → `ref`, `inputProps` → direct input attributes, including `class`; use `wrapperAttributes` for root attributes.
  - AutoSuggestBox: root `ref` → `wrapperRef`, `inputRef` → `ref`; remove unused `textBoxProps` and `textBoxRef` in favor of direct input attributes and `ref`. Use `wrapperAttributes` for root attributes.
  - DatePicker: `inputProps` → `inputAttributes`; trigger and wrapper classes merge with their internal classes, and `onclick` also runs the internal toggle.
  - TimePicker: `element` → `ref`, `inputElement` → `inputRef`, `inputProps` → `inputAttributes`; trigger and wrapper classes merge with internal classes, and `onclick` also runs the internal toggle.
  - CalendarDatePicker: root attributes and `ref` → `wrapperAttributes` and `wrapperRef`; `triggerRef` → `ref`; direct attributes, including `id` and `class`, now reach the trigger button.
  - Slider: internal role and value attributes take precedence over spread attributes; consumer handlers compose with internal handlers, and consumer styles are retained.
  - Rating: the root role is fixed to `radiogroup`; consumer `onpointerleave` composes with the internal preview reset.
  - Label: the root label → a div or span selected with `as`; children and the text label are siblings. Associate the field with explicit `for`/`id`. `class`, `ref`, size and weight apply to the text label; use `wrapperAttributes` and `wrapperRef` for the root.
  - Breadcrumb and TabView: `listProps` → `listAttributes`; TabView also renames `newTabButtonProps` → `newTabButtonAttributes`.
  - Expander: `summaryProps` → `summaryAttributes`.
  - Tag: `primaryProps` → `primaryButtonAttributes`, `dismissProps` → `dismissButtonAttributes`.
  - Persona: `avatar` → `avatarProps`; TableSelectionCell: `checkboxIndicator` → `checkboxProps`, `radioIndicator` → `radioProps`.
  - MenuItem: button refs use `HTMLButtonElement`.

  Other changes

  - Add `wrapperAttributes` and `wrapperRef` to TagPickerOptionGroup.
  - Fix DropdownSelect selection and Dropdown activation through its associated Label.
  - Update attribute documentation and translations, including DropdownSelect browser compatibility notices.

- feat: add accessible ListView disclosure branches and fix composite keyboard navigation ([#64](https://github.com/JLAcostaEC/fluentui-svelte/pull/64))

### Patch Changes

- fix: open the `Menu` when the icon inside its trigger is clicked ([`ec38232`](https://github.com/JLAcostaEC/fluentui-svelte/commit/ec382328402aacd677432e1f60265b700a20a042))

  A trigger button that holds an icon and no text, such as one with the `subtle` appearance, ignored the click when it landed on the icon instead of on the button.

- fix: overlay stacking and tooltip floating positioning ([#100](https://github.com/JLAcostaEC/fluentui-svelte/pull/100))

- fix: change tooltip padding from 1 to 0.5rem ([#106](https://github.com/JLAcostaEC/fluentui-svelte/pull/106))

- fix: preserve the outline of fractional Rating stars ([#65](https://github.com/JLAcostaEC/fluentui-svelte/pull/65))

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
