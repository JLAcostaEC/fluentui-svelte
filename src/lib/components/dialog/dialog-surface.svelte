<script lang="ts">
	import { onClickOutside } from 'runed';
	import { on } from 'svelte/events';
	import type { DialogSurfaceProps } from './types.ts';
	import { getDialogContext } from './dialog.svelte.ts';
	import { Button } from '$lib/index.js';
	import DismissFilled from 'fluentui-icons-svelte/DismissFilled.svelte';

	let { ref = $bindable(), class: classes, oncancel, children, ...attributes }: DialogSurfaceProps = $props();

	const CONTEXT = getDialogContext();

	if (!CONTEXT) {
		throw new Error('DialogSurface must be used within a Dialog component');
	}

	const { config, methods, state: _state } = CONTEXT;

	const { closeDialog } = methods;

	// runed reports an outside press 10ms after the pointer goes down. By then the press that opens the
	// dialog has already opened it, and a press while it is closed has nothing to dismiss, so remember
	// whether the dialog was open at the moment the pointer went down.
	let openOnPointerDown = false;

	$effect(() => {
		const doc = ref?.ownerDocument;
		if (!doc) return;
		return on(doc, 'pointerdown', () => (openOnPointerDown = !!ref?.open), { capture: true });
	});

	// Registered unconditionally and guarded from inside, so switching `type` after mount is honored.
	onClickOutside(
		() => ref,
		() => {
			if (config.type === 'alert' || !openOnPointerDown) return;
			closeDialog();
		}
	);

	// Escape cancels a modal dialog natively. An alert has to be answered with one of its actions, and any
	// other modal closes through `closeDialog` so `onOpenChange` hears about it. A consumer's `oncancel`
	// can still veto it with `preventDefault`.
	function handleCancel(e: Event & { currentTarget: EventTarget & HTMLDialogElement }) {
		oncancel?.(e);
		if (e.defaultPrevented) return;
		e.preventDefault();
		if (config.type !== 'alert') closeDialog();
	}

	$effect(() => {
		if (!ref) return;
		_state.dialogRef = ref;
	});
</script>

<dialog
	open={_state.open}
	class={['fs-dialog', classes]}
	aria-labelledby={_state.titleId}
	bind:this={ref}
	oncancel={handleCancel}
	{...attributes}
>
	<div class="dialog-wrapper">
		{#if config.type === 'non-modal'}
			<Button class="close-icon" appearance="subtle" onclick={() => methods.closeDialog()} aria-label="Close dialog">
				<DismissFilled />
			</Button>
		{/if}
		{@render children?.()}
	</div>
</dialog>

<style>
	.fs-dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		padding: 0;
		transform: translate(-50%, -50%);
		border: unset;
		z-index: 1100;
		width: 35vw;
		min-width: 20rem;
		overflow: visible;
		background: var(--fs-solid-background-base);
		border-radius: var(--fs-control-overlay-border-radius);
		&::backdrop {
			background-color: var(--fs-smoke-background-default);
			backdrop-filter: blur(0.25rem);
		}
		& .dialog-wrapper {
			position: relative;
			box-shadow: var(--fs-shadow-dialog);
			border-radius: var(--fs-control-overlay-border-radius);
			border: 1px solid var(--fs-control-surface-stroke-flyout);
			display: grid;
			grid-template-rows: auto 1fr;
			width: 100%;
			max-height: 95vh;
			overflow: hidden;
			background: var(--fs-layer-alt);
			&::before {
				content: '';
				position: absolute;
				background: var(--fs-acrilic-noise);
				background-size: 2.5rem;
				filter: grayscale(1);
				opacity: 0.065;
				border-radius: calc(var(--fs-control-overlay-border-radius) - 0.063rem);
				pointer-events: none;
				inset: 0;
				z-index: 0;
			}
			& :global(.close-icon) {
				position: absolute;
				padding: 0.5rem;
				top: 0.5rem;
				right: 0.5rem;
			}
		}
	}
</style>
