/**
 * The docs showcase sizes itself to its content, so a row of tags never wraps on its own.
 * This attachment caps the example at the width of its card.
 */
export const fitCard = (node: HTMLElement) => {
	const card = node.closest<HTMLElement>('.showcase');
	const grid = node.closest<HTMLElement>('.showcase-grid');
	if (!card || !grid) return;

	const fit = () => {
		const { marginInlineStart, marginInlineEnd } = getComputedStyle(grid);
		node.style.maxWidth = `${card.clientWidth - parseFloat(marginInlineStart) - parseFloat(marginInlineEnd)}px`;
	};

	fit();
	const observer = new ResizeObserver(fit);
	observer.observe(card);
	return () => observer.disconnect();
};
