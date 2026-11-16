import type { AnnotatedScrollBarLabel } from './types.ts';

export type Entry = { label: string; offset: number; end?: number };
export type Category = Entry & { subgroups: Entry[] };

const byOffset = (a: Entry, b: Entry) => a.offset - b.offset;

/** Whether the labels have to be read from the content. */
export function readsContent(labels: readonly AnnotatedScrollBarLabel[] | string) {
	return (
		typeof labels === 'string' ||
		labels.some((item) => item.selector !== undefined || item.subgroups?.some((sub) => sub.selector !== undefined))
	);
}

/** Resolve the labels to offsets in the content of `target`, sorted, leaving out what is not rendered. */
export function readLabels(target: HTMLElement, labels: readonly AnnotatedScrollBarLabel[] | string): Category[] {
	const bounds = target.getBoundingClientRect();
	// Client rects include CSS transforms; offsets are in layout pixels.
	const zoom = target.offsetHeight ? bounds.height / target.offsetHeight : 1;
	const at = (y: number) => Math.max(0, target.scrollTop + (y - bounds.top) / (zoom || 1) - target.clientTop);
	const measure = (element: Element | null) => {
		if (!element?.getClientRects().length) return null;
		const { top, bottom } = element.getBoundingClientRect();
		return { offset: at(top), end: at(bottom) };
	};

	if (typeof labels === 'string') {
		return [...target.querySelectorAll(labels)]
			.flatMap((group) => {
				const box = measure(group);
				if (!box) return [];

				// A subgroup belongs to the closest group around it.
				const subgroups = [...group.querySelectorAll('[data-scroll-subgroup]')]
					.filter((item) => item.parentElement?.closest(labels) === group)
					.flatMap((item) => {
						const sub = measure(item);
						return sub ? [{ label: item.getAttribute('data-scroll-subgroup') ?? '', ...sub }] : [];
					});
				const name =
					group.getAttribute('data-scroll-label') ||
					group.getAttribute('aria-label') ||
					group.querySelector('h1, h2, h3, h4, h5, h6')?.textContent?.trim() ||
					group.textContent?.trim() ||
					'';
				return [{ label: name, offset: box.offset, subgroups: subgroups.sort(byOffset) }];
			})
			.sort(byOffset);
	}

	const resolve = (item: { offset?: number; selector?: string }) =>
		item.selector === undefined ? { offset: item.offset ?? 0 } : measure(target.querySelector(item.selector));

	return labels
		.flatMap((item) => {
			const box = resolve(item);
			if (!box) return [];

			const subgroups = (item.subgroups ?? []).flatMap((sub) => {
				const position = resolve(sub);
				return position ? [{ label: sub.label, ...position }] : [];
			});
			// A category runs to the next one: only its start counts.
			return [{ label: item.label, offset: box.offset, subgroups: subgroups.sort(byOffset) }];
		})
		.sort(byOffset);
}

/** The label and subgroups at a content offset. */
export function findAt(categories: readonly Category[], offset: number) {
	const index = categories.findLastIndex((category) => category.offset <= offset);
	const category = categories[index];
	if (!category) return { label: undefined, subgroups: [] };

	const end = categories[index + 1]?.offset ?? Infinity;
	const { subgroups } = category;
	return {
		label: category.label,
		// Subgroups side by side share an offset: each ends where it is measured to, or at the next one below.
		subgroups: subgroups
			.filter((sub) => {
				const next = sub.end ?? subgroups.find((other) => other.offset > sub.offset)?.offset ?? end;
				return sub.offset <= offset && offset < next;
			})
			.map((sub) => sub.label)
	};
}

/**
 * The content offset the indicator points at: the center of the viewport, easing to the content edges over
 * half a viewport, which puts the indicator at the ends of the rail when the content is at its ends.
 */
export function toAnchor(offset: number, maximum: number, viewport: number) {
	if (maximum <= 0) return 0;

	const half = viewport / 2;
	const edge = Math.min(half, maximum / 2);
	if (!edge) return offset;

	const ease = 1 + half / edge;
	if (offset < edge) return offset * ease;
	if (offset > maximum - edge) return maximum + viewport - (maximum - offset) * ease;
	return offset + half;
}

/** The scroll offset that puts the indicator at `anchor`, the inverse of `toAnchor`. */
export function fromAnchor(anchor: number, maximum: number, viewport: number) {
	if (maximum <= 0) return 0;

	const extent = maximum + viewport;
	const half = viewport / 2;
	const edge = Math.min(half, maximum / 2);
	const offset = Math.min(extent, Math.max(0, anchor));
	if (!edge) return offset;

	const ease = 1 + half / edge;
	if (offset < edge + half) return offset / ease;
	if (offset > extent - edge - half) return maximum - (extent - offset) / ease;
	return offset - half;
}

/**
 * The top of each label on the rail, or `null` for a hidden one. When they all fit, overlapping labels move
 * apart; otherwise the first one stays and later ones win over the earlier ones they collide with.
 */
export function layoutLabels(tops: readonly number[], height: number, rail: number, gap: number) {
	const result: (number | null)[] = tops.map((top) => Math.min(Math.max(0, top), rail - height));
	const last = result.length - 1;
	if (last < 0 || rail < height) return result.map(() => null);

	if (result.length * (height + gap) - gap <= rail) {
		const placed = result as number[];
		for (let index = 1; index <= last; index++)
			placed[index] = Math.max(placed[index], placed[index - 1] + height + gap);
		placed[last] = Math.min(placed[last], rail - height);
		for (let index = last - 1; index >= 0; index--)
			placed[index] = Math.min(placed[index], placed[index + 1] - height - gap);
		return placed;
	}

	let limit = rail + gap;
	for (let index = last; index > 0; index--) {
		const top = result[index]!;
		if (top + height + gap > limit || top < result[0]! + height + gap) result[index] = null;
		else limit = top;
	}
	return result;
}
