---
'fluentui-svelte': patch
---

fix: `TreeView` checkbox selection, alignment, events and more examples docs

Clicking the checkbox of a `TreeViewItem` now checks it once instead of checking and unchecking it in the same click. Checkboxes and icons now line up between branches and leaves, `aside` and `actions` are pinned to the end of the row, and `actions` are revealed on hover and focus. `onCheckedChange` and `onOpenChange` are now called on both `TreeView` and `TreeViewItem`.

Adds more examples to the documentation.
