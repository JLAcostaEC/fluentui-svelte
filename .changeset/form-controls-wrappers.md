---
'fluentui-svelte': minor
---

refactor: standardize component attributes, refs and labels, and preserve internal attributes and handlers

BREAKING CHANGES

- All components: consumer attributes no longer override internal attributes.
- Direct props now go to the input element (for form controls only) and there are dedicated object props for the wrapper and other internal elements.
- Multiple TS types has changed to align with the new standard for wrapper attributes and internal element handling.
- Many object props for internal elements have been renamed to end with `Attributes` or `Props` ej `checkboxIndicator` → `checkboxProps`.

Other changes

- Fix DropdownSelect selection and Dropdown activation through its associated Label.
- Update attribute documentation and translations, including DropdownSelect browser compatibility notices.
