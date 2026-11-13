import { createFSContext } from '#internal';
import type { SegmentedControlContext } from './types.ts';

export const [getSegmentedControlContext, setSegmentedControlContext] = createFSContext<SegmentedControlContext>();

export const requireSegmentedControlContext = (): SegmentedControlContext => {
	const context = getSegmentedControlContext();
	if (!context)
		throw new Error('No SegmentedControlContext found. Render SegmentedControlItem inside SegmentedControl.');
	return context;
};
