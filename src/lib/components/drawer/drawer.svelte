<script lang="ts">
	import { on } from 'svelte/events';
	import { PREFIX } from '#constants';
	import { getDrawerContext, setDrawerContext } from './drawer-context.svelte.ts';
	import type { DrawerCloseReason, DrawerContext, DrawerProps, DrawerSize } from './types.ts';

	const _ID = $props.id();
	const FALLBACK_ID = `${PREFIX}-drawer-${_ID}`;
	const PRESETS: DrawerSize[] = ['small', 'medium', 'large', 'full'];
	const MIN_SIZE = 200;
	const KEY_STEP = 16;

	let {
		ref = $bindable(null),
		id = FALLBACK_ID,
		open = $bindable(false),
		onOpenChange,
		type = 'modal',
		position = 'start',
		size = $bindable('small'),
		floating = false,
		hideBackdrop = false,
		resizable = false,
		resizeLabel = 'Resize',
		onBeforeClose,
		class: classes,
		children,
		...attributes
	}: DrawerProps = $props();

	const parent = getDrawerContext();
	const level = parent ? parent.config.level + 1 : 0;

	// A known id names the drawer during SSR too, where the header cannot register its own.
	let labelledBy = $derived(attributes['aria-labelledby'] ?? (attributes['aria-label'] ? undefined : `${id}-title`));

	const preset = $derived(PRESETS.includes(size as DrawerSize));
	const horizontal = $derived(position === 'start' || position === 'end');

	const close = (reason: DrawerCloseReason) => {
		if (!open || onBeforeClose?.(reason) === false) return;
		open = false;
		onOpenChange?.(false);
	};

	setDrawerContext({
		config: {
			get id() {
				return id;
			},
			level
		},
		state: {
			get open() {
				return open;
			}
		},
		events: null,
		methods: { close }
	} satisfies DrawerContext);

	// A nested drawer closes with the drawer it lives in.
	$effect(() => {
		if (parent && !parent.state.open && open) close('parent');
	});

	// The overlay is a native dialog: `showModal` brings the backdrop, the focus trap and the focus restore.
	$effect(() => {
		if (!(ref instanceof HTMLDialogElement)) return;

		if (open && !ref.open) {
			if (type === 'non-modal') ref.show();
			else ref.showModal();
		} else if (!open && ref.open) ref.close();
	});

	// The inline drawer has no dialog to restore the focus: it goes back to the control that opened it.
	$effect.pre(() => {
		if (type !== 'inline' || !open) return;

		const opener = document.activeElement;

		return () => {
			if (ref?.contains(document.activeElement) && opener instanceof HTMLElement && opener.isConnected) opener.focus();
		};
	});

	// A press on the backdrop closes a modal drawer, unless it started inside (a text selection, a drag).
	let pressedOutside = false;

	const outside = (e: MouseEvent) => {
		const rect = ref!.getBoundingClientRect();
		return e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
	};

	const onpointerdown = (e: PointerEvent) => {
		pressedOutside = e.target === ref && outside(e);
	};

	const onclick = (e: MouseEvent) => {
		if (type === 'modal' && pressedOutside && e.target === ref && outside(e)) close('backdrop');
		pressedOutside = false;
	};

	// Escape cancels a modal natively, on the topmost one only; an alert stays until one of its actions answers it.
	const oncancel = (e: Event) => {
		e.preventDefault();
		if (type !== 'alert') close('escape');
	};

	// A non-modal dialog does not cancel on Escape by itself; the handled key stops at the innermost drawer.
	const onkeydown = (e: KeyboardEvent) => {
		if (type !== 'non-modal' || e.key !== 'Escape' || e.defaultPrevented) return;
		e.preventDefault();
		close('escape');
	};

	// A `<form method="dialog">` or a script can close the dialog without the drawer.
	const onclose = () => {
		if (!open) return;
		open = false;
		onOpenChange?.(false);
	};

	/* Resize: the handle sits on the inner edge; growing points away from the edge the drawer opens from. */
	let resizing = $state(false);

	const grows = (dx: number, dy: number) => {
		if (!horizontal) return position === 'top' ? dy : -dy;
		const rtl = getComputedStyle(ref!).direction === 'rtl';
		return (position === 'start') !== rtl ? dx : -dx;
	};

	const resizeTo = (value: number) => {
		const max = horizontal ? window.innerWidth : window.innerHeight;
		size = `${Math.round(Math.max(MIN_SIZE, Math.min(max, value)))}px`;
	};

	const current = () => {
		const rect = ref!.getBoundingClientRect();
		return horizontal ? rect.width : rect.height;
	};

	const onHandleDown = (e: PointerEvent) => {
		if (e.button !== 0) return;
		e.preventDefault();
		const handle = e.currentTarget as HTMLElement;
		handle.setPointerCapture(e.pointerId);
		resizing = true;

		const start = current();
		const [x, y] = [e.clientX, e.clientY];
		const offMove = on(handle, 'pointermove', (ev) => resizeTo(start + grows(ev.clientX - x, ev.clientY - y)));
		const offEnd = on(handle, 'lostpointercapture', () => {
			resizing = false;
			offMove();
			offEnd();
		});
	};

	const onHandleKeydown = (e: KeyboardEvent) => {
		const deltas: Record<string, [number, number]> = horizontal
			? { ArrowLeft: [-KEY_STEP, 0], ArrowRight: [KEY_STEP, 0] }
			: { ArrowUp: [0, -KEY_STEP], ArrowDown: [0, KEY_STEP] };
		if (!(e.key in deltas)) return;
		e.preventDefault();
		resizeTo(current() + grows(...deltas[e.key]));
	};
