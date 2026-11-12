import type { Attachment } from 'svelte/attachments';

/** Keep pill corners stable when a popup flattens one edge of the field. */
export const circularInputShape: Attachment<HTMLElement> = (element) => {
	const update = (width = element.offsetWidth, height = element.offsetHeight) => {
		if (width && height) element.style.setProperty('--input-circular-radius', `${Math.min(width, height) / 2}px`);
	};

	update();

	const observer = new ResizeObserver(([entry]) => {
		const box = entry.borderBoxSize?.[0];
		if (box) update(box.inlineSize, box.blockSize);
		else update();
	});
	observer.observe(element, { box: 'border-box' });

	return () => {
		observer.disconnect();
		element.style.removeProperty('--input-circular-radius');
	};
};
