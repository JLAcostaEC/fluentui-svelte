import type { AvatarProps } from '../avatar/type.ts';

/** @propsmith PersonaProps */
export type PersonaProps = {
	/** The name of the person or entity represented by this Persona. It is also used by the avatar for its initials. */
	name: string;
	/** The size of the avatar in pixels. The text scales with it.
	 * @default 42
	 */
	size?: number;
	/** Text to display below the name. */
	primaryText?: string;
	/** Text to display below the primary text. */
	secondaryText?: string;
	/** Text to display below the secondary text. */
	tertiaryText?: string;
	/** How the text block is aligned.
	 * @default 'left'
	 */
	textAlign?: 'left' | 'center' | 'right';
	/** Where the text block sits relative to the avatar.
	 * @default 'right'
	 */
	textPosition?: 'top' | 'bottom' | 'left' | 'right';
	/** Renders the presence badge on its own, without the avatar behind it. */
	presenceOnly?: boolean;
	/** How the avatar is aligned against the text block.
	 * @default 'center'
	 */
	avatarAlign?: 'start' | 'center' | 'end';
	/** The DOM reference of the persona element.
	 * @bindable
	 */
	element?: HTMLDivElement;
	/** The props to spread on the avatar.
	 * @type AvatarProps
	 */
	avatar?: AvatarProps;
	/** The presence badge to display as a status indicator.
	 * @type BadgePresence
	 */
	presence?: AvatarProps['badge'];
};
