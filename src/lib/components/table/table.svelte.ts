import { PREFIX } from '$constants';
import { createFSContext } from '$internal';
import type { Attachment } from 'svelte/attachments';
import type { TableContext } from './types.ts';

export const COMPONENT_NAME = `${PREFIX}-table-`;

export const [getTableContext, setTableContext] = createFSContext<TableContext>();

/** The cells a grid mover lands on. Every kind of cell takes a turn, header and selection included. */
export const TABSPOT_ITEMS = '.fs-table-header-cell, .fs-table-cell, .fs-table-selection-cell';

/** Cells the cursor passes over instead of landing on, which is what `focusMode: 'none'` asks for. */
export const TABSPOT_SKIP = '[data-fs-focus-mode="none"]';

/** Everything that would answer the Tab key on its own. */
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]';

/** Controls that spend `Space` themselves, so a row must not take it from under them. */
const SPACE_CONSUMERS = 'a[href], button, input, select, textarea, [contenteditable="true"]';

/**
 * `Space` activates a row or a cell the consumer wired, the same way a pointer click does. The grid
 * pattern asks for it: the arrow keys park the focus on a cell, and a cell answers no key by itself.
 *
 * Only a wired element claims the key — anywhere else `Space` stays the page scroll it always was.
 */
export const selectOnSpace: Attachment<HTMLElement> = (node) => {
	const onkeydown = (e: KeyboardEvent) => {
		if (e.key !== ' ' || e.defaultPrevented) return;
		if ((e.target as HTMLElement).closest(SPACE_CONSUMERS)) return;
		e.preventDefault();
		node.click();
	};

	node.addEventListener('keydown', onkeydown);
	return () => node.removeEventListener('keydown', onkeydown);
};

/**
 * Resolves which column a cell sits in. A cell is always a direct child of its row, so its position
 * among its siblings is the column — nothing else in the markup knows it.
 *
 * Tabspot reads the attribute to find a cell again once a virtualized row has remounted, and the
 * reported index is what lets a cell look its own width up.
 */
export const colIndex =
	(report?: (index: number) => void): Attachment<HTMLElement> =>
	(node) => {
		const parent = node.parentElement;
		if (!parent) return;
		const index = [...parent.children].indexOf(node);
		node.dataset.colindex = String(index);
		report?.(index);
	};

/**
 * `focusMode: 'group'`. The focusable content of a cell is held out of the tab order until the user
 * asks for it: `Enter` steps in, `Escape` steps back out to the cell itself.
 *
 * Without it every button in every row is its own tab stop, which is exactly what the single tab
 * stop of a grid exists to avoid. Tabspot cannot express this on its own — its grouper is driven by
 * a direction, and a grid has already spent all four arrows — so the two keys are handled here.
 */
export const focusGroup: Attachment<HTMLElement> = (node) => {
	/**
	 * The tabindex a held element carried before is parked on the element itself, so releasing
	 * restores it rather than guessing, and a row that remounts takes its own bookkeeping with it.
	 */
	const hold = () => {
		for (const el of node.querySelectorAll<HTMLElement>(FOCUSABLE)) {
			if (el.dataset.fsHeldTabindex !== undefined) continue;
			el.dataset.fsHeldTabindex = el.getAttribute('tabindex') ?? '';
			el.setAttribute('tabindex', '-1');
		}
	};

	const release = () => {
		for (const el of node.querySelectorAll<HTMLElement>('[data-fs-held-tabindex]')) {
			const previous = el.dataset.fsHeldTabindex;
			if (previous) el.setAttribute('tabindex', previous);
			else el.removeAttribute('tabindex');
			delete el.dataset.fsHeldTabindex;
		}
	};

	const onkeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && e.target === node) {
			release();
			const first = node.querySelector<HTMLElement>(FOCUSABLE);
			if (!first) return hold();
			e.preventDefault();
			first.focus();
		} else if (e.key === 'Escape' && e.target !== node) {
			// The root would otherwise read the same Escape as "leave the table".
			e.preventDefault();
			e.stopPropagation();
			hold();
			node.focus();
		}
	};

	/** Focus moving out of the cell ends the visit, however it left. */
	const onfocusout = (e: FocusEvent) => {
		if (!node.contains(e.relatedTarget as Node | null)) hold();
	};

	hold();
	// Content that arrives later — a menu opening, a row re-rendering — has to be held too.
	const observer = new MutationObserver(() => {
		if (!node.contains(document.activeElement)) hold();
	});
	observer.observe(node, { childList: true, subtree: true });

	node.addEventListener('keydown', onkeydown);
	node.addEventListener('focusout', onfocusout);

	return () => {
		observer.disconnect();
		node.removeEventListener('keydown', onkeydown);
		node.removeEventListener('focusout', onfocusout);
		release();
	};
};

/**
 * The element a table part renders. An explicit `as` wins, otherwise the part falls back to its
 * semantic tag, or to a `div` when the table opted out of native elements.
 *
 * Every part accepts exactly its semantic tag or a `div`, so the invariant is checked here rather
 * than against a list each caller would have to carry.
 */
export const getTag = <Native extends string>(
	as: string | undefined,
	native: Native,
	noNativeElements: boolean
): Native | 'div' => {
	const tag = as ?? (noNativeElements ? 'div' : native);
	if (tag !== native && tag !== 'div') throw new Error(`Invalid tag: ${tag}. Must be one of ${native}, div`);
	return tag as Native | 'div';
};

/** Reads the table context, or fails loudly when a part is rendered outside a `Table`. */
export const requireTableContext = (): TableContext => {
	const context = getTableContext();
	if (!context) throw new Error(`No TableContext found for ${COMPONENT_NAME}.`);
	return context;
};
