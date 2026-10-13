<script lang="ts">
	import { setDialogContext } from './dialog.svelte.ts';
	import type { DialogContext, DialogProps } from './types.ts';

	let {
		type = 'modal',
		position = 'middle-center',
		animation = 'zoom',
		duration = 'normal',
		open = $bindable(),
		onOpenChange,
		children
	}: DialogProps = $props();

	let dialogRef: HTMLDialogElement | undefined = $state();

	let titleId: string | undefined = $state();

	const context: DialogContext = $state({
		config: {
			get type() {
				return type;
			},
			get position() {
				return position;
			},
			get animation() {
				return animation;
			},
			get duration() {
				return duration;
			}
		},
		state: {
			get open() {
				return open;
			},
			get dialogRef() {
				return dialogRef;
			},
			set dialogRef(v) {
				dialogRef = v;
			},
			get titleId() {
				return titleId;
			},
			set titleId(v) {
				titleId = v;
			}
		},
		events: null,
		methods: {
			openDialog: () => {
				if (type !== 'non-modal') dialogRef?.showModal();
				open = true;
				onOpenChange?.(true);
			},
			closeDialog: () => {
				if (type !== 'non-modal') dialogRef?.close();
				open = false;
				onOpenChange?.(false);
			}
		}
	});

	setDialogContext(context);

	export function openDialog() {
		context.methods.openDialog();
	}

	export function closeDialog() {
		context.methods.closeDialog();
	}
</script>

{@render children?.()}
