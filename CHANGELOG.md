# fluentui-svelte

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
