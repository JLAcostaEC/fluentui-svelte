<script lang="ts">
	import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogContent, DialogActions } from '$lib/index.js';
	import type { DialogTitleTag } from '$lib/components/dialog/types.js';

	let {
		type = 'modal',
		open = $bindable(),
		onOpenChange,
		titleAs = 'h3',
		actionsPosition = 'end',
		fluid = false,
		triggerText = 'Open Dialog'
	}: {
		type?: 'modal' | 'non-modal' | 'alert';
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		titleAs?: DialogTitleTag;
		actionsPosition?: 'start' | 'center' | 'end';
		fluid?: boolean;
		triggerText?: string;
	} = $props();
</script>

<Dialog {type} {onOpenChange} bind:open>
	<DialogTrigger>{triggerText}</DialogTrigger>
	<DialogSurface>
		<DialogTitle as={titleAs}>Dialog Title</DialogTitle>
		<DialogContent>Dialog body content</DialogContent>
		<DialogActions position={actionsPosition} {fluid}>
			<button>Confirm</button>
		</DialogActions>
	</DialogSurface>
</Dialog>
