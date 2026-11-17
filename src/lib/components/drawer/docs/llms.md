# Drawer

> Part of fluentui-svelte. Read the global guide first (setup, rules and pitfalls): https://fluentui-svelte.dev/docs/llms.md, also shipped as node_modules/fluentui-svelte/skills/fluentui-svelte/SKILL.md

A Drawer is a panel that slides in from an edge of the viewport, with navigation, settings or a form that adds to the page. It overlays the page as a native `<dialog>`, or sits inline in the layout and pushes the content aside.

```svelte
<script>
	import { Button, Drawer, DrawerHeader, DrawerBody, DrawerFooter } from 'fluentui-svelte';
	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Edit profile</Button>
<Drawer bind:open position="end" size="medium" floating>
	<DrawerHeader title="Edit profile" />
	<DrawerBody>…</DrawerBody>
	<DrawerFooter>
		<Button appearance="accent" onclick={() => (open = false)}>Save</Button>
		<Button onclick={() => (open = false)}>Cancel</Button>
	</DrawerFooter>
</Drawer>
```

- `bind:open` opens and closes it; `onOpenChange` reports a close from within (the close button, Escape, a click on the backdrop).
- `type`: `'modal'` (default), `'non-modal'` (the page stays interactive), `'alert'` (no Escape and no click outside) or `'inline'` (in the layout; put it in a flex container next to the content).
- `position`: `'start'` (default), `'end'`, `'top'` or `'bottom'`; start and end follow the text direction.
- `size` (bindable): `'small'` (320px, default), `'medium'` (592px), `'large'` (940px), `'full'` or any CSS length (`'30rem'`, `'50%'`). It is the height at the top and the bottom.
- `floating` detaches it from the edge, with rounded corners and a shadow.
- `hideBackdrop` removes the dimmed backdrop of a modal drawer; a click outside still closes it.
- `resizable` adds a handle on the inner edge (pointer or arrow keys); `bind:size` reads the result in pixels. Localize `resizeLabel`.
- `onBeforeClose(reason)` runs before a close from within (`'escape'`, `'backdrop'`, `'close-button'`, `'parent'`); return `false` to keep it open.
- Nest a Drawer inside another for sublevels: Escape closes the top level only, and a drawer that closes closes its nested ones.
- `DrawerHeader` takes a `title` (it names the drawer), an `action` before the close button, `hideCloseButton` and `closeLabel`. `DrawerBody` scrolls on its own; `DrawerFooter` holds the actions.

## Props

### Drawer

<!-- props:DrawerProps -->

| Name                                             | Type                                                              | Default    | Description                                                                                                                            |
| ------------------------------------------------ | ----------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                 | `HTMLDialogElement` &#124; `HTMLDivElement`                       |            | The DOM reference of the drawer element.                                                                                               |
| `id`                                             | `string`                                                          |            | The id of the drawer element. Falls back to a generated one.                                                                           |
| `open` _bindable_                                | `boolean`                                                         | `false`    | Controls the open state of the drawer.                                                                                                 |
| `onOpenChange`                                   | `(open: boolean) => void`                                         |            | Called whenever the drawer opens or closes from within.                                                                                |
| `type`                                           | `'modal'` &#124; `'non-modal'` &#124; `'alert'` &#124; `'inline'` | `'modal'`  | How the drawer behaves once open.                                                                                                      |
| `position`                                       | `'start'` &#124; `'end'` &#124; `'top'` &#124; `'bottom'`         | `'start'`  | The edge the drawer opens from. Start and end follow the text direction.                                                               |
| `size` _bindable_                                | `DrawerSize` &#124; `string`                                      | `'small'`  | The width of the drawer, or its height at the top or the bottom: a preset (320px, 592px, 940px, the whole viewport) or any CSS length. |
| `floating`                                       | `boolean`                                                         |            | Detaches the drawer from the edge of the viewport, with rounded corners and a shadow.                                                  |
| `hideBackdrop`                                   | `boolean`                                                         |            | Removes the dimmed backdrop behind a modal drawer. A click outside still closes it.                                                    |
| `resizable`                                      | `boolean`                                                         |            | Adds a handle on the inner edge that resizes the drawer with the pointer or the arrow keys.                                            |
| `resizeLabel`                                    | `string`                                                          | `'Resize'` | The accessible name of the resize handle.                                                                                              |
| `onBeforeClose`                                  | `(reason: DrawerCloseReason) => boolean` &#124; `void`            |            | Called before the drawer closes from within. Return `false` to keep it open.                                                           |
| `children`                                       | `Snippet`                                                         |            | The parts of the drawer: a header, a body and a footer.                                                                                |
| `HTMLAttributes<HTMLElement>` without `children` |                                                                   |            |                                                                                                                                        |

<!-- /props:DrawerProps -->

### DrawerHeader

<!-- props:DrawerHeaderProps -->

| Name                                                      | Type                                                       | Default   | Description                                                                                    |
| --------------------------------------------------------- | ---------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `ref` _bindable_                                          | `HTMLElement` &#124; `null`                                |           | The DOM reference of the header element.                                                       |
| `title`                                                   | `Snippet` &#124; `Component` &#124; `string`               |           | The title of the drawer. A snippet or a component receives the id the drawer is labelled by.   |
| `headingLevel`                                            | `1` &#124; `2` &#124; `3` &#124; `4` &#124; `5` &#124; `6` | `2`       | The level of the heading that holds a string title, to fit the headings of the page around it. |
| `action`                                                  | `Snippet` &#124; `Component`                               |           | Extra actions rendered before the close button.                                                |
| `hideCloseButton`                                         | `boolean`                                                  |           | Removes the button that closes the drawer.                                                     |
| `closeLabel`                                              | `string`                                                   | `'Close'` | The accessible name of the close button.                                                       |
| `HTMLAttributes<HTMLElement>` without `children`, `title` |                                                            |           |                                                                                                |

<!-- /props:DrawerHeaderProps -->

### DrawerBody

<!-- props:DrawerBodyProps -->

| Name                       | Type                           | Default | Description                            |
| -------------------------- | ------------------------------ | ------- | -------------------------------------- |
| `ref` _bindable_           | `HTMLDivElement` &#124; `null` |         | The DOM reference of the body element. |
| Element Attributes (`div`) |                                |         |                                        |

<!-- /props:DrawerBodyProps -->

### DrawerFooter

<!-- props:DrawerFooterProps -->

| Name               | Type                        | Default | Description                              |
| ------------------ | --------------------------- | ------- | ---------------------------------------- |
| `ref` _bindable_   | `HTMLElement` &#124; `null` |         | The DOM reference of the footer element. |
| Element Attributes |                             |         |                                          |

<!-- /props:DrawerFooterProps -->
