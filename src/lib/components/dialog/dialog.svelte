<script lang="ts">
	import { defineProperty, defineState } from '$internal';
	import { setDialogContext } from './dialog.svelte.ts';
	import type { DialogContext, DialogProps } from './types.ts';

	let { type = 'modal', open = $bindable(), onOpenChange, children }: DialogProps = $props();

	let dialogRef: HTMLDialogElement | undefined = $state();

	const config: DialogContext['config'] = $derived({
		type
	});

	const _state: DialogContext['state'] = defineState([
		(o) => defineProperty(o, 'open', () => open),
		(o) =>
			defineProperty(
				o,
				'dialogRef',
				() => dialogRef,
				(v) => (dialogRef = v)
			)
	]);

	const methods: DialogContext['methods'] = $derived({
		openDialog: () => {
			if (type !== 'non-modal') {
				dialogRef?.showModal();
			} else {
				open = true;
			}
			onOpenChange?.(true);
		},
		closeDialog: () => {
			if (type !== 'non-modal') {
				dialogRef?.close();
			} else {
				open = false;
			}
			onOpenChange?.(false);
		}
	});

	export function openDialog() {
		methods.openDialog();
	}

	export function closeDialog() {
		methods.closeDialog();
	}

	// svelte-ignore state_referenced_locally
	setDialogContext({ config, state: _state, events: null, methods });
</script>

{@render children?.()}
