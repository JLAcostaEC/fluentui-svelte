# fluentui-svelte

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
