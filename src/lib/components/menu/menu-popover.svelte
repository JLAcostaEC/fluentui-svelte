<script lang="ts">
	import { circOut } from 'svelte/easing';
	import { Flyout } from '$lib/index.js';
	import { COMPONENT_NAME, getIntroTransition, getMenuContext } from './menu.svelte.ts';
	import { flip, hide, offset, shift } from '@floating-ui/dom';
	import { useDebounce } from 'runed';
	import { floating, flyToOffset, getCSSDuration, reactiveBoundingRect } from '$internal';
	import type { Snippet } from 'svelte';
	import type { ComputePositionConfig } from '@floating-ui/dom';

	let {
		ref: _ref,
		open: _open = $bindable(),
		placement,
		positionConfig: floatingPosition = {
			placement,
			middleware: [offset(-2), flip({ crossAxis: true, padding: 0 }), shift({ crossAxis: true, padding: 0 }), hide()],
			strategy: 'fixed'
		},
		children
	}: {
		ref?: HTMLElement;
		open?: boolean;
		placement?: ComputePositionConfig['placement'];
		positionConfig?: Partial<ComputePositionConfig>;
		children: Snippet;
	} = $props();

	const context = getMenuContext();

	if (!context) throw new Error(`No MenuContext found for ${COMPONENT_NAME}.`);

	const { positionConfig, id, isSubMenu, openOnHover, openingDelay } = context.config;

	const { close } = context.methods;

	let opened = $derived(_open ?? context.state.open);

	let ref = $derived(_ref ?? context.state.ref);

	let { state: _state } = context;

	// The `placement` prop wins over the one coming from the config
	let config = $derived.by(() => {
		const base = positionConfig ?? floatingPosition;

		return { ...base, placement: placement ?? base.placement ?? (isSubMenu ? 'right-start' : 'bottom-start') };
	});

	let boundingElement = reactiveBoundingRect();

	let duration = $state(333);

	let element: HTMLElement | null = $state(null);

	const debounced = useDebounce((e: MouseEvent) => {
		// Where the mouse is moving to
		const to = e.relatedTarget as HTMLElement | null;
		const isPopover = to?.id === `fs-menu-popover-${id}` || to?.closest(`#fs-menu-popover-${id}`);
		const isTrigger =
			to?.id === `fs-${isSubMenu ? 'submenu' : 'menu'}-trigger-${id}` ||
			to?.closest(`#fs-${isSubMenu ? 'submenu' : 'menu'}-trigger-${id}`);

		if (to && !isPopover && !isTrigger && !_state.locked) close(e);
	}, openingDelay || 0);

	$effect.pre(() => {
		duration = getCSSDuration('--fs-normal-duration') || 333;

		if (isSubMenu) floatingPosition.placement ??= 'right-start';

		if (ref && ref instanceof HTMLElement) boundingElement.ref = ref;

		// Make sure to update the position of boundingElement before the popover is shown
		if (opened) boundingElement.update();
	});
</script>

{#if opened && ref}
	{@const isRefAnElement = ref instanceof HTMLElement}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={element}
		class="fs-menu-popover"
		onmouseleave={openOnHover ? (e: MouseEvent) => debounced(e) : undefined}
		{@attach ref ? floating(ref, config) : undefined}
		style={`--position=${isSubMenu ? 'absolute' : 'fixed'} --min-width=${isRefAnElement && !isSubMenu ? `${boundingElement.rect.width}px` : 'max-content'}`}
		in:flyToOffset={isRefAnElement
			? {
					...getIntroTransition({ config, anchor: boundingElement.rect, element, ref, isSubMenu }),
					duration: duration,
					easing: circOut
				}
			: undefined}
	>
		<Flyout class="fs-menu-popover" id="fs-menu-popover-{id}" role="menu">
			{@render children()}
		</Flyout>
	</div>
{/if}

<style>
	.fs-menu-popover {
		position: var(--position, fixed);
		top: 0;
		left: 0;
		width: max-content;
		min-width: var(--min-width);
		z-index: 110;
		& :global(.fs-flyout),
		& :global(.fs-flyout::before) {
			border-radius: var(--fs-control-border-radius);
		}
		& :global(.fs-flyout) {
			padding: 0;
			& :global(> .wrapper) {
				width: 100% !important;
			}
		}
	}
</style>
