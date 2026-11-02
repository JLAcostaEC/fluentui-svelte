---
'fluentui-svelte': patch
---

fix: SSR components (#99)

- Dropdown: the button shows the text of the selected options before the list ever opens. The list stays in the page while closed, ahead of the button, so its options report their labels before the button is written. Pass `text` to each option when rendering on the server: the server cannot read the rendered children.
- TagPicker: the tags show the text of their options on the server, not their values. Its list stays in the page while closed too.
- Flyout: a `hidden` flyout stays in the page without being placed, and is placed once shown. It also follows a `reference` that arrives after it mounts.
- TimePicker: the trigger shows `value`, not the current time of the server, and a popup rendered open selects `value`. So does DatePicker.
- CalendarView: the new `today` prop sets the date treated as today, which the view highlights and opens on when there is no `value`. CalendarDatePicker passes it on. Cells carry their date as `yyyy-mm-dd` in `data-date`, so server and browser agree across time zones.
- CalendarDatePicker: the docs of `format` ask for a `timeZone` when rendering on the server.
- Menu: the popover style is valid CSS, so its `min-width` follows the trigger.
- TreeView: a branch whose items start partly checked shows as mixed, and the first item holds the tab stop before Tabspot runs. ListView keeps a single tab stop in composite navigation from the server on.
- Checkbox: `indeterminate` is bound, and marked with `data-indeterminate`, so the server HTML draws the mixed state.
- DropdownSelect: the placeholder is not selected alongside the values of a multiple select.
- Label: the docs say that a native `<label for>` names a picker only once the page hydrates.
