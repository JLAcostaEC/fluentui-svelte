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
		triggerText = 'Open Dialog',
		triggerProps = {},
		surfaceProps = {},
		titleProps = {},
		contentProps = {},
		actionsProps = {},
		onRefs
	}: {
		type?: 'modal' | 'non-modal' | 'alert';
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		titleAs?: DialogTitleTag;
		actionsPosition?: 'start' | 'center' | 'end';
		fluid?: boolean;
		triggerText?: string;
		triggerProps?: Record<string, unknown>;
		surfaceProps?: Record<string, unknown>;
		titleProps?: Record<string, unknown>;
		contentProps?: Record<string, unknown>;
		actionsProps?: Record<string, unknown>;
		onRefs?: (refs: Record<'trigger' | 'surface' | 'title' | 'content' | 'actions', Element | undefined>) => void;
	} = $props();

	let triggerRef: HTMLButtonElement | undefined = $state();
	let surfaceRef: HTMLDialogElement | undefined = $state();
	let titleRef: HTMLDivElement | HTMLHeadingElement | undefined = $state();
	let contentRef: HTMLDivElement | undefined = $state();
	let actionsRef: HTMLDivElement | undefined = $state();

	$effect(() => {
		onRefs?.({
			trigger: triggerRef,
			surface: surfaceRef,
			title: titleRef,
			content: contentRef,
			actions: actionsRef
		});
	});
</script>

<Dialog {type} {onOpenChange} bind:open>
	<DialogTrigger bind:ref={triggerRef} {...triggerProps}>{triggerText}</DialogTrigger>
	<DialogSurface bind:ref={surfaceRef} {...surfaceProps}>
		<DialogTitle as={titleAs} bind:ref={titleRef} {...titleProps}>Dialog Title</DialogTitle>
		<DialogContent bind:ref={contentRef} {...contentProps}>Dialog body content</DialogContent>
		<DialogActions position={actionsPosition} {fluid} bind:ref={actionsRef} {...actionsProps}>
			<button>Confirm</button>
			<button>Cancel and go back</button>
		</DialogActions>
	</DialogSurface>
</Dialog>
