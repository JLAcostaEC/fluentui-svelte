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

	const duration = $derived(
		typeof config.duration === 'number'
			? `${Number.isFinite(config.duration) ? Math.max(0, config.duration) : 0}ms`
			: `var(${config.duration.startsWith('--') ? config.duration : `--fs-${config.duration}-duration`}, 333ms)`
	);

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
	{...attributes}
	open={_state.open}
	class={['fs-dialog', `position-${config.position}`, `animation-${config.animation}`, classes]}
	style:--fs-dialog-duration={duration}
	aria-labelledby={_state.titleId ?? attributes['aria-labelledby']}
	bind:this={ref}
	oncancel={handleCancel}
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
		--fs-dialog-effective-duration: var(--fs-dialog-duration);
		--fs-dialog-enter-easing: var(--fs-fast-dismiss, cubic-bezier(0, 0, 0, 1));
		--fs-dialog-exit-easing: var(--fs-soft-dismiss, cubic-bezier(1, 0, 1, 1));
		--fs-dialog-hidden-transform: none;
		opacity: 0;
		transform: var(--fs-dialog-hidden-transform);
		transition:
			opacity var(--fs-dialog-effective-duration) var(--fs-dialog-exit-easing),
			transform var(--fs-dialog-effective-duration) var(--fs-dialog-exit-easing),
			display var(--fs-dialog-effective-duration) allow-discrete,
			overlay var(--fs-dialog-effective-duration) allow-discrete;
		&[open] {
			opacity: 1;
			transform: none;
			transition-timing-function: var(--fs-dialog-enter-easing);
		}
		&.animation-zoom {
			--fs-dialog-hidden-transform: scale(0.9);
			--fs-dialog-enter-transform: scale(0.88);
		}
		&.animation-slide {
			--fs-dialog-hidden-transform: translateY(16px);
			&.position-top-start,
			&.position-top-center,
			&.position-top-end {
				--fs-dialog-hidden-transform: translateY(-16px);
			}
		}
		&.animation-bounce {
			--fs-dialog-hidden-transform: scale(0.96);
			--fs-dialog-enter-easing: var(--fs-strong-invoke, cubic-bezier(0.13, 1.62, 0, 0.92));
			/* Reverse of Fluent's strong-invoke curve: a small anticipation before dismissal. */
			--fs-dialog-exit-easing: cubic-bezier(1, 0.08, 0.87, -0.62);
		}
		@starting-style {
			&[open] {
				opacity: 0;
				transform: var(--fs-dialog-enter-transform, var(--fs-dialog-hidden-transform));
			}
		}
		position: fixed;
		inset: 1rem;
		margin: auto;
		padding: 0;
		box-sizing: border-box;
		border: unset;
		z-index: 1100;
		width: 35vw;
		min-width: min(20rem, calc(100vw - 2rem));
		max-width: calc(100vw - 2rem);
		height: fit-content;
		max-height: calc(100dvh - 2rem);
		overflow: visible;
		background: var(--fs-solid-background-base);
		border-radius: var(--fs-control-overlay-border-radius);
		&.position-top-start,
		&.position-top-center,
		&.position-top-end {
			margin-block-start: 0;
		}
		&.position-bottom-start,
		&.position-bottom-center,
		&.position-bottom-end {
			margin-block-end: 0;
		}
		&.position-top-start,
		&.position-middle-start,
		&.position-bottom-start {
			margin-inline-start: 0;
		}
		&.position-top-end,
		&.position-middle-end,
		&.position-bottom-end {
			margin-inline-end: 0;
		}
		&::backdrop {
			opacity: 0;
			background-color: var(--fs-smoke-background-default);
			backdrop-filter: blur(0.25rem);
			transition:
				opacity var(--fs-dialog-effective-duration) var(--fs-soft-dismiss, cubic-bezier(1, 0, 1, 1)),
				display var(--fs-dialog-effective-duration) allow-discrete,
				overlay var(--fs-dialog-effective-duration) allow-discrete;
		}
		&[open]::backdrop {
			opacity: 1;
			transition-timing-function: var(--fs-fast-dismiss, cubic-bezier(0, 0, 0, 1));
		}
		& .dialog-wrapper {
			position: relative;
			box-shadow: var(--fs-shadow-dialog);
			border-radius: var(--fs-control-overlay-border-radius);
			border: 1px solid var(--fs-control-surface-stroke-flyout);
			display: grid;
			grid-template-rows: auto 1fr;
			width: 100%;
			max-height: calc(100dvh - 2rem);
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
	/* Pseudo-elements need a separate starting-style rule rather than nested &. */
	@starting-style {
		.fs-dialog[open]::backdrop {
			opacity: 0;
		}
	}
	:global(:root[data-fs-reduced-motion='true']) .fs-dialog {
		--fs-dialog-effective-duration: 0ms;
	}
	@media (prefers-reduced-motion: reduce) {
		:global(:root:not([data-fs-reduced-motion='false'])) .fs-dialog {
			--fs-dialog-effective-duration: 0ms;
		}
	}
</style>
