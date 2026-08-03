import { onClickOutside } from 'runed';
import type { Attachment } from 'svelte/attachments';

export function selectDirection(): Attachment<HTMLSelectElement & { multiple?: boolean }> {
	return (node) => {
		// No needed when multiple is enabled
		if (node.multiple) return;

		let cleanup: (() => void) | null = $state(null);
		let isOpen = $state(false);

		function updateDirection() {
			const positionArea = window?.getComputedStyle(node as unknown as Element, '::picker(select)')
				.positionArea;
			node.classList.toggle('popover-up', positionArea.includes('start'));
			if (isOpen) {
				node.classList.add('open');
			} else {
				node.classList.remove('open');
			}
		}

		function onToggle() {
			if (!isOpen) {
				window.addEventListener('scroll', updateDirection, { passive: true, capture: true });
				const ro = new ResizeObserver(updateDirection);
				ro.observe(document.documentElement);
				updateDirection();

				cleanup = () => {
					window.removeEventListener('scroll', updateDirection, { capture: true });
					ro.disconnect();
					isOpen = false;
					cleanup = null;
					node.classList.remove('popover-up');
					node.classList.remove('open');
				};
				isOpen = true;
			} else {
				cleanup?.();
			}
		}

		onClickOutside(
			() => node as unknown as Element,
			() => {
				cleanup?.();
			}
		);

		node.addEventListener('click', onToggle);

		return () => {
			cleanup?.();
			node.removeEventListener('click', onToggle);
		};
	};
}
