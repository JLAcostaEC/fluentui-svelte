# Dialog

A dialog is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert. That is, users cannot interact with content outside an active dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so it is difficult to discern, and in some implementations, attempts to interact with the inert content cause the dialog to close.

The Dialog is composed of several components that work together through a shared context:

- `Dialog`: The root component that creates the state and provides context to its children.
- `DialogTrigger`: A button that opens the dialog when clicked.
- `DialogSurface`: The `<dialog>` element that hosts the dialog content.
- `DialogTitle`: The heading of the dialog. Renders as an `h3` by default.
- `DialogContent`: The scrollable body of the dialog.
- `DialogActions`: The footer that holds action buttons.

## Usage

```svelte
<script>
	import {
		Dialog,
		DialogTrigger,
		DialogSurface,
		DialogTitle,
		DialogContent,
		DialogActions,
		Button
	} from 'fluentui-svelte';

	let dialog = $state();
</script>

<Dialog bind:this={dialog}>
	<DialogTrigger>Open Dialog</DialogTrigger>
	<DialogSurface>
		<DialogTitle>Dialog Title</DialogTitle>
		<DialogContent>
			<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
		</DialogContent>
		<DialogActions fluid>
			<Button>Save</Button>
			<Button appearance="standard" onclick={() => dialog.closeDialog()}>Close</Button>
		</DialogActions>
	</DialogSurface>
</Dialog>
```

## Examples

### Position

Set `position` on `Dialog` to combine `top`, `middle`, or `bottom` with `start`, `center`, or `end`, for example `top-end` or `bottom-start`. The default is `middle-center`.

Start and end follow the text direction, so `top-start` sits on the right in RTL. All positions keep a 1rem gap from viewport edges and work with modal, non-modal, and alert dialogs. Changing `position` moves an open dialog without closing it.

```svelte
<Dialog position="top-end">
	<DialogTrigger>Open Dialog</DialogTrigger>
	<DialogSurface>
		<DialogTitle>Dialog Title</DialogTitle>
		<DialogContent>Dialog body content.</DialogContent>
	</DialogSurface>
</Dialog>
```

### Entrance and Exit Motion

`animation` selects `fade`, `zoom`, `slide`, or `bounce` for both directions. The default is `zoom`. Zoom enters from 88% scale and exits to 90%; slide travels 16px, from above for top positions and below otherwise. Bounce uses a small scale overshoot with Fluent's strong-invoke curve.

`duration` defaults to `normal`. Theme names are `fast`, `normal`, `slow`, `slower`, `very-slow`, and `extra-slow`, matching `--fs-<name>-duration`. A CSS custom property name such as `--fs-fast-duration` is also accepted. Numbers are milliseconds; `0` disables motion.

```svelte
<Dialog animation="slide" duration={200} position="bottom-end">
	<DialogTrigger>Open Dialog</DialogTrigger>
	<DialogSurface>
		<DialogTitle>Dialog Title</DialogTitle>
		<DialogContent>Dialog body content.</DialogContent>
	</DialogSurface>
</Dialog>
```

Motion is implemented with CSS `@starting-style` and discrete `display`/`overlay` transitions. Calling `closeDialog()` updates `open` and releases native modal focus immediately; CSS keeps the surface and backdrop painted until the exit ends. Browsers without these CSS features open and close immediately. The OS reduced-motion preference and FluentUISvelte's app preference disable motion, including numeric durations; an explicit app preference takes priority over the OS.

### With Actions

Add a `DialogActions` region to render action buttons in the dialog footer. Use `bind:this` on the `Dialog` to call `closeDialog()` programmatically.

```svelte
<script>
	import {
		Dialog,
		DialogTrigger,
		DialogSurface,
		DialogTitle,
		DialogContent,
		DialogActions,
		Button
	} from 'fluentui-svelte';
	let dialog = $state();
</script>

<Dialog bind:this={dialog}>
	<DialogTrigger>Actions Dialog</DialogTrigger>
	<DialogSurface>
		<DialogTitle>Dialog Title</DialogTitle>
		<DialogContent>
			<p>Dialog body content.</p>
		</DialogContent>
		<DialogActions fluid>
			<Button style="flex: 1 1 auto;">Save</Button>
			<Button style="flex: 1 1 auto;" appearance="standard" onclick={() => dialog.closeDialog()}>Close</Button>
		</DialogActions>
	</DialogSurface>
</Dialog>
```

