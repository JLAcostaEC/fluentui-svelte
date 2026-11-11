import { flip, hide, offset, shift, type ComputePositionConfig } from '@floating-ui/dom';
import type { MediaPlayerLabels } from './types.ts';

let videoJs: Promise<unknown> | undefined;

/**
 * Loads the parts of Video.js a MediaPlayer uses, once per page. They register custom elements and load in the browser
 * only. The player is defined first: its parts ask it for the store when they connect.
 */
export const loadVideoJs = () =>
	(videoJs ??= import('@videojs/html/video/player')
		.then(() =>
			Promise.all([
				import('@videojs/html/ui/container'),
				import('@videojs/html/ui/hotkey'),
				import('@videojs/html/ui/gesture')
			])
		)
		.then(() => customElements.whenDefined('video-player'))
		.catch((error) => {
			// A failed download is tried again by the next player.
			videoJs = undefined;
			throw error;
		}));

/**
 * How the tooltips of the transport controls are placed. In full screen the controls sit at the edges of the screen,
 * and the tooltips keep only a small margin from them, instead of the wide one Tooltip keeps by default.
 */
export const TOOLTIP_POSITION: Partial<ComputePositionConfig> = {
	middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 }), hide()]
};

/** The English texts of a MediaPlayer, used for every label the `labels` prop leaves out. */
export const MEDIA_PLAYER_LABELS: MediaPlayerLabels = {
	play: 'Play',
	pause: 'Pause',
	previous: 'Previous',
	next: 'Next',
	skipBackward: (seconds) => `Skip back ${seconds} seconds`,
	skipForward: (seconds) => `Skip forward ${seconds} seconds`,
	seek: 'Seek',
	seekValue: (time, duration) => `${time} of ${duration}`,
	volume: 'Volume',
	mute: 'Mute',
	unmute: 'Unmute',
	repeat: 'Repeat',
	subtitles: 'Subtitles',
	subtitlesOff: 'Off',
	pictureInPicture: 'Picture in picture',
	exitPictureInPicture: 'Exit picture in picture',
	fullScreen: 'Full screen',
	exitFullScreen: 'Exit full screen',
	moreOptions: 'More options',
	playbackSpeed: 'Playback speed',
	normalSpeed: 'Normal',
	loading: 'Loading',
	error: 'The media could not be played.',
	dismiss: 'Dismiss',
	loadError: 'The player could not be loaded. Check the connection and try again.',
	retry: 'Try again'
};

/** The previous and next tracks a playing player offers to the system media controls. */
export type MediaSessionClaim = { previous: (() => void) | null; next: (() => void) | null };

/** The playing players, in the order they started. The system media controls offer the tracks of the last one. */
const claims: MediaSessionClaim[] = [];

const applyClaims = () => {
	const top = claims.at(-1);
	navigator.mediaSession.setActionHandler('previoustrack', top?.previous ?? null);
	navigator.mediaSession.setActionHandler('nexttrack', top?.next ?? null);
};

/**
 * Gives the system media controls to a player that starts playing. `navigator.mediaSession` is one per page: the
 * returned release hands them back to the player that played before, when it still plays.
 */
export function claimMediaSession(claim: MediaSessionClaim) {
	claims.push(claim);
	applyClaims();
	return () => {
		const index = claims.indexOf(claim);
		if (index < 0) return;
		claims.splice(index, 1);
		// Only the release of the last player changes what the system controls offer.
		if (index === claims.length) applyClaims();
	};
}
