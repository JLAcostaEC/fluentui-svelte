import type { SVGAttributes } from 'svelte/elements';
import type { ProgressStatus } from '$types';

/** @propsmith ProgressBarProps */
export type ProgressBarProps = {
	/** The current value of the progress bar. Leave it unset for an indeterminate bar.
	 * @bindable
	 */
	value?: number | null;
	/** The class to apply to the progress bar. */
	class?: string;
	/** The DOM reference of the progress bar element.
	 * @bindable
	 */
	ref?: SVGElement;
	/** The minimum value of the progress bar.
	 * @default 0
	 */
	min?: number;
	/** The maximum value of the progress bar.
	 * @default 100
	 */
	max?: number;
	/** Whether to hide the rail element. */
	hideRail?: boolean;
	/** The DOM reference of the rail element.
	 * @bindable
	 */
	railElement?: SVGRectElement;
	/** The DOM reference of the secondary track element, used while indeterminate.
	 * @bindable
	 */
	secondaryTrackElement?: SVGRectElement;
	/** The DOM reference of the track element.
	 * @bindable
	 */
	trackElement?: SVGRectElement;
	/** The current status of the progress bar, which recolors the track. */
	status?: ProgressStatus;
} & SVGAttributes<SVGElement>;
