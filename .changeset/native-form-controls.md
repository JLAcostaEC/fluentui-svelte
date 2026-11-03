---
'fluentui-svelte': minor
---

feat: make `form controls` components native form fields, allowing to submit, validate and reset with their wrapper form element

BREAKING CHANGES

Dropdown, TagPicker, DatePicker, TimePicker, CalendarDatePicker, Slider and Rating hold their value in a native field. Their direct props go to that field.

- AutoSuggestBox: Enter with no suggestion under the cursor submits the form with the typed text, unless `querySubmitted` prevents it.
- Checkbox, RadioButton and ToggleSwitch: inside a Label, their own text is not rendered; the Label names them.

Other changes

- Shows validation message and announces when form control is invalid, also carry `aria-required` and `aria-invalid`.
- Controls fire `input` and `change` on their native field when people change the value, and draw an invalid state from `:user-invalid` or `aria-invalid`.
- A disabled `fieldset` disables form controls too.
