import { createFSContext } from '$internal';

export type LabelContext = {
	/** The id of the label text, which names a visible control that stands in for a native field. */
	readonly labelId: string;
	/** The id the label is for: a field with no id of its own takes it. */
	readonly fieldId: string;
	/** Makes a field, through the id it reports, the one the label is for. Only the first field to ask gets it. */
	claim: (id: () => string | null | undefined) => boolean;
};

export const [getLabelContext, setLabelContext] = createFSContext<LabelContext>();

/**
 * The Label a field is inside, when the field is the first one there to claim it: the label is then
 * for that field. Outside a Label, and for any later field, it is `null`, and the field works on its own.
 */
export function claimLabel(id: () => string | null | undefined): Omit<LabelContext, 'claim'> | null {
	const label = getLabelContext();
	return label?.claim(id) ? label : null;
}
