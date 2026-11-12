import { onClickOutside } from 'runed';
import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export function selectDirection(): Attachment<HTMLSelectElement & { multiple?: boolean }> {
	return (node) => {
		if (node.multiple) return;
		const element = node as unknown as Element;

		let observer: ResizeObserver | null = null;
		let trackingListeners: (() => void)[] = [];
		let frame = 0;

		function updateDirection() {
			const positionArea = getComputedStyle(element, '::picker(select)').positionArea ?? '';
			const above = positionArea
				.split(' ')
				.some((part) => ['block-start', 'self-start', 'top', 'start'].includes(part));
			node.classList.toggle('popover-up', above);
		}

		function stopTracking() {
			trackingListeners.forEach((off) => off());
			trackingListeners = [];
			observer?.disconnect();
			observer = null;
			node.classList.remove('popover-up', 'open');
		}

		function syncOpen() {
			// Read the browser state, including opening by keyboard and closing with Escape.
			if (!node.matches(':open')) return stopTracking();

			if (!observer) {
				observer = new ResizeObserver(updateDirection);
				observer.observe(document.documentElement);
				trackingListeners = [
					on(window, 'scroll', updateDirection, { passive: true, capture: true }),
					on(window, 'resize', updateDirection)
				];
			}

			node.classList.add('open');
			updateDirection();
		}

		function scheduleSync() {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(syncOpen);
		}

		onClickOutside(() => element, stopTracking);

		const events = ['click', 'keydown', 'change', 'blur'] as const;
		const listeners = events.map((event) => on(node, event, scheduleSync));

		return () => {
			cancelAnimationFrame(frame);
			stopTracking();
			listeners.forEach((off) => off());
		};
	};
}
