# ScrollBar

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A ScrollBar lets users scroll content that overflows its container. At rest it shows a thin thumb over the content; on hover it expands into a track with arrows. Powered by OverlayScrollbars.

```svelte
<script>
	import { ScrollBar } from 'fluentui-svelte';
</script>

<ScrollBar style="height: 12rem;" viewportAttributes={{ 'aria-label': 'Messages' }}>
	<!-- Long content -->
</ScrollBar>
```

- Give it a bounded size (`height`, `max-height`, `width`).
- `overflow`: `auto`, `x`, `y` or `both`.
- `autoHide`: `move`, `scroll`, `leave` or `never`.
- `expanded` keeps the track, thumb and arrows visible.
- `collapseDelay` waits before collapsing after the pointer leaves.
- `scrollRef` adds the scroll bars to an existing element instead of rendering one. Pass `null` while `bind:this` resolves; leave it `undefined` to render the component's own element.

```svelte
<script>
	import { ScrollBar } from 'fluentui-svelte';
	let target = $state(null);
</script>

<ul bind:this={target} style="height: 12rem;"><li>…</li></ul>
<ScrollBar scrollRef={target} viewportAttributes={{ 'aria-label': 'Items' }} />
```

## Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:ScrollBarProps -->

| Name                     | Type                                                                                                                      | Default  | Description                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------- |
| `as`                     | `'div'` &#124; `'section'` &#124; `'article'` &#124; `'aside'` &#124; `'main'` &#124; `'nav'` &#124; `'ul'` &#124; `'ol'` | `'div'`  | The element to render.                                                  |
| `ref` _bindable_         | `HTMLElement`                                                                                                             |          | The root element.                                                       |
| `scrollRef`              | `HTMLElement` &#124; `null`                                                                                               |          | An existing element to add the scroll bars to instead of rendering one. |
| `viewportRef` _bindable_ | `HTMLElement` &#124; `null`                                                                                               |          | The element that scrolls.                                               |
| `viewportAttributes`     | `HTMLAttributes<HTMLDivElement>`                                                                                          |          | Attributes for the element that scrolls.                                |
| `expanded`               | `boolean`                                                                                                                 |          | Keeps the scroll bar expanded.                                          |
| `collapseDelay`          | `number`                                                                                                                  | `2000`   | Milliseconds to wait before collapsing after the pointer leaves.        |
| `instance` _bindable_    | `OverlayScrollbars` &#124; `null`                                                                                         |          | The OverlayScrollbars instance.                                         |
| `overflow`               | `'auto'` &#124; `'x'` &#124; `'y'` &#124; `'both'`                                                                        | `'auto'` | The axes that can scroll.                                               |
| `autoHide`               | `'never'` &#124; `'scroll'` &#124; `'leave'` &#124; `'move'`                                                              | `'move'` | When the scroll bar hides.                                              |
| `autoHideDelay`          | `number`                                                                                                                  | `1000`   | Milliseconds to wait before hiding.                                     |
| `hideArrows`             | `boolean`                                                                                                                 |          | Hides the arrow buttons.                                                |
| `showFocusOutline`       | `boolean`                                                                                                                 |          | Shows the focus outline of the scrolling area.                          |
| `hideTrack`              | `boolean`                                                                                                                 |          | Hides the track.                                                        |
| `arrowStep`              | `number`                                                                                                                  | `48`     | Pixels scrolled per arrow press.                                        |
| `options`                | `PartialOptions`                                                                                                          |          | Extra OverlayScrollbars options.                                        |
| `events`                 | `EventListeners`                                                                                                          |          | OverlayScrollbars events.                                               |
| `defer`                  | `boolean` &#124; `IdleRequestOptions`                                                                                     |          | Initializes when the browser is idle.                                   |
| HTML Attributes          |                                                                                                                           |          |                                                                         |

<!-- /props:ScrollBarProps -->
