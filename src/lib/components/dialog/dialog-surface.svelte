<script lang="ts">
	import { onClickOutside } from 'runed';
	import type { DialogSurfaceProps } from './types.ts';
	import { getDialogContext } from './dialog.svelte.ts';
	import { Button } from '$lib/index.js';
	import DismissFilled from 'fluentui-icons-svelte/DismissFilled.svelte';

	let { ref = $bindable(), children, ...attributes }: DialogSurfaceProps = $props();

	const CONTEXT = getDialogContext();

	if (!CONTEXT) {
		throw new Error('DialogSurface must be used within a Dialog component');
	}

	const { config, methods, state: _state } = CONTEXT;

	const { closeDialog } = methods;

	const { type } = config;

	if (type !== 'alert') {
		onClickOutside(
			() => ref,
			() => closeDialog()
		);
	}

	$effect(() => {
		if (!ref) return;
		_state.dialogRef = ref;
	});
</script>

<dialog open={_state.open} class="fs-dialog" bind:this={ref} {...attributes}>
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
