import { on } from 'svelte/events';
import { useResizeObserver } from 'runed';

export const reactiveBoundingRect = () => {
	let ref = $state<HTMLElement | null>(null);
	let rect: Omit<DOMRect, 'toJSON'> = $state({
		bottom: 0,
		height: 0,
		left: 0,
		right: 0,
		top: 0,
		width: 0,
		x: 0,
		y: 0
	});

	const update = () => {
		if (!ref) return;
		rect = ref.getBoundingClientRect();
	};

	$effect(() => {
		if (!ref) return;
		update();
		const offResize = on(window, 'resize', update);
		const offScroll = on(window, 'scroll', update);

		// We need to use ResizeObserver to detect changes in the size of the element
		const { stop } = useResizeObserver(ref, () => update());

		return () => {
			offResize();
			offScroll();
			stop();
		};
	});

	return {
		get ref() {
			return ref;
		},
		get rect() {
			return rect;
		},
		set ref(el) {
			ref = el;
		},
		update
	};
};
