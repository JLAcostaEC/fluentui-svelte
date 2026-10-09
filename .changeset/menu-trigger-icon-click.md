---
'fluentui-svelte': patch
---

fix: open the `Menu` when the icon inside its trigger is clicked

A trigger button that holds an icon and no text, such as one with the `subtle` appearance, ignored the click when it landed on the icon instead of on the button.
