---
'fluentui-svelte': minor
---

refactor: align form controls around control attributes and refs, separate their labels, and preserve internal handlers

BREAKING CHANGES

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
- DatePicker: trigger and wrapper classes now merge with their internal classes; a consumer `onclick` also runs the internal toggle.
- TimePicker: `element` → `ref`; trigger and wrapper classes merge with internal classes, and `onclick` also runs the internal toggle.
- CalendarDatePicker: root attributes and `ref` → `wrapperAttributes` and `wrapperRef`; `triggerRef` → `ref`; direct attributes, including `id` and `class`, now reach the trigger button.
- Slider: internal role and value attributes take precedence over spread attributes; consumer handlers compose with internal handlers, and consumer styles are retained.
- Rating: the root role is fixed to `radiogroup`; consumer `onpointerleave` composes with the internal preview reset.
- Label: the root label → a div or span selected with `as`; children and the text label are siblings. Associate the field with explicit `for`/`id`. `class`, `ref`, size and weight apply to the text label; use `wrapperAttributes` and `wrapperRef` for the root.
