import {
	autoUpdate,
	computePosition,
	flip,
	hide,
	offset,
	shift,
	type ComputePositionConfig,
	type ComputePositionReturn,
	type VirtualElement
} from '@floating-ui/dom';
import { roundByDPR } from '$internal';
import { DEFAULT_OFFSET } from '$constants';
import type { Attachment } from 'svelte/attachments';

export interface FloatingOptions {
	/** Use `requestAnimationFrame` for position updates instead of resize/scroll observers. */
	animationFrame?: boolean;
	/** Callback invoked after each position computation. */
	onComputed?: (value: ComputePositionReturn) => void;
	/** Callback invoked if position computation fails. */
	onError?: (error: unknown) => void;
}

/**
 * Svelte attachment that positions a floating element relative to a reference using FloatingUI.
 * Automatically updates position on scroll, resize, and DOM mutations.
 */
export const floating =
	(
		ref: HTMLElement | VirtualElement,
		positionConfig: ComputePositionConfig = {
			placement: 'bottom-start',
			middleware: [offset(DEFAULT_OFFSET), flip(), shift({ padding: DEFAULT_OFFSET }), hide()]
		},
		{ animationFrame, onComputed, onError }: FloatingOptions = {}
	): Attachment<HTMLElement> =>
	(node) => {
		const update = () => {
			computePosition(ref, node, positionConfig)
				.then((data) => {
					const { x, y, middlewareData } = data;

					node.style.transform = `translate(${roundByDPR(x)}px, ${roundByDPR(y)}px)`;
					node.style.visibility = middlewareData.hide?.referenceHidden ? 'hidden' : 'visible';

					onComputed?.(data);
				})
				.catch((err) => {
					onError?.(err);
				});
		};

		const cleanup = autoUpdate(ref, node, update, { animationFrame });

		return () => cleanup();
	};
