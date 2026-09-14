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

| Name              | Type                                            | Default   | Description                                       |
| ----------------- | ----------------------------------------------- | --------- | ------------------------------------------------- |
| `type`            | `'modal'` &#124; `'non-modal'` &#124; `'alert'` | `'modal'` | How the dialog behaves once open.                 |
| `open` _bindable_ | `boolean`                                       |           | Controls the open state of the dialog.            |
| `onOpenChange`    | `(open: boolean) => void`                       |           | Called whenever the dialog opens or closes.       |
| `children`        | `Snippet`                                       |           | The parts of the dialog: a trigger and a surface. |

<!-- /props:DialogProps -->

## DialogTrigger Props

<!-- DO NOT EDIT THIS SECTION (propsmith generated) -->
<!-- props:DialogTriggerProps -->

| Name                    | Type                | Default | Description                               |
| ----------------------- | ------------------- | ------- | ----------------------------------------- |
| `ref`                   | `HTMLButtonElement` |         | The DOM reference of the trigger element. |
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
| `ref`                      | `HTMLDivElement` |         | The DOM reference of the content element. |
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
