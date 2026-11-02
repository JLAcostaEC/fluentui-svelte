---
'fluentui-svelte': patch
---

fix: accessibility issues found with axe-core across the components

- DatePicker and TimePicker: each list of the popup is named after its column, and its options have ids of their own, `aria-activedescendant` no longer lands in another column. New `columnLabels` prop names the columns.
- Dropdown: the cursor starts on the selected option, or on the first one, when the list opens.
- TreeView: `aria-multiselectable` is set on the tree only, not on its groups.
- ListView: the checkbox of a selectable option is inert, since the option reports the selection.
- TabView: the close button of a tab is for the pointer and hidden from assistive technology, since a tab cannot hold a control. `Delete` closes the tab, and the tab announces it with `aria-keyshortcuts`.
- TagPicker: the group of tags is named `'Selected options'` unless `tagGroupProps` names it.
- CardHeader and InfoBar: the new `headingLevel` prop sets the level of the heading that holds the title.
- SplitButton: mention `aria-label` as good practice on `menuTriggerProps`.
- MenuGroup: the header is plain text that names the group instead of an `<h3>`. A group without `header` no longer shows its internal id.
