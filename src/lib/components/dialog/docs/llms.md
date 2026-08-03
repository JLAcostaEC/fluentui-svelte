# Dialog

Is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert. That is, users cannot interact with content outside an active dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so it is difficult to discern, and in some implementations, attempts to interact with the inert content cause the dialog to close.

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
	import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogContent, DialogActions, Button } from 'fluentui-svelte';
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

| Name | Type | Description |
| --- | --- | --- |
| `type` | `'modal' \| 'non-modal' \| 'alert'` | The behavior type of the dialog. Default: `modal`. |
| `open` | bindable `boolean` | Whether the dialog is open. |
| `onOpenChange` | `(open: boolean) => void` | Callback fired when the dialog opens or closes. |
| `children` | `Snippet` | The dialog sub-components to render. |

## DialogTrigger Props

| Name | Type | Description |
| --- | --- | --- |
| `ref` | `HTMLButtonElement` | The DOM reference of the trigger button. |
| `children` | `Snippet` | The content of the trigger button. |
| ...ButtonProps | `ButtonProps<'button'>` | Inherits all `Button` props. |

## DialogSurface Props

| Name | Type | Description |
| --- | --- | --- |
| `ref` | bindable `HTMLDialogElement` | The DOM reference of the dialog element. |
| `children` | `Snippet` | The content to render inside the dialog surface. |
| ...Attributes | `HTMLAttributes<HTMLDialogElement>` | All native `<dialog>` attributes are forwarded. |

## DialogTitle Props

| Name | Type | Description |
| --- | --- | --- |
| `as` | `'div' \| 'h1'`–`'h6'` | The element to render the title as. Default: `h3`. |
| `ref` | bindable element | The DOM reference of the title element. |
| `children` | `Snippet` | The title content. |
| ...Attributes | Polymorphic | All HTML attributes of the chosen `as` element are forwarded. |

## DialogContent Props

| Name | Type | Description |
| --- | --- | --- |
| `ref` | `HTMLDivElement` | The DOM reference of the content element. |
| `children` | `Snippet` | The content to render inside the dialog body. |
| ...Attributes | `HTMLAttributes<HTMLDivElement>` | All native `<div>` attributes are forwarded. |

## DialogActions Props

| Name | Type | Description |
| --- | --- | --- |
| `ref` | bindable `HTMLDivElement` | The DOM reference of the actions element. |
| `position` | `'start' \| 'center' \| 'end'` | Horizontal alignment of the actions. Default: `end`. |
| `fluid` | `boolean` | Whether the actions container uses a full-width layout. |
| `children` | `Snippet` | The action elements to render, typically buttons. |
| ...Attributes | `HTMLAttributes<HTMLDivElement>` | All native `<div>` attributes are forwarded. |
