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
	dismiss: 'Dismiss'
};