## Dialog Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DialogProps -->

| Name              | Type                                                                       | Default           | Description                                                                                          |
| ----------------- | -------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| `type`            | `'modal'` &#124; `'non-modal'` &#124; `'alert'`                            | `'modal'`         | How the dialog behaves once open.                                                                    |
| `position`        | [`DialogPosition`](https://fluentui-svelte.dev/docs/types/#dialogposition) | `'middle-center'` | Where the dialog sits in the viewport. Start and end follow the text direction.                      |
| `animation`       | `'fade'` &#124; `'zoom'` &#124; `'slide'` &#124; `'bounce'`                | `'zoom'`          | The entrance and exit animation. Bounce uses a subtle overshoot.                                     |
| `duration`        | [`DialogDuration`](https://fluentui-svelte.dev/docs/types/#dialogduration) | `'normal'`        | Duration in milliseconds, a theme duration name, or a CSS custom property name. Use 0 for no motion. |
| `open` _bindable_ | `boolean`                                                                  |                   | Controls the open state of the dialog.                                                               |
| `onOpenChange`    | `(open: boolean) => void`                                                  |                   | Called whenever the dialog opens or closes.                                                          |
| `children`        | `Snippet`                                                                  |                   | The parts of the dialog: a trigger and a surface.                                                    |

<!-- /props:DialogProps -->

## DialogTrigger Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DialogTriggerProps -->

| Name                    | Type                | Default | Description                               |
| ----------------------- | ------------------- | ------- | ----------------------------------------- |
| `ref` _bindable_        | `HTMLButtonElement` |         | The DOM reference of the trigger element. |
| `ButtonProps<'button'>` |                     |         |                                           |

<!-- /props:DialogTriggerProps -->

## DialogSurface Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DialogSurfaceProps -->

| Name                          | Type                | Default | Description                              |
| ----------------------------- | ------------------- | ------- | ---------------------------------------- |
| `ref` _bindable_              | `HTMLDialogElement` |         | The DOM reference of the dialog element. |
| Element Attributes (`dialog`) |                     |         |                                          |

<!-- /props:DialogSurfaceProps -->

## DialogTitle Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DialogTitleProps -->

| Name             | Type                                         | Default | Description                              |
| ---------------- | -------------------------------------------- | ------- | ---------------------------------------- |
| `ref` _bindable_ | `HTMLDivElement` &#124; `HTMLHeadingElement` |         | The DOM reference of the title element.  |
| `as`             | `DialogTitleTag`                             | `'h3'`  | The HTML element to render the title as. |
| HTML Attributes  |                                              |         |                                          |

<!-- /props:DialogTitleProps -->

## DialogContent Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DialogContentProps -->

| Name                       | Type             | Default | Description                               |
| -------------------------- | ---------------- | ------- | ----------------------------------------- |
| `ref` _bindable_           | `HTMLDivElement` |         | The DOM reference of the content element. |
| Element Attributes (`div`) |                  |         |                                           |

<!-- /props:DialogContentProps -->

## DialogActions Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DialogActionsProps -->

| Name                       | Type                                       | Default | Description                                                 |
| -------------------------- | ------------------------------------------ | ------- | ----------------------------------------------------------- |
| `ref` _bindable_           | `HTMLDivElement`                           |         | The DOM reference of the actions element.                   |
| `fluid`                    | `boolean`                                  |         | Stretches every action to share the available width evenly. |
| `position`                 | `'start'` &#124; `'center'` &#124; `'end'` | `'end'` | Where the actions sit along the main axis.                  |
| Element Attributes (`div`) |                                            |         |                                                             |

<!-- /props:DialogActionsProps -->