</script>

<!--
	@component
	A drawer is a panel that slides in from an edge of the viewport, with navigation, settings or a form that adds to the page.
	- Usage:
    ```tsx
    <script>
      import { Drawer, DrawerHeader, DrawerBody, Button } from 'fluentui-svelte';
      let open = $state(false);
    </script>

    <Button onclick={() => (open = true)}>Open</Button>
    <Drawer bind:open>
      <DrawerHeader title="Settings" />
      <DrawerBody>Content</DrawerBody>
    </Drawer>
    ```
 -->
{#snippet content()}
	<div class="fs-drawer-content">{@render children?.()}</div>
	{#if resizable}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
		<div
			class="fs-drawer-resize-handle"
			role="separator"
			tabindex="0"
			aria-label={resizeLabel}
			aria-orientation={horizontal ? 'vertical' : 'horizontal'}
			aria-valuenow={size.endsWith('px') ? parseFloat(size) : undefined}
			aria-valuemin={MIN_SIZE}
			onpointerdown={onHandleDown}
			onkeydown={onHandleKeydown}
		></div>
	{/if}
{/snippet}

{#if type === 'inline'}
	<div
		{...attributes}
		{id}
		class={[
			'fs-drawer',
			'fs-drawer-inline',
			`fs-drawer-${position}`,
			preset && `fs-drawer-size-${size}`,
			floating && 'fs-drawer-floating',
			resizing && 'fs-drawer-resizing',
			classes
		]}
		style:--fs-drawer-size={preset ? undefined : size}
		role={attributes.role ?? 'region'}
		aria-labelledby={labelledBy}
		data-level={level}
		hidden={!open}
		bind:this={ref}
	>
		{@render content()}
	</div>
{:else}
	<dialog
		{...attributes}
		{id}
		class={[
			'fs-drawer',
			'fs-drawer-overlay',
			`fs-drawer-${position}`,
			preset && `fs-drawer-size-${size}`,
			floating && 'fs-drawer-floating',
			hideBackdrop && 'fs-drawer-hide-backdrop',
			resizing && 'fs-drawer-resizing',
			classes
		]}
		style:--fs-drawer-size={preset ? undefined : size}
		aria-labelledby={labelledBy}
		data-level={level}
		bind:this={ref}
		{onpointerdown}
		{onclick}
		{oncancel}
		{onkeydown}
		{onclose}
	>
		{@render content()}
	</dialog>
{/if}

<style>
	.fs-drawer {
		--fs-drawer-gap: 0px;
		--fs-drawer-duration: var(--fs-normal-duration, 333ms);
		--fs-drawer-size: 320px;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: none;
		overflow: hidden;
		color: var(--fs-text-primary);
		/* The surface of a Dialog: the translucent layer over a solid base, with the acrylic noise on top. */
		background: linear-gradient(var(--fs-layer-alt), var(--fs-layer-alt)), var(--fs-solid-background-base);
		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: var(--fs-acrilic-noise);
			background-size: 2.5rem;
			filter: grayscale(1);
			opacity: 0.065;
			border-radius: inherit;
			pointer-events: none;
		}

		&.fs-drawer-size-medium {
			--fs-drawer-size: 592px;
		}
		&.fs-drawer-size-large {
			--fs-drawer-size: 940px;
		}
		&.fs-drawer-size-full {
			--fs-drawer-size: 100%;
		}

		&.fs-drawer-floating {
			--fs-drawer-gap: 0.5rem;
			border: 1px solid var(--fs-control-surface-stroke-flyout);
			border-radius: var(--fs-control-overlay-border-radius);
		}

		&.fs-drawer-resizing {
			--fs-drawer-duration: 0ms;
			user-select: none;
		}

		& .fs-drawer-content {
			position: relative;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			inline-size: 100%;
			block-size: 100%;
		}

		/* An 8px strip on the inner edge, with a 2px line on hover, focus and drag. */
		& .fs-drawer-resize-handle {
			position: absolute;
			z-index: 1;
			outline: none;
			touch-action: none;
			&::after {
				content: '';
				position: absolute;
				background: transparent;
				transition: background var(--fs-fast-duration, 167ms);
			}
			&:hover::after,
			&:focus-visible::after {
				background: var(--fs-control-strong-stroke-default);
			}
			&:focus-visible::after {
				background: var(--fs-focus-stroke-outer);
			}
		}
		&.fs-drawer-resizing .fs-drawer-resize-handle::after {
			background: var(--fs-accent-fill-default);
		}
		&.fs-drawer-start,
		&.fs-drawer-end {
			& .fs-drawer-resize-handle {
				inset-block: 0;
				inline-size: 8px;
				cursor: ew-resize;
				&::after {
					inset-block: 0;
					inline-size: 2px;
				}
			}
		}
		&.fs-drawer-top,
		&.fs-drawer-bottom {
			& .fs-drawer-resize-handle {
				inset-inline: 0;
				block-size: 8px;
				cursor: ns-resize;
				&::after {
					inset-inline: 0;
					block-size: 2px;
				}
			}
		}
		&.fs-drawer-start .fs-drawer-resize-handle {
			inset-inline-end: 0;
			&::after {
				inset-inline-end: 0;
			}
		}
		&.fs-drawer-end .fs-drawer-resize-handle {
			inset-inline-start: 0;
			&::after {
				inset-inline-start: 0;
			}
		}
		&.fs-drawer-top .fs-drawer-resize-handle {
			inset-block-end: 0;
			&::after {
				inset-block-end: 0;
			}
		}
		&.fs-drawer-bottom .fs-drawer-resize-handle {
			inset-block-start: 0;
			&::after {
				inset-block-start: 0;
			}
		}
	}

	/* Overlay: a fixed dialog on one edge that slides in and out. */
	.fs-drawer.fs-drawer-overlay {
		--fs-drawer-hidden: translate(calc(-100% - var(--fs-drawer-gap)), 0);
		position: fixed;
		inset: var(--fs-drawer-gap);
		z-index: 1100;
		max-inline-size: none;
		max-block-size: none;
		box-shadow: var(--fs-shadow-dialog);
		transform: var(--fs-drawer-hidden);
		transition:
			transform var(--fs-drawer-duration) var(--fs-soft-dismiss, cubic-bezier(1, 0, 1, 1)),
			display var(--fs-drawer-duration) allow-discrete,
			overlay var(--fs-drawer-duration) allow-discrete;

		&.fs-drawer-start,
		&.fs-drawer-end {
			inline-size: min(var(--fs-drawer-size), 100vw - 2 * var(--fs-drawer-gap));
			block-size: auto;
		}
		&.fs-drawer-top,
		&.fs-drawer-bottom {
			inline-size: auto;
			block-size: min(var(--fs-drawer-size), 100dvh - 2 * var(--fs-drawer-gap));
		}
		&.fs-drawer-start {
			inset-inline-end: auto;
			&:dir(rtl) {
				--fs-drawer-hidden: translate(calc(100% + var(--fs-drawer-gap)), 0);
			}
		}
		&.fs-drawer-end {
			inset-inline-start: auto;
			--fs-drawer-hidden: translate(calc(100% + var(--fs-drawer-gap)), 0);
			&:dir(rtl) {
				--fs-drawer-hidden: translate(calc(-100% - var(--fs-drawer-gap)), 0);
			}
		}
		&.fs-drawer-top {
			inset-block-end: auto;
			--fs-drawer-hidden: translate(0, calc(-100% - var(--fs-drawer-gap)));
		}
		&.fs-drawer-bottom {
			inset-block-start: auto;
			--fs-drawer-hidden: translate(0, calc(100% + var(--fs-drawer-gap)));
		}

		&[open] {
			display: flex;
			transform: none;
			transition-timing-function: var(--fs-fast-dismiss, cubic-bezier(0, 0, 0, 1));
		}
		@starting-style {
			&[open] {
				transform: var(--fs-drawer-hidden);
			}
		}

		&::backdrop {
			opacity: 0;
			background-color: var(--fs-smoke-background-default);
			transition:
				opacity var(--fs-drawer-duration) var(--fs-soft-dismiss, cubic-bezier(1, 0, 1, 1)),
				display var(--fs-drawer-duration) allow-discrete,
				overlay var(--fs-drawer-duration) allow-discrete;
		}
		&.fs-drawer-floating::backdrop {
			backdrop-filter: blur(0.25rem);
		}
		&.fs-drawer-hide-backdrop::backdrop {
			background-color: transparent;
			backdrop-filter: none;
		}
		&[open]::backdrop {
			opacity: 1;
			transition-timing-function: var(--fs-fast-dismiss, cubic-bezier(0, 0, 0, 1));
		}
	}
	@starting-style {
		.fs-drawer.fs-drawer-overlay[open]::backdrop {
			opacity: 0;
		}
	}

	/* Inline: a panel in the layout that grows from its edge and pushes the content aside. */
	.fs-drawer.fs-drawer-inline {
		position: relative;
		flex: none;
		transition:
			inline-size var(--fs-drawer-duration) var(--fs-fast-dismiss, cubic-bezier(0, 0, 0, 1)),
			block-size var(--fs-drawer-duration) var(--fs-fast-dismiss, cubic-bezier(0, 0, 0, 1)),
			display var(--fs-drawer-duration) allow-discrete;

		&:not([hidden]) {
			display: flex;
		}
		&.fs-drawer-floating {
			margin: var(--fs-drawer-gap);
		}

		&.fs-drawer-start,
		&.fs-drawer-end {
			inline-size: var(--fs-drawer-size);
			max-inline-size: 100%;
			& .fs-drawer-content {
				min-inline-size: var(--fs-drawer-size);
			}
			&[hidden] {
				inline-size: 0;
			}
			@starting-style {
				inline-size: 0;
			}
		}
		&.fs-drawer-top,
		&.fs-drawer-bottom {
			block-size: var(--fs-drawer-size);
			max-block-size: 100%;
			& .fs-drawer-content {
				min-block-size: var(--fs-drawer-size);
			}
			&[hidden] {
				block-size: 0;
			}
			@starting-style {
				block-size: 0;
			}
		}
		&:not(.fs-drawer-floating) {
			&.fs-drawer-start {
				border-inline-end: 1px solid var(--fs-divider-stroke-default);
			}
			&.fs-drawer-end {
				border-inline-start: 1px solid var(--fs-divider-stroke-default);
			}
			&.fs-drawer-top {
				border-block-end: 1px solid var(--fs-divider-stroke-default);
			}
			&.fs-drawer-bottom {
				border-block-start: 1px solid var(--fs-divider-stroke-default);
			}
		}
	}

	:global(:root[data-fs-reduced-motion='true']) .fs-drawer {
		--fs-drawer-duration: 0ms;
	}
	@media (prefers-reduced-motion: reduce) {
		:global(:root:not([data-fs-reduced-motion='false'])) .fs-drawer {
			--fs-drawer-duration: 0ms;
		}
	}
</style>
