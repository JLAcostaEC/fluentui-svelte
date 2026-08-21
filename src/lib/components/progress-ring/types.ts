import type { SVGAttributes } from 'svelte/elements';
import type { ProgressStatus } from '$types';

/** @propsmith ProgressRingProps */
export type ProgressRingProps = {
	/** The current value of the progress ring.
	 * @default 0
	 * @bindable
	 */
	value?: number;
	/** The minimum value of the progress ring.
	 * @default 0
	 */
	min?: number;
	/** The maximum value of the progress ring.
	 * @default 100
	 */
	max?: number;
	/** Spins the ring continuously instead of reporting a value. */
	indeterminate?: boolean;
	/** Whether to hide the rail element. */
	hideRail?: boolean;
	/** The size of the progress ring in pixels.
	 * @default 32
	 */
	size?: number;
	/** The DOM reference of the progress ring element.
	 * @bindable
	 */
	ref?: SVGElement;
	/** The DOM reference of the rail element.
	 * @bindable
	 */
	railElement?: SVGCircleElement;
	/** The DOM reference of the track element.
	 * @bindable
	 */
	trackElement?: SVGCircleElement;
	/** The current status of the progress ring, which recolors the track. */
	status?: ProgressStatus;
	/** The class to apply to the progress ring. */
	class?: string;
} & SVGAttributes<SVGElement>;
