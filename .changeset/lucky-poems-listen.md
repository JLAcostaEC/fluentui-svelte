---
'fluentui-svelte': patch
---

refactor: give RenderSoC an inferable prop type

`RenderSoC` now takes a single `args` object, handed to a snippet as its only argument and spread onto a component as its props. This replaces the previous two channels: an `args` tuple plus loose rest props. `SoC` no longer accepts `undefined`.
