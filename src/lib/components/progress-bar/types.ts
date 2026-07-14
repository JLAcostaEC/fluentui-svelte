import type { SVGAttributes } from 'svelte/elements';
import type { ProgressStatus } from '$types';

export type ProgressBarProps = {
	/** The current value of the progress bar. */
	value?: number | null;
	/** The class to apply to the progress bar. */
	class?: string;
	/** Get the DOM reference of the progress bar element. */
	ref?: SVGElement;
	/** The minimum value of the progress bar. */
	min?: number;
	/** The maximum value of the progress bar. */
	max?: number;
	/** Whether to hide the rail element. */
	hideRail?: boolean;
	/** Get the DOM reference of the rail element. */
	railElement?: SVGRectElement;
	/** Get the DOM reference of the track element. */
	secondaryTrackElement?: SVGRectElement;
	/** Get the DOM reference of the track element. */
	trackElement?: SVGRectElement;
	/** The current status of the progress bar. */
	status?: ProgressStatus;
} & SVGAttributes<SVGElement>;
