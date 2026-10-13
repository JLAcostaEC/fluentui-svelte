<script lang="ts">
	import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogContent, DialogActions } from '$lib/index.js';
	import type {
		DialogAnimation,
		DialogDuration,
		DialogPosition,
		DialogTitleTag
	} from '$lib/components/dialog/types.js';

	let {
		type = 'modal',
		position,
		animation,
		duration = 0,
		open = $bindable(),
		onOpenChange,
		titleAs = 'h3',
		actionsPosition = 'end',
		fluid = false,
		triggerText = 'Open Dialog',
		contentText = 'Dialog body content',
		triggerProps = {},
		surfaceProps = {},
		titleProps = {},
		contentProps = {},
		actionsProps = {},
		onRefs
	}: {
		type?: 'modal' | 'non-modal' | 'alert';
		position?: DialogPosition;
		animation?: DialogAnimation;
		duration?: DialogDuration;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		titleAs?: DialogTitleTag;
		actionsPosition?: 'start' | 'center' | 'end';
		fluid?: boolean;
		triggerText?: string;
		contentText?: string;
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
	let dialog: { openDialog: () => void; closeDialog: () => void } | undefined = $state();

	export function openDialog() {
		dialog?.openDialog();
	}

	export function closeDialog() {
		dialog?.closeDialog();
	}

	export function setOpen(next: boolean) {
		open = next;
	}

	export function setPosition(next: DialogPosition) {
		position = next;
	}

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

<Dialog {type} {position} {animation} {duration} {onOpenChange} bind:open bind:this={dialog}>
	<DialogTrigger bind:ref={triggerRef} {...triggerProps}>{triggerText}</DialogTrigger>
	<DialogSurface bind:ref={surfaceRef} {...surfaceProps}>
		<DialogTitle as={titleAs} bind:ref={titleRef} {...titleProps}>Dialog Title</DialogTitle>
		<DialogContent bind:ref={contentRef} {...contentProps}>{contentText}</DialogContent>
		<DialogActions position={actionsPosition} {fluid} bind:ref={actionsRef} {...actionsProps}>
			<button>Confirm</button>
			<button>Cancel and go back</button>
		</DialogActions>
	</DialogSurface>
</Dialog>
