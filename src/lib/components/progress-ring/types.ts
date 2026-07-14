import type { SVGAttributes } from 'svelte/elements';
import type { ProgressStatus } from '$types';

export type ProgressRingProps = {
	/** The current value of the progress ring. */
	value?: number;
	/** The minimum value of the progress ring. */
	min?: number;
	/** The maximum value of the progress ring. */
	max?: number;
	/** Whether the progress ring is indeterminate. */
	indeterminate?: boolean;
	/** Whether to display the rail. */
	hideRail?: boolean;
	/** The size of the progress ring. */
	size?: number;
	/** Get the DOM reference of the progress ring element. */
	ref?: SVGElement;
	/** Get the DOM reference of the rail element. */
	railElement?: SVGCircleElement;
	/** Get the DOM reference of the track element. */
	trackElement?: SVGCircleElement;
	/** The current status of the progress ring. */
	status?: ProgressStatus;
	class?: string;
} & SVGAttributes<SVGElement>;
