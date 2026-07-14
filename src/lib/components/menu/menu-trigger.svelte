<script lang="ts">
	import { on } from 'svelte/events';
	import { useDebounce } from 'runed';
	import { onMount, tick } from 'svelte';
	import { COMPONENT_NAME, getMenuContext } from './menu.svelte.ts';
	import ChevronRightFilled from 'fluentui-icons-svelte/ChevronRightFilled.svelte';
	import type { Component, Snippet } from 'svelte';
	import type { MenuState } from './types.ts';
	import type { ButtonProps } from '../button/types.ts';
	import type { Shapes } from '$types';

	let FALLBACK_ID = $props.id();

	let {
		disabled,
		shape,
		icon: Icon,
		children
	}: {
		/** Disables the user interaction. */
		disabled?: boolean;
		/** A button can be rounded, circular, or square. */
		shape?: Shapes;
		/** An optional icon for the button. */
		icon?: Snippet | Component;
		children?:
			| Snippet<
					[
						{
							state: MenuState;
							menuTriggerProps: ButtonProps<'button'>;
							primaryButtonProps: ButtonProps<'button'>;
						}
					]
			  >
			| undefined;
	} = $props();

	const context = getMenuContext();

	if (!context) throw new Error(`No MenuContext found for ${COMPONENT_NAME}.`);

	const { state: _state } = context;

	const { toggle, open, close } = context.methods;

	const { id, isSubMenu, openOnHover, openingDelay, parentHasCheckmarks, parentHasIcons } = context.config;

	const paddingLeft = $derived(1.25 * (+!!(parentHasIcons && !Icon) + +!!parentHasCheckmarks) + 0.9);

	const debounced = useDebounce((e: MouseEvent) => {
		if (e.type === 'mouseover' && !_state.open) {
			return open(e);
		}

		// Where the mouse is moving to
		const to = e.relatedTarget as HTMLElement | null;

		if (to && !to.closest(`#fs-menu-popover-${id}`) && to.parentElement !== _state.ref && !_state.locked) close(e);
	}, openingDelay || 0);

	onMount(() => {
		const off = on(document, 'click', async (e: MouseEvent) => {
			const target = e.target as HTMLElement;

			if (target.closest(`#fs-menu-popover-${id}`)) {
				return;
			}

			if (target === _state.ref) {
				_state.locked = !_state.locked;
				toggle(e);
				// Focus the first button in the popover when opening
				if (_state.open) {
					await tick();
					(document.querySelector(`#fs-menu-popover-${id} .fs-button:first-of-type`) as HTMLElement)?.focus();
				}
				return;
			}

			if (!target.closest(`#fs-menu-popover-${id}`)) {
				_state.locked = false;
				close(e);
			}
		});

		return () => off();
	});

	const menuTriggerProps: Omit<ButtonProps<'button'>, 'ref'> = $derived({
		disabled,
		shape,
		'aria-controls': `fs-menu-popover-${id}`,
		id: `fs-${isSubMenu ? 'submenu' : 'menu'}-trigger-${id}`,
		class: `fs-${isSubMenu ? 'submenu' : 'menu'}-trigger ${
			(parentHasIcons || parentHasCheckmarks) && isSubMenu ? 'align' : ''
		} trigger-id-${FALLBACK_ID}`,
		style: `--padding-left: ${paddingLeft}rem;`,
		onmouseover: openOnHover && !disabled ? (e: MouseEvent) => debounced(e) : undefined,
		onmouseleave: openOnHover && !disabled ? (e: MouseEvent) => debounced(e) : undefined,
		'aria-haspopup': 'menu',
		'aria-expanded': isSubMenu ? (_state.open ? 'true' : 'false') : undefined,
		role: isSubMenu ? 'menuitem' : undefined,
		appearance: isSubMenu ? 'subtle' : undefined,
		isMenuButton: isSubMenu,
		indicatorIcon: isSubMenu ? ChevronRightFilled : undefined
	});

	// svelte-ignore state_referenced_locally
	const primaryButtonProps: ButtonProps<'button'> = $state.raw({
		disabled,
		shape
	});
</script>

{@render children?.({ state: context.state, menuTriggerProps, primaryButtonProps })}

<style>
	:global(.fs-button.fs-submenu-trigger) {
		width: 100%;
		padding: 0.375rem 0.45rem;
		border-radius: var(--fs-control-inner-border-radius);
		justify-content: space-between;
		font-size: var(--fs-body2-font-size);
		line-height: var(--fs-body2-line-height);
		& :global(svg) {
			width: 1rem;
			height: 1rem;
			height: auto;
			fill: currentColor;
		}
		& :global(svg.indicator) {
			width: 1rem;
			height: auto;
			margin-left: 0.6rem;
			margin-right: 0.2rem;
			pointer-events: none;
		}
		&:global(:is(:disabled, [disabled]) :is(svg, .indicator)) {
			color: var(--fs-text-disabled);
		}
		&:global(.align) {
			padding-left: var(--padding-left) !important;
		}
	}
</style>
