<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { on } from 'svelte/events';
	import { useDebounce } from 'runed';
	import { COMPONENT_NAME, getMenuContext } from './menu.svelte.ts';
	import { preventDefault } from '$internal';
	import { VIRTUAL_ELEMENT } from '$constants';

	let {
		disabled,
		ref
	}: {
		/** Disables the user interaction. */
		disabled?: boolean;
		/** The reference element for the context menu. */
		ref: HTMLElement;
	} = $props();

	const context = getMenuContext();

	if (!context) throw new Error(`No MenuContext found for ${COMPONENT_NAME}.`);

	const { state: _state } = context;

	const { toggle, close } = context.methods;

	const { id, openingDelay } = context.config;

	let offClick: (() => void) | null = $state(null);

	const debounced = useDebounce(async (e: MouseEvent) => {
		if (disabled) return;

		const { clientX, clientY } = e;

		_state.ref = {
			getBoundingClientRect() {
				return {
					width: 0,
					height: 0,
					x: clientX,
					y: clientY,
					top: clientY,
					right: clientX,
					bottom: clientY,
					left: clientX
				};
			}
		};

		// Add event to check if user click outside the menu to close it
		offClick ??= on(document, 'click', (e) => {
			const clickTarget = e.target as HTMLElement;

			if (!clickTarget.closest(`#fs-menu-popover-${id}`)) {
				_state.locked = false;
				close(e);
				offClick?.();
				offClick = null;
			}
		});

		_state.locked = !_state.locked;
		toggle(e);

		// When requesting to open the context menu when is already open, we need to wait for the toggle to finish before allowing it to be toggled again
		if (!_state.open) {
			await tick();
			_state.locked = !_state.locked;
			toggle(e);
		}
	}, openingDelay || 0);

	onMount(() => {
		_state.ref ??= VIRTUAL_ELEMENT;

		const off = on(ref ? ref : document.body, 'contextmenu', preventDefault(debounced));

		return () => {
			off();
			offClick?.();
		};
	});
</script>
