import type { AvatarProps } from '../avatar/type.ts';

export type PersonaProps = {
	name: string;
	size?: number;
	/** Text to display below the name */
	primaryText?: string;
	/** Text to display below the primary text */
	secondaryText?: string;
	/** Text to display below the secondary text */
	tertiaryText?: string;
	textAlign?: 'left' | 'center' | 'right';
	textPosition?: 'top' | 'bottom' | 'left' | 'right';
	presenceOnly?: boolean;
	avatarAlign?: 'start' | 'center' | 'end';
	element?: HTMLDivElement;
	avatar?: AvatarProps;
	presence?: AvatarProps['badge'];
};
